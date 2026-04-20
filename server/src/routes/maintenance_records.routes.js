const express = require("express");
const router = express.Router();
const Maintenance = require("../models/maintenance_records.model");
const ExcelJS = require("exceljs");

// view
router.get("/view", async (req, res) => {
  try {
    const records = await Maintenance.findAll();

    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch" });
  }
});

// create
router.post("/", async (req, res) => {
  try {
    const row = await Maintenance.create(req.body);
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

// update
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Maintenance.update(req.body, {
      where: { id },
    });

    const updated = await Maintenance.findByPk(id);

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Update failed" });
  }
});
// Export Maintenance Records
router.post("/export-items-to-excel", async (req, res) => {
  //console.log("EXPORT HIT");
  const { data } = req.body;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Maintenance");

  // ✅ HEADER ROW 1 (GROUPS)
  worksheet.addRow([
    "DATE",
    "FORM SN",
    "LINE",
    "PROCESS",
    "CODE",
    "PHENOMENON",
    "DETAIL OF ACTION",
    "MATERIAL",
    "QTY",
    "OCCUR TIME",
    "FINISH TIME",
    "DOWN TIME",
    "INCHARGE",
    "SHIFT",
    "REPAIR COMPLETED STICKER SN",
    "",
    "",
    "",
    "PIN CHECK",
    "",
    "",
    "",
    "KYUNGSHIN LABEL",
    "REMARKS",
  ]);

  // ✅ HEADER ROW 2 (SUB HEADERS)
  worksheet.addRow([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "TYPE",
    "LABEL SN",
    "HOLDER NO.",
    "PIN NO",
    "PIN SPEC",
    "PIN HEIGHT",
    "PIN DEFORMATION",
    "PIN SPRING",
    "",
    "",
  ]);

  const merge = (range) => worksheet.mergeCells(range);

  // vertical
  [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "W",
    "X",
  ].forEach((col) => merge(`${col}1:${col}2`));

  // horizontal groups
  merge("O1:R1"); // repair
  merge("S1:V1"); // pin check

  const styleHeader = (row, color) => {
    row.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: color },
      };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });
  };

  const setHeaderStyle = (cell, color) => {
    cell.font = { bold: true };
    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: color },
    };
    cell.border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };
  };

  const row1 = worksheet.getRow(1);
  const row2 = worksheet.getRow(2);

  // 🟧 ORANGE (A–E)
  ["A", "B", "C", "D", "E"].forEach((col) => {
    setHeaderStyle(row1.getCell(col), "FFFCE4D6");
    setHeaderStyle(row2.getCell(col), "FFFCE4D6");
  });

  // 🟦 BLUE (F–I)
  ["F", "G", "H", "I"].forEach((col) => {
    setHeaderStyle(row1.getCell(col), "FFD9E1F2");
    setHeaderStyle(row2.getCell(col), "FFD9E1F2");
  });

  // 🟩 GREEN (J–N)
  ["J", "K", "L", "M", "N"].forEach((col) => {
    setHeaderStyle(row1.getCell(col), "FFE2EFDA");
    setHeaderStyle(row2.getCell(col), "FFE2EFDA");
  });

  // 🟨 YELLOW (O–R)
  ["O", "P", "Q", "R"].forEach((col) => {
    setHeaderStyle(row1.getCell(col), "FFF2CC");
    setHeaderStyle(row2.getCell(col), "FFF2CC");
  });

  // ⬜ GRAY (S–W)
  ["S", "T", "U", "V", "W"].forEach((col) => {
    setHeaderStyle(row1.getCell(col), "FFD9D9D9");
    setHeaderStyle(row2.getCell(col), "FFD9D9D9");
  });

  // 🟥 REMARKS (X)
  setHeaderStyle(row1.getCell("X"), "FFF8CBAD");
  setHeaderStyle(row2.getCell("X"), "FFF8CBAD");

  data.forEach((row) => {
    worksheet.addRow([
      row.date,
      row.formNumber,
      row.line,
      row.process,
      row.code,
      row.phenomenon,
      row.detail,
      row.material,
      row.qty,
      row.occurTime,
      row.finishTime,
      row.downTime,
      row.incharge,
      row.shift,
      row.type,
      row.labelSN,
      row.holderNumber,
      row.pin,
      row.pinSpec,
      row.pinHeight,
      row.pinDeformation,
      row.pinSpring,
      row.kyungshinLabel,
      row.remarks,
    ]);
  });

  worksheet.columns.forEach((col) => {
    let max = 10;
    col.eachCell({ includeEmpty: true }, (cell) => {
      const val = cell.value ? cell.value.toString() : "";
      max = Math.max(max, val.length);
    });
    col.width = max + 2;
  });

  worksheet.views = [{ state: "frozen", ySplit: 2 }];

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=Maintenance_Records.xlsx",
  );

  await workbook.xlsx.write(res);
  res.end();
});

module.exports = router;
