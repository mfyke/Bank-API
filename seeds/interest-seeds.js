const { Interest } = require('../models');

const interestData = [
  {
    id: 1,
    interest_rate: 0,
    account_type_id: 1,
  },
  {
    id: 2,
    interest_rate: 3.15,
    account_type_id: 2,
  }
];

const seedInterest = () => Interest.bulkCreate(interestData);

module.exports = seedInterest;
