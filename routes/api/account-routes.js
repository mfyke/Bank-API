const router = require('express').Router();
const { Account, User, AccountType, Interest } = require('../../models');
const withAuth = require('../../utils/auth');

// The `/api/accounts` endpoint

router.get('/', withAuth, async (req, res) => {
  try {
    const accounts = await Account.findAll({
      where: {
        user_id: req.session.userId
      },
      attributes: { exclude: ['account_type_id', 'user_id']},
      include: [
        {
          model: User,
          attributes: { exclude: ['hashed_password'] }
        },
        {
          model: AccountType,
          attributes: ['name'],
          include: [
            {
              model: Interest,
              attributes: ['interest_rate']
            }
            
          ]
        }
      ],
    })

    if (accounts) {
      res.json(accounts);
    } else {
      throw { message: 'No accounts found!' }
    }

  } catch (err) {
    res.status(400).json(err);
  }
});

router.get('/:id', withAuth, async (req, res) => {
  try {
    const account = await Account.findOne({
      where: {
        id: req.params.id,
        user_id: req.session.userId,
      },
      attributes: { exclude: ['account_type_id', 'user_id']},
      include: [
        {
          model: User,
          attributes: { exclude: ['hashed_password'] }
        },
        {
          model: AccountType,
          attributes: ['name'],
          include: [
            {
              model: Interest,
              attributes: ['interest_rate']
            }
            
          ]
        }
      ],
    })

    if (account) {
      res.json(account);
    } else {
      throw { message: 'No account found!' }
    }

  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/', withAuth, async (req, res) => {
  try {
    if (parseInt(req.body.user_id) !== req.session.userId) {
      res.status(400).json({ message: 'You may only make bank accounts associated with your user account!' });
      return;
    }

    const account = await Account.create(req.body);
    res.status(200).json(account)
  } catch (err) {
    res.status(400).json(err)
  }
});

router.put('/:id', withAuth, async(req, res) => {
  try{
    const account = await Account.findOne({
      where: {
        id: req.params.id,
      },
    })

    if (account.user_id !== req.session.userId) {
      res.status(400).json({ message: 'You may only make edits to your bank accounts!' });
      return;
    }

    const updatedAccount = await Account.update(req.body, {
      where: {
        id: req.params.id,
      },
    })

    res.status(200).json(updatedAccount)
  } catch (err) {
    res.status(400).json(err)
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const account = await Account.findOne({
      where: {
        id: req.params.id,
      },
    })

    if (account.user_id !== req.session.userId) {
      res.status(400).json({ message: 'You may only delete your bank accounts!' });
      return;
    }

    await Account.destroy({
        where: {
          id: req.params.id,
        },
    })

    res.status(200).json({ message: 'Account successfully deleted!' });
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
