const { User } = require('../models');

const userData = [
  {
    user_name: 'Gyoo007',
    hashed_password: 'q69A2LGn'
  },
  {
    user_name: 'Test123',
    hashed_password: 'uP8K3kpX'
  },
  {
    user_name: 'Xand19',
    hashed_password: 'sqkT7RCf'
  },
  {
    user_name: 'Toastysub0915',
    hashed_password: 'td3ns8Xj'
  },
  {
    user_name: 'Randy328',
    hashed_password: 's9YHSAKC'
  },
];

const seedUsers = () => User.bulkCreate(userData, {individualHooks: true});

module.exports = seedUsers;
