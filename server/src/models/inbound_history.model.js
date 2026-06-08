const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const InboundHistory = sequelize.define(
  "InboundHistory",
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

    inbound_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    tableName: "inbound_history",
    freezeTableName: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  },
);

const Spare = require("./spare_parts.model");

InboundHistory.belongsTo(Spare, {
  foreignKey: "spare_part_id",
});

module.exports = InboundHistory;
