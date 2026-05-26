const { DataTypes } = require("sequelize");
const sequelize = require("../database");

//console.log("✅ spare parts routes loaded");

const Spare = sequelize.define(
  "Spare",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    category_id: { type: DataTypes.INTEGER, allowNull: true },
    part_number: { type: DataTypes.STRING(100), allowNull: true },
    product_name: { type: DataTypes.STRING(50), allowNull: true },
    num: { type: DataTypes.INTEGER, allowNull: true },
    specification: { type: DataTypes.TEXT, allowNull: true },
    maker: { type: DataTypes.STRING(255), allowNull: true },
    stock: { type: DataTypes.INTEGER, allowNull: true },
    unit_price: { type: DataTypes.DECIMAL, allowNull: true },
    remarks: { type: DataTypes.TEXT, allowNull: true },
    app_holder: { type: DataTypes.STRING(255), allowNull: true },
    category: { type: DataTypes.STRING(255), allowNull: true },
  },
  {
    tableName: "spare_parts",
    freezeTableName: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  },
);

module.exports = Spare;
