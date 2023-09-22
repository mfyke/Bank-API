// import models
const Account = require('./Account');
const User = require('./User');
const Interest = require('./Interest');
const AccountType = require('./AccountType');

// Interest belongsTo AccountType
Interest.belongsTo(AccountType, {
  foreignKey: 'account_type_id',
})

// AccountType hasOne Interest
AccountType.hasOne(Interest, {
  foreignKey: 'account_type_id'
})

// Account belongsTo User
Account.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

// User hasMany Accounts
User.hasMany(Account, {
  foreignKey: 'user_id',
})

// Account belongsTo AccountType
Account.belongsTo(AccountType, {
  foreignKey: 'account_type_id',
})

// AccountType hasMany Account
AccountType.hasMany(Account, {
  foreignKey: 'account_type_id',
})

module.exports = {
  Account,
  User,
  Interest,
  AccountType
};
