const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Inventory = sequelize.define("Inventory", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  inventory_name: {
    type: DataTypes.STRING(255),
  },
  item_name: {
    type: DataTypes.STRING(255),
  },
  unique_item: { type: DataTypes.INTEGER, defaultValue: 0 },
});

module.exports = Inventory;
