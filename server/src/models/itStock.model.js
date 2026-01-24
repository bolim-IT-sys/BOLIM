const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const ITStock = sequelize.define("ITStock", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  from: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },
  to: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },
  stockId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  serialNumber: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  PRDate: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  receivedDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  deployedDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    defaultValue: null,
  },
  station: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: null,
  },
  department: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: null,
  },
  reason: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: null,
  },
  remarks: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: "available",
  },
});

module.exports = ITStock;
