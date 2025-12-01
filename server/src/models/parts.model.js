const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Part = sequelize.define("Part", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  image: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: null,
  },
  partNumber: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  specs: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  unitPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  company: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

module.exports = Part;
