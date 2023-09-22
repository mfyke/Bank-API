const { AccountType } = require('../models');

const accountTypeData = [
  {
    id: 1,
    name: 'checking'
  },
  {
    id: 2,
    name: 'savings'
  }
];

const seedAccountTypes = () => AccountType.bulkCreate(accountTypeData);

module.exports = seedAccountTypes;
