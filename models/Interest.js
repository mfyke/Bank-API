const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection.js');

class Interest extends Model {}

Interest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    interest_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0,
      },
    },
    account_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'account_type',
        key: 'id',
      }
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'interest'
  }
);

module.exports = Interest;
