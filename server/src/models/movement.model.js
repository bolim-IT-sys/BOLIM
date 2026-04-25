const { DataTypes } = require("sequelize");
const sequelize = require("../database");

console.log("✅ movement model loaded");

const Movement = sequelize.define(
  "Movement",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    personnel: { type: DataTypes.STRING(50), allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
    description: { type: DataTypes.STRING(100), allowNull: false },
    serial: { type: DataTypes.STRING(100), allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    from: { type: DataTypes.STRING(100), allowNull: false },
    to: { type: DataTypes.STRING(100), allowNull: false },
    condition: { type: DataTypes.STRING(100), allowNull: false },
    remarks: { type: DataTypes.STRING(100), allowNull: false },
  },
  {
    tableName: "equipment_movement",
    freezeTableName: true,
    timestamps: false,
  },
);

module.exports = Movement;
