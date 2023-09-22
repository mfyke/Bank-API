const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection.js');

class AccountType extends Model {}

AccountType.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'account_type',
  }
)

module.exports = AccountType;
