const seedUsers = require('./user-seeds');
const seedAccounts = require('./account-seeds');
const seedAccountTypes = require('./account-type-seeds');
const seedInterest = require('./interest-seeds');

const sequelize = require('../config/connection');

const seedAll = async () => {
  await sequelize.sync({ force: true });
  console.log('\n----- DATABASE SYNCED -----\n');

  await seedUsers();
  console.log('\n----- USERS SEEDED -----\n');

  await seedAccountTypes();
  console.log('\n----- ACCOUNT TYPES SEEDED -----\n');

  await seedInterest();
  console.log('\n----- INTEREST RATES SEEDED -----\n');

  await seedAccounts();
  console.log('\n----- ACCOUNTS SEEDED -----\n');

  process.exit(0);
};

seedAll();
