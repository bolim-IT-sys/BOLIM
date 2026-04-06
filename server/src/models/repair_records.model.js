const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Repair = sequelize.define(
  "Repair",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    serial_number: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    reported_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    issue_description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    status: {
      type: DataTypes.ENUM("pending", "in_progress", "completed"),
      allowNull: false,
      defaultValue: "pending",
    },
    started_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    completed_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    personnel: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    before_picture: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    after_picture: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "repair_records",
    freezeTableName: true,
    timestamps: true,
    createdAt: "created_at",
  },
);

module.exports = Repair;

{
  /*
await sequelize.sync({ alter: true });
👉 Updates table structure without deleting data    
*/
}
