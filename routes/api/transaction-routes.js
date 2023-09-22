const router = require('express').Router();
const { Account } = require('../../models');
const withAuth = require('../../utils/auth');

const sequelize = require('../../config/connection');

// The `/api/transactions` endpoint

router.post('/transfer/:sender/:receiver', withAuth, async (req, res) => {
  try {

    const result = await sequelize.transaction(async (t) => {
  
      const sender = await Account.findOne({
        where: {
          id: req.params.sender,
        },
      }, { transaction: t });

      const receiver = await Account.findOne({
        where: {
          id: req.params.receiver,
        },
      }, { transaction: t });

      if (sender == null || receiver == null) {
        res.status(400).json({ message: 'Sender or receiver account not found!' });
        return;    
      }

      if (sender.user_id !== req.session.userId || sender.id == receiver.id ) {
        res.status(400).json({ message: 'You may only send money from your own account to another account!' });
        return; 
      }

      sender.balance -= parseFloat(req.body.amount);
      receiver.balance += parseFloat(req.body.amount);

      const senderAcc = {
        balance: sender.balance,
        account_type_id: sender.account_type_id,
        user_id: sender.user_id,
      }

      const receiverAcc = {
        balance: receiver.balance,
        account_type_id: receiver.account_type_id,
        user_id: receiver.user_id,
      }

      await Account.update(senderAcc, {
        where: {
          id: sender.id,
        },
      }, { transaction: t })

      await Account.update(receiverAcc, {
        where: {
          id: receiver.id,
        },
      }, { transaction: t })

      return [sender, receiver];
  
    });

    console.log(result);

    // If the execution reaches this line, the transaction has been committed successfully
    // `result` is whatever was returned from the transaction callback
    res.status(200).json(result);
  
  } catch (error) {
    // If the execution reaches this line, an error occurred.
    // The transaction has already been rolled back automatically by Sequelize!
    console.log(error);
    res.status(400).json(error);
  }
});

module.exports = router;
