const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  pins: { type: DataTypes.INTEGER, defaultValue: 0 },
  it_stocks: { type: DataTypes.INTEGER, defaultValue: 0 },
  materials: { type: DataTypes.INTEGER, defaultValue: 0 },
  movement: { type: DataTypes.INTEGER, defaultValue: 0 },
});

module.exports = User;
