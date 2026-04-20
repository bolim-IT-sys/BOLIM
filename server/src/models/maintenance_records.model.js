const { DataTypes } = require("sequelize");
const sequelize = require("../database");

console.log("✅ maintenance routes loaded");

const Maintenance = sequelize.define(
  "Maintenance",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    date: { type: DataTypes.DATE, allowNull: true },
    formNumber: { type: DataTypes.STRING(100), allowNull: true },
    line: { type: DataTypes.STRING(50), allowNull: true },
    process: { type: DataTypes.STRING(100), allowNull: true },
    code: { type: DataTypes.STRING(50), allowNull: true },

    phenomenon: { type: DataTypes.STRING(255), allowNull: true },
    detail: { type: DataTypes.STRING(255), allowNull: true },

    material: { type: DataTypes.STRING(100), allowNull: true },
    qty: { type: DataTypes.INTEGER, allowNull: true },

    occurTime: { type: DataTypes.STRING(50), allowNull: true },
    finishTime: { type: DataTypes.STRING(50), allowNull: true },
    downTime: { type: DataTypes.INTEGER, allowNull: true },

    incharge: { type: DataTypes.STRING(50), allowNull: true },
    shift: { type: DataTypes.STRING(50), allowNull: true },

    type: { type: DataTypes.STRING(50), allowNull: true },
    labelSN: { type: DataTypes.STRING(100), allowNull: true },
    holderNumber: { type: DataTypes.STRING(50), allowNull: true },
    pin: { type: DataTypes.STRING(50), allowNull: true },

    pinSpec: { type: DataTypes.STRING(50), allowNull: true },
    pinHeight: { type: DataTypes.STRING(100), allowNull: true },
    pinDeformation: { type: DataTypes.STRING(100), allowNull: true },
    pinSpring: { type: DataTypes.STRING(100), allowNull: true },

    kyungshinLabel: { type: DataTypes.STRING(100), allowNull: true },
    remarks: { type: DataTypes.STRING(255), allowNull: true },
  },
  {
    tableName: "maintenance_records",
    freezeTableName: true,
    timestamps: false,
  },
);

module.exports = Maintenance;
