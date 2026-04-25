const express = require("express");
const router = express.Router();
const Movement = require("../models/movement.model");
const ExcelJS = require("exceljs");
const { Op } = require("sequelize");

router.get("/view", async (req, res) => {
  try {
    const movement = await Movement.findAll({
      order: [["date", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: movement,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const row = await Movement.create(req.body);
    res.json(row);
  } catch (error) {
    console.error("❌ FULL ERROR:", error);
    console.error("❌ SQL MESSAGE:", error?.parent?.sqlMessage);
    console.error("❌ SQL:", error?.parent?.sql);

    res.status(500).json({
      error: error.message,
      sqlMessage: error?.parent?.sqlMessage,
    });
  }
});

// Excel export
router.post("/export-items-to-excel", async (req, res) => {
  try {
    const { fromDate, toDate } = req.body;

    const records = await Movement.findAll({
      where: {
        date: {
          [Op.gte]: new Date(`${fromDate} 00:00:00`),
          [Op.lte]: new Date(`${toDate} 23:59:59`),
        },
      },
      order: [["date", "ASC"]],
      raw: true,
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Equipment Movement");

    // Title
    sheet.mergeCells("A1:I1");
    sheet.getCell("A1").value = "EQUIPMENT MOVEMENT REPORT";
    sheet.getCell("A1").font = { bold: true, size: 16 };
    sheet.getCell("A1").alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    // Date Range
    sheet.mergeCells("A2:I2");
    sheet.getCell("A2").value = `FROM ${fromDate} TO ${toDate}`;
    sheet.getCell("A2").alignment = { horizontal: "center" };

    // Headers
    sheet.getRow(4).values = [
      "Personnel",
      "Date",
      "Item Description",
      "Asset Tag / Serial No.",
      "Quantity",
      "From Location / Line",
      "To Location / Line",
      "Reason",
      "Remarks",
    ];

    sheet.columns = [
      { key: "personnel", width: 20 },
      { key: "date", width: 18 },
      { key: "description", width: 30 },
      { key: "serial", width: 25 },
      { key: "quantity", width: 12 },
      { key: "from", width: 25 },
      { key: "to", width: 25 },
      { key: "condition", width: 25 },
      { key: "remarks", width: 25 },
    ];

    // Header Style
    const headerRow = sheet.getRow(4);
    headerRow.font = { bold: true };
    headerRow.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };

    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "D9EAF7" },
      };

      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Data Rows
    records.forEach((item) => {
      const row = sheet.addRow([
        item.personnel,
        new Date(item.date).toLocaleDateString(),
        item.description,
        item.serial,
        item.quantity,
        item.from,
        item.to,
        item.condition,
        item.remarks,
      ]);

      row.eachCell((cell) => {
        row.getCell(1).alignment = { horizontal: "left", vertical: "middle" }; // Personnel
        row.getCell(2).alignment = { horizontal: "center", vertical: "middle" }; // Date
        row.getCell(3).alignment = { horizontal: "left", vertical: "middle" }; // Description
        row.getCell(4).alignment = { horizontal: "center", vertical: "middle" }; // Serial
        row.getCell(5).alignment = { horizontal: "center", vertical: "middle" }; // Qty
        row.getCell(6).alignment = { horizontal: "center", vertical: "middle" }; // From
        row.getCell(7).alignment = { horizontal: "center", vertical: "middle" }; // To
        row.getCell(8).alignment = { horizontal: "left", vertical: "middle" }; // Condition
        row.getCell(9).alignment = { horizontal: "left", vertical: "middle" }; // Remarks

        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // Download response
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Equipment_Movement_${fromDate}_to_${toDate}.xlsx`,
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Export failed.",
    });
  }
});

module.exports = router;
