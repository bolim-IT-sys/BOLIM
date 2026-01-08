const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Outbound = sequelize.define("Outbound", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  from: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  to: {
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
  outboundDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    defaultValue: null,
  },
});

module.exports = Outbound;
