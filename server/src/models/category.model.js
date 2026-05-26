const { DataTypes } = require("sequelize");
const sequelize = require("../database");

console.log("✅ category model loaded");

const Category = sequelize.define(
  "Category",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(255), allowNull: true },
  },
  {
    tableName: "categories",
    freezeTableName: true,
    timestamps: false,
  },
);

module.exports = Category;
