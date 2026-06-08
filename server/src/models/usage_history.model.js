const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const UsageHistory = sequelize.define(
  "UsageHistory",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    spare_part_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    usage_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    tableName: "usage_history",
    freezeTableName: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  },
);

const Spare = require("./spare_parts.model");

UsageHistory.belongsTo(Spare, {
  foreignKey: "spare_part_id",
});

module.exports = UsageHistory;
