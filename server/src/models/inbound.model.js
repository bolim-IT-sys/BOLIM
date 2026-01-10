const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Inbound = sequelize.define("Inbound", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  lotNo: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  from: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  partId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  inboundDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    defaultValue: null,
  },
});

module.exports = Inbound;
