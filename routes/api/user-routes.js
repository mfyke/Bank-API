const router = require('express').Router();
const { Account, User, AccountType, Interest } = require('../../models');
const withAuth = require('../../utils/auth');

// The `/api/users` endpoint

router.get('/', withAuth, async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        id: req.session.userId,
      },
      attributes: { exclude: ['hashed_password'] },
      include: [
        {
          model: Account,
          attributes: ['id', 'balance'],
          include: [
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
          ]
        }
      ],
    })
    if (users) {
      res.json(users);
    } else {
      throw { message: 'No users found!' }
    }
  } catch (err) {
    res.status(400).json(err)
  }
});

router.get('/:id', withAuth, async (req, res) => {
  try {
    if (parseInt(req.params.id) !== req.session.userId) {
      throw { message: 'No user found!' }
    }

    const user = await User.findOne({
      where: {
        id: req.params.id,
      },
      attributes: { exclude: ['hashed_password'] },
      include: [
        {
          model: Account,
          attributes: ['id', 'balance'],
          include: [
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
          ]
        }
      ],
    })
    if (user) {
      res.json(user);
    } else {
      throw { message: 'No user found!' }
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    req.body.hashed_password = req.body.plain_text_password;
    const user = await User.create(req.body);
    req.session.save(() => {
      req.session.userId = user.id;
      req.session.username = user.user_name;
      req.session.loggedIn = true;

      res.status(200).json(user)
    })
  } catch(err) {
    res.status(400).json(err);
  }
});

router.put('/:id', withAuth, async (req, res) => {
  try {
    if (parseInt(req.params.id) !== req.session.userId) {
      res.status(400).json({ message: 'You may only make edits to your user information!' });
      return;
    }

    req.body.hashed_password = req.body.plain_text_password;

    const user = await User.update(req.body, {
      where: {
        id: req.params.id,
      },
      individualHooks: true,
    })
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    if (parseInt(req.params.id) !== req.session.userId) {
      res.status(400).json({ message: 'You may only delete your user information!' });
      return;
    }
  
    await User.destroy({
      where: {
        id: req.params.id,
      },
    })

    if (req.session.loggedIn) {
      req.session.destroy();
    }
    res.status(200).json({message: 'User successfully deleted! You are now logged out!'})
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        user_name: req.body.user_name,
      },
    })

    if (!user) {
      res.status(400).json({ message: 'No user account found!' });
      return;
    }

    const validPassword = user.checkPassword(req.body.plain_text_password);

    if (!validPassword) {
      res.status(400).json({ message: 'No user account found!' });
      return;
    }

    req.session.save(() => {
      req.session.userId = user.id;
      req.session.username = user.user_name;
      req.session.loggedIn = true;

      const loggedInUser = {
        id: user.id,
        user_name: user.user_name
      }

      res.status(200).json({ loggedInUser, message: 'You are now logged in!' });
    });
    
  } catch (err) {
    res.status(400).json(err)
  }
});

router.post('/logout', async (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(200).json({ message: 'You are now logged out!' });
    });
  } else {
    res.status(404).json({ message: 'You must be logged in to log out!' });
  }
});

module.exports = router;
