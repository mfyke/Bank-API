const router = require('express').Router();
const { Interest, AccountType } = require('../../models');

const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');

// The `/api/interest` endpoint

router.post('/refresh', withAuth, async (req, res) => {
  try {
    const today = new Date();
    const year = today.getFullYear();
    // the .getMonth() method is 0 indexed, and this API uses an index of 1 as the first month. So this number represents last month. Since this number is a calculated average of the entire month, there is no new data posted until a month is over so we will query for last months data.
    let lastMonth = today.getMonth();

    // converts single digit months into MM format
    if (lastMonth < 10) {
      lastMonth = '0' + lastMonth;
    }

    if (lastMonth == '00') {
      lastMonth = '12';
      year = year - 1;
    }

    // https://fiscaldata.treasury.gov/datasets/average-interest-rates-treasury-securities/average-interest-rates-on-u-s-treasury-securities
    const interestRateResponse = await fetch(`https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/avg_interest_rates?filter=record_calendar_year:eq:${year},record_calendar_month:eq:${lastMonth},security_desc:in:(Treasury Bills)`);

    const rates = await interestRateResponse.json();

    let newRate = {};

    if (rates.data.length > 0) {
      newRate = { 
        interest_rate: rates.data[0].avg_interest_rate_amt 
      }
    }

    const accountType = await AccountType.findOne({
      where: {
        name: 'savings'
      },
    })

    if (accountType == null) {
      res.status(400).json({ message: 'No account type "savings" to apply a new rate to!' });
      return;
    }

    const accountTypeId = accountType.id;

    if (Object.keys(newRate).length === 0) {
      res.status(400).json({ message: 'No new interest rate data found!' });
      return;
    }

    await Interest.update(newRate, {
      where: {
        account_type_id: accountTypeId
      }
    })

    res.status(200).json( { message: 'Interest data updated!', newRate, rates });
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
