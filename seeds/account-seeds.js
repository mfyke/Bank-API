const { Account } = require('../models');

const accountData = [
  {
    balance: 908.65,
    account_type_id: 1,
    user_id: 1,
  },
  {
    balance: 79565.45,
    account_type_id: 2,
    user_id: 1,
  },
  {
    balance: 9462.91,
    account_type_id: 1,
    user_id: 2,
  },
  {
    balance: 34523.91,
    account_type_id: 2,
    user_id: 2,
  },
  {
    balance: 165.23,
    account_type_id: 1,
    user_id: 3,
  },
  {
    balance: 1648.62,
    account_type_id: 2,
    user_id: 3,
  },
  {
    balance: 49261.81,
    account_type_id: 1,
    user_id: 4,
  },
  {
    balance: 6415.62,
    account_type_id: 2,
    user_id: 4,
  },
  {
    balance: 95413.49,
    account_type_id: 1,
    user_id: 5,
  },
  {
    balance: 64918.20,
    account_type_id: 2,
    user_id: 5,
  },
  
];

const seedAccounts = () => Account.bulkCreate(accountData);

module.exports = seedAccounts;
