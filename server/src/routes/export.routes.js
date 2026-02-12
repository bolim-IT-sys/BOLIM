const express = require("express");
const XLSX = require("xlsx-js-style");
const {
  getInQuantity,
  getOutQuantity,
  getTotalByYearExcludingCurrentMonth,
  getTotal,
  getSafetyStock,
  currentYear,
} = require("../helper/export.helper");

const router = express.Router();

router.post("/export-inventory-to-excel", async (req, res) => {
  try {
    const {
      parts,
      monthList,
      previousMonth,
      previousYear,
      latestMonth,
      latestYear,
    } = req.body;

    // Prepare data for Excel with dummy row to prevent header overlap
    const partsWithDummy = [
      {
        id: 0,
        type: "it",
        partNumber: "",
        specs: "",
        category: "",
        unitPrice: 0,
        company: "",
        quantity: 0,
        inbounds: [],
        outbounds: [],
      },
      ...parts,
    ];

    const excelData = partsWithDummy.map((part) => {
      // COMPUTING FOR INBOUND AND OUTBOUND TOTAL PERMONTH
      const getInOutQuantity = (month, year, dataType) => {
        if (dataType === "inbound") {
          const inboundQuantity = getInQuantity(part.inbounds, month, year);
          return inboundQuantity > 0 ? inboundQuantity : ""; // Return number or empty string
        } else {
          const outboundQuantity = getOutQuantity(part.outbounds, month, year);
          return outboundQuantity > 0 ? outboundQuantity : ""; // Return number or empty string
        }
      };

      // Handle dummy row - return empty strings for all fields
      if (part.id === 0) {
        const monthInboundObject = Object.fromEntries(
          monthList.map((m) => [m + "i", ""]),
        );
        const monthOutboundObject = Object.fromEntries(
          monthList.map((m) => [m + "o", ""]),
        );

        return {
          "Part number": "",
          Specifications: "",
          Category: "",
          "Unit Price": "",
          Company: "",
          "STOCKS end of comparing month (ea)": "",
          ...monthInboundObject,
          "Total Inbound": "",
          ...monthOutboundObject,
          "Total Usage (ea)": "",
          [`Average Monthly Usage: ${latestYear} (12 mos)`]: "",
          "Average monthly usage": "",
          "safety stock": "",
          "STOCKS end of 2025(ea)": "",
          "Securement rate": "",
          "Excess/insufficient quantity": "",
          "Urgent Request (Secure Rate Less than 50%)": "",
          "Order Quantity (Regular Order)": "",
        };
      }

      const prevInbounds = getTotalByYearExcludingCurrentMonth(
        part.inbounds.map((i) => ({
          quantity: i.quantity,
          date: String(i.inboundDate),
        })),
        previousYear,
        previousMonth,
      );
      const prevOutbounds = getTotalByYearExcludingCurrentMonth(
        part.outbounds.map((o) => ({
          quantity: o.quantity,
          date: String(o.outboundDate),
        })),
        previousYear,
        previousMonth,
      );
      const latestOutbounds = getTotalByYearExcludingCurrentMonth(
        part.outbounds.map((o) => ({
          quantity: o.quantity,
          date: String(o.outboundDate),
        })),
        latestYear,
        latestMonth - 1,
      );

      const overallInboundsWithCurrentMonth = getTotal(
        part.inbounds.map((i) => ({
          quantity: i.quantity,
          date: String(i.inboundDate),
        })),
        latestYear,
        latestMonth,
      );
      const overallOutboundsWithCurrentMonth = getTotal(
        part.outbounds.map((o) => ({
          quantity: o.quantity,
          date: String(o.outboundDate),
        })),
        latestYear,
        latestMonth,
      );

      const stocksLeft =
        overallInboundsWithCurrentMonth - overallOutboundsWithCurrentMonth;

      const lastYearOutbounds = getTotalByYearExcludingCurrentMonth(
        part.outbounds.map((o) => ({
          quantity: o.quantity,
          date: String(o.outboundDate),
        })),
        currentYear() - 1,
        12,
      );
      const totalInbounds = getTotalByYearExcludingCurrentMonth(
        part.inbounds.map((o) => ({
          quantity: o.quantity,
          date: String(o.inboundDate),
        })),
        latestYear,
        12,
      );

      const totalOutbounds = getTotalByYearExcludingCurrentMonth(
        part.outbounds.map((o) => ({
          quantity: o.quantity,
          date: String(o.outboundDate),
        })),
        latestYear,
        12,
      );

      const monthInboundObject = Object.fromEntries(
        monthList.map((m) => [
          m + "i",
          getInOutQuantity(m, latestYear, "inbound"),
        ]),
      );
      const monthOutboundObject = Object.fromEntries(
        monthList.map((m) => [
          m + "o",
          getInOutQuantity(m, latestYear, "outbound"),
        ]),
      );

      // FIX: Prevent division by zero
      const aveMonthlyUsage =
        latestMonth > 1 ? Math.round(latestOutbounds / (latestMonth - 1)) : 0;

      const safetyStock = getSafetyStock(
        part.outbounds.map((o) => ({
          quantity: o.quantity,
          date: String(o.outboundDate),
        })),
        latestYear,
        latestMonth - 1,
      );

      // FIX: Prevent division by zero and handle edge cases
      const securementRate =
        safetyStock > 0 ? Math.round((stocksLeft / safetyStock) * 100) : "";

      const excessInsufficient = stocksLeft - safetyStock;

      // FIX: Handle empty/zero values more carefully
      const avgUsageLatestYear =
        lastYearOutbounds > 0 ? Math.round(lastYearOutbounds / 11) : "";

      return {
        "Part number": part.partNumber || "",
        Specifications: part.specs || "N/A",
        Category: part.category || "",
        "Unit Price": part.unitPrice > 0 ? part.unitPrice.toLocaleString() : "",
        Company: part.company || "N/A",

        // MONTH LIST FOR INBOUND DATA
        "STOCKS end of comparing month (ea)":
          prevInbounds - prevOutbounds || "",
        ...monthInboundObject,
        "Total Inbound": totalInbounds || "",

        // MONTH LIST FOR OUTBOUND DATA
        ...monthOutboundObject,
        "Total Usage (ea)": totalOutbounds || "",

        [`Average Monthly Usage: ${latestYear} (12 mos)`]: avgUsageLatestYear,
        "Average monthly usage": aveMonthlyUsage || "",

        "safety stock": safetyStock || "",

        "STOCKS end of 2025(ea)": stocksLeft || "",
        "Securement rate": securementRate !== "" ? `${securementRate}%` : "",

        "Excess/insufficient quantity":
          stocksLeft !== 0 ? excessInsufficient : "",
        "Urgent Request (Secure Rate Less than 50%)":
          typeof securementRate === "number" &&
          securementRate < 50 &&
          securementRate !== 0
            ? Math.abs(excessInsufficient)
            : "",
        "Order Quantity (Regular Order)":
          typeof securementRate === "number" &&
          securementRate < 100 &&
          securementRate !== 0
            ? Math.abs(excessInsufficient)
            : "",
      };
    });

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Insert custom header rows at the top
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          "Part Number",
          "Specifications(Description)\n규격(설명)",
          "category\n(유형)",
          "UNIT PRICE\n(Korean won)",
          "company\n(업체)",

          // FOR INBOUND SPAN
          `STOCKS end of ${monthList[previousMonth - 1]} ${previousYear} (ea)`,

          "INBOUND",
          ...Array(monthList.length - 1).fill(""),

          "Total Inbound",

          // FOR OUTBOUND SPAN
          "USAGE",
          ...Array(monthList.length - 1).fill(""),

          "Total Usage (ea)",

          [
            `Average Monthly Usage: ${latestYear} (12 mos)\n월평균사용량 ${latestYear} (12mos)`,
          ],
          "Average monthly usage\n(월평균사용량)",

          "safety stock\n(안전재고)",

          `STOCKS end of ${monthList[latestMonth - 1]} ${latestYear}(ea)`,
          "Securement rate\n(확보율)",

          "Excess/insufficient quantity\n(과/부족수량)",
          "Urgent Request (Secure Rate Less than 50%)\n(긴급 요청(확보율 50%이하))",
          "Order Quantity (Regular Order)\n(발주 수량(정기발주))",
        ],
        ["", "", "", "", "", "", ...monthList, "", ...monthList],
      ],
      { origin: "A1" },
    );

    // COLORS FOR COLUMN HEADERS (using hex colors without #)
    const columnColors = [
      "00B0F0", // Part Number
      "00B0F0", // Specifications
      "00B0F0", // Category
      "00B0F0", // Unit Price
      "00B0F0", // Company

      ...Array(monthList.length + 2).fill("C6E0B4"), // STOCKS END OF, MONTHS FOR INBOUND, INBOUND TOTAL

      ...Array(monthList.length + 3).fill("F4B084"), // MONTHS FOR OUTBOUND, TOTAL USAGE, AVE USAGE 2024, AVE USAGE LATEST

      "D9E1F2", // safety stock

      "E1CCF0", // Current Stocks
      "E1CCF0", // Securement rate

      "F2F2F2", // Excess/insufficient quantity
      "F2F2F2", // Urgent Request (Secure Rate Less than 50%)
      "F2F2F2", // Order Quantity (Regular Order)
    ];

    // APPLYING COLORS ON HEADERS
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const color = columnColors[C] || "FFFFFF";

      // Row 1 headers
      const address1 = XLSX.utils.encode_col(C) + "1";
      if (worksheet[address1]) {
        worksheet[address1].s = {
          alignment: {
            horizontal: "center",
            vertical: "center",
            wrapText: true,
          },
          fill: { fgColor: { rgb: color } },
          font: { bold: true, color: { rgb: "000000" } },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
        };
      }

      // Row 2 headers
      const address2 = XLSX.utils.encode_col(C) + "2";
      if (worksheet[address2]) {
        worksheet[address2].s = {
          alignment: {
            horizontal: "center",
            vertical: "center",
            wrapText: true,
          },
          fill: { fgColor: { rgb: color } },
          font: { bold: true, color: { rgb: "000000" } },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
        };
      }
    }

    // FOR MERGING COLUMNS
    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, // A1:A2 (Part Number)
      { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } }, // B1:B2 (Specifications (Description)(규격(설명)))
      { s: { r: 0, c: 2 }, e: { r: 1, c: 2 } }, // C1:C2 (category(유형))
      { s: { r: 0, c: 3 }, e: { r: 1, c: 3 } }, // D1:D2 (UNIT PRICE (Korean won))
      { s: { r: 0, c: 4 }, e: { r: 1, c: 4 } }, // E1:E2 (company(업체))
      { s: { r: 0, c: 5 }, e: { r: 1, c: 5 } }, // F1:F2 (STOCKS end of (ea))

      { s: { r: 0, c: 6 }, e: { r: 0, c: 17 } }, // G1:R1 (Inbound header across all months)
      { s: { r: 0, c: 18 }, e: { r: 1, c: 18 } }, // S1:S2 (Total Inbound)

      { s: { r: 0, c: 19 }, e: { r: 0, c: 30 } }, // T1:AE1 (Outbound header across all months)
      { s: { r: 0, c: 31 }, e: { r: 1, c: 31 } }, // AF1:AF2 (Total Usage (ea))
      { s: { r: 0, c: 32 }, e: { r: 1, c: 32 } }, // AG1:AG2 (Average Monthly Usage: 2024 (12 mos) 월평균사용량 2024 (12mos))
      { s: { r: 0, c: 33 }, e: { r: 1, c: 33 } }, // AH1:AH2 (Average monthly usage(월평균사용량))

      { s: { r: 0, c: 34 }, e: { r: 1, c: 34 } }, // AI1:AI2 (safety stock)

      { s: { r: 0, c: 35 }, e: { r: 1, c: 35 } }, // AJ1:AJ2 (Current Stocks)
      { s: { r: 0, c: 36 }, e: { r: 1, c: 36 } }, // AK1:AK2 (Securement rate)

      { s: { r: 0, c: 37 }, e: { r: 1, c: 37 } }, // AL1:AL2 (Excess/insufficient quantity)
      { s: { r: 0, c: 38 }, e: { r: 1, c: 38 } }, // AM1:AM2 (Urgent Request (Secure Rate Less than 50%))
      { s: { r: 0, c: 39 }, e: { r: 1, c: 39 } }, // AN1:AN2 (Order Quantity (Regular Order))
    ];

    // COLORS FOR DATA CELLS (using hex colors without #)
    const dataCellColors = [
      "", // Part Number
      "", // Specifications
      "", // Category
      "", // Unit Price
      "", // Company

      "C6E0B4", // STOCKS END OF 2024
      ...Array(monthList.length).fill(""), // MONTHS FOR INBOUND
      "C6E0B4", // INBOUND TOTAL

      ...Array(monthList.length).fill(""), // MONTHS FOR OUTBOUND
      "F4B084", // TOTAL USAGE
      "F4B084", // AVE USAGE 2024
      "F4B084", // AVE USAGE LATEST

      "D9E1F2", // safety stock

      "E1CCF0", // Current Stocks
      "E1CCF0", // Securement rate

      "F2F2F2", // Excess/insufficient quantity
      "F2F2F2", // Urgent Request (Secure Rate Less than 50%)
      "F2F2F2", // Order Quantity (Regular Order)
    ];

    // APPLYING BACKGROUND COLORS FOR DATA CELLS (rows 3 and below)
    const rangeAll = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let R = 2; R <= rangeAll.e.r; ++R) {
      for (let C = rangeAll.s.c; C <= rangeAll.e.c; ++C) {
        const address = XLSX.utils.encode_cell({ r: R, c: C });

        // FIX: Only apply styles to cells that actually exist
        if (!worksheet[address]) continue;

        const bgColor = dataCellColors[C] || "FFFFFF";

        // Apply background color + border + center alignment
        worksheet[address].s = {
          alignment: {
            horizontal: "center",
            vertical: "center",
            wrapText: true,
          },
          fill: { fgColor: { rgb: bgColor } },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
        };

        // === MAKE "Order Quantity (Regular Order)" RED IF > 0 ===
        if (C === 39) {
          // FIX: Better validation of cell value
          const cellValue = worksheet[address].v;
          const numValue =
            typeof cellValue === "number" ? cellValue : Number(cellValue);

          if (!isNaN(numValue) && numValue > 0) {
            worksheet[address].s = {
              ...worksheet[address].s,
              fill: { fgColor: { rgb: "FFC6C6" } },
              font: {
                color: { rgb: "740000" },
                bold: true,
              },
            };
          }
        }
      }
    }

    // Set column widths
    worksheet["!cols"] = [
      { wch: 20 }, // Part Number
      { wch: 26 }, // Specifications (Description)(규격(설명))
      { wch: 10 }, // category(유형)
      { wch: 15 }, // UNIT PRICE (Korean won)
      { wch: 10 }, // company(업체)

      { wch: 10 }, // STOCKS end of (ea)
      ...Array(monthList.length).fill({ wch: 4.5 }), // JAN - DEC
      { wch: 10 }, // Total Inbound

      ...Array(monthList.length).fill({ wch: 4.5 }), // JAN - DEC
      { wch: 10 }, // Total Usage

      { wch: 35 }, // Average Monthly Usage: 2024
      { wch: 22 }, // Average monthly usage

      { wch: 15 }, // safety stock

      { wch: 15 }, // Current Stocks
      { wch: 15 }, // Securement rate

      { wch: 25 }, // Excess/insufficient quantity
      { wch: 40 }, // Urgent Request (Secure Rate Less than 50%)
      { wch: 30 }, // Order Quantity (Regular Order)
    ];

    worksheet["!rows"] = [{ hpt: 40 }];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Stock Report");

    // Generate file buffer
    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Stock_Report_${latestMonth}_${latestYear}.xlsx`,
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    return res.send(excelBuffer);
  } catch (error) {
    console.error("Export error:", error);
    res
      .status(500)
      .json({ error: "Failed to generate Excel", details: error.message });
  }
});

router.post("/export-items-to-excel", async (req, res) => {
  const STATUS_LABEL = {
    brandnew: "Brand New",
    ready: "Used",
    forChecking: "For Checking",
    forRepair: "For Repair",
    forDisposal: "For Disposal",
    used: "Used",
    repaired: "Repaired",
    disposed: "Disposed",
  };

  // Maps each status to its TABLE GROUP key
  const STATUS_GROUP = {
    brandnew: "brandnew",
    ready: "used_group",
    used: "used_group",
    repaired: "used_group",
    forChecking: "for_group",
    forRepair: "for_group",
    forDisposal: "for_group",
    disposed: "disposed",
  };

  // Display label for each table group title row
  const GROUP_TITLE = {
    brandnew: "Brand New",
    used_group: "Used / Repaired",
    for_group: "For Checking / For Repair / For Disposal",
    disposed: "Disposed",
  };

  // Title row background color per group
  const GROUP_COLOR = {
    brandnew: "D9FCE8",
    used_group: "FFFF99",
    for_group: "FABF8F",
    disposed: "D9D9D9",
  };

  // Render order of groups
  const GROUP_ORDER = ["brandnew", "used_group", "for_group", "disposed"];

  // Sort order per individual status within a group
  const STATUS_SORT = {
    brandnew: 1,
    ready: 1,
    used: 2,
    repaired: 3,
    forChecking: 1,
    forRepair: 2,
    forDisposal: 3,
    disposed: 1,
  };

  const COLUMN_HEADERS = [
    "Serial Number",
    "Specifications",
    "PR Date",
    "Received Date",
    "Deployed Date",
    "Station",
    "Department",
    "Authorized Personnel",
    "Receiver",
    "Status",
    "Remarks",
    "Reason",
  ];

  const COLUMN_COLORS = [
    "8497B0",
    "8497B0", // Serial Number, Specifications
    "FFD966",
    "FFD966", // PR Date, Received Date
    "F4B084",
    "F4B084",
    "F4B084",
    "F4B084",
    "F4B084", // Deployed Date → Receiver
    "9BC2E6",
    "9BC2E6",
    "9BC2E6", // Status, Remarks, Reason
  ];

  const COL_WIDTHS = [30, 40, 20, 20, 20, 25, 25, 25, 15, 20, 20, 45];

  const BORDER = {
    top: { style: "thin", color: { rgb: "000000" } },
    bottom: { style: "thin", color: { rgb: "000000" } },
    left: { style: "thin", color: { rgb: "000000" } },
    right: { style: "thin", color: { rgb: "000000" } },
  };

  const CENTER = { horizontal: "center", vertical: "center", wrapText: true };

  const setCell = (ws, r, c, value, style) => {
    const addr = XLSX.utils.encode_cell({ r, c });
    ws[addr] = { v: value, t: typeof value === "number" ? "n" : "s", s: style };
  };

  const updateRef = (ws, lastRow) => {
    ws["!ref"] = XLSX.utils.encode_range({
      s: { r: 0, c: 0 },
      e: { r: lastRow, c: COLUMN_HEADERS.length - 1 },
    });
  };

  try {
    const { data, specs } = req.body;
    const titleRows = [];

    // Bucket items into their group
    const groups = {};
    for (const item of data) {
      const groupKey = STATUS_GROUP[item.status] ?? "disposed";
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(item);
    }

    // Sort within each group by individual status order
    for (const key of Object.keys(groups)) {
      groups[key].sort(
        (a, b) =>
          (STATUS_SORT[a.status] ?? 999) - (STATUS_SORT[b.status] ?? 999),
      );
    }

    const ws = {};
    ws["!merges"] = [];
    let currentRow = 0;

    for (const groupKey of GROUP_ORDER) {
      const items = groups[groupKey];
      if (!items || items.length === 0) continue; // skip empty groups

      const title = GROUP_TITLE[groupKey];
      const color = GROUP_COLOR[groupKey];
      const numCols = COLUMN_HEADERS.length;

      // ── Group Title Row ──────────────────────────────────────────────
      titleRows.push(currentRow);
      for (let c = 0; c < numCols; c++) {
        setCell(ws, currentRow, c, c === 0 ? title.toUpperCase() : "", {
          alignment: CENTER,
          fill: { fgColor: { rgb: color } },
          font: { bold: true, sz: 12, color: { rgb: "000000" } },
          border: BORDER,
        });
      }
      ws["!merges"].push({
        s: { r: currentRow, c: 0 },
        e: { r: currentRow, c: numCols - 1 },
      });
      currentRow++;

      // ── Column Header Row ────────────────────────────────────────────
      for (let c = 0; c < numCols; c++) {
        setCell(ws, currentRow, c, COLUMN_HEADERS[c], {
          alignment: CENTER,
          fill: { fgColor: { rgb: COLUMN_COLORS[c] } },
          font: { bold: true, color: { rgb: "000000" } },
          border: BORDER,
        });
      }
      currentRow++;

      // ── Data Rows ────────────────────────────────────────────────────
      for (const item of items) {
        const row = [
          item.serialNumber,
          specs,
          item.PRDate ?? "N/A",
          item.receivedDate,
          item.deployedDate ?? "N/A",
          item.station ?? "N/A",
          item.department ?? "N/A",
          item.from ?? "N/A",
          item.to ?? "N/A",
          (STATUS_LABEL[item.status] ?? "Undefined").toUpperCase(),
          item.remarks?.toUpperCase(),
          item.reason ?? "N/A",
        ];

        for (let c = 0; c < row.length; c++) {
          const val = row[c];
          const strVal = String(val).toLowerCase();
          let style = { alignment: CENTER, border: BORDER };

          // N/A dimmed styling for informational columns (0–8)
          if (c < 9 && strVal === "n/a") {
            style.font = { color: { rgb: "B0B0B0" }, bold: true };
          }

          // Status column (c === 9) coloring
          if (c === 9) {
            if (strVal === "brand new") {
              style.fill = { fgColor: { rgb: "D9FCE8" } };
              style.font = { color: { rgb: "004A24" }, bold: true };
            } else if (["used", "repaired", "ready"].includes(strVal)) {
              style.fill = { fgColor: { rgb: "FFFF99" } };
              style.font = { color: { rgb: "494529" }, bold: true };
            } else if (
              ["for checking", "for repair", "for disposal"].includes(strVal)
            ) {
              style.fill = { fgColor: { rgb: "FABF8F" } };
              style.font = { color: { rgb: "800000" }, bold: true };
            } else if (strVal === "disposed") {
              style.fill = { fgColor: { rgb: "D9D9D9" } };
              style.font = { color: { rgb: "262626" }, bold: true };
            }
          }

          // Remarks column (c === 10) coloring
          if (c === 10) {
            if (strVal === "available") {
              style.fill = { fgColor: { rgb: "D9FCE8" } };
              style.font = { color: { rgb: "004A24" }, bold: true };
            } else {
              style.fill = { fgColor: { rgb: "FCD7D7" } };
              style.font = { color: { rgb: "400101" }, bold: true };
            }
          }

          setCell(ws, currentRow, c, val, style);
        }
        currentRow++;
      }

      // Spacer row between tables
      currentRow++;
    }

    updateRef(ws, currentRow - 1);

    ws["!cols"] = COL_WIDTHS.map((wch) => ({ wch }));
    const rowsConfig = [];
    for (const r of titleRows) {
      rowsConfig[r] = { hpt: 35 }; // 35pt height — change to whatever you want
    }
    ws["!rows"] = rowsConfig;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, ws, "Stock Report");

    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=StockReport.xlsx",
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    return res.send(excelBuffer);
  } catch (error) {
    console.error("Export error:", error);
    return res
      .status(500)
      .json({ error: "Failed to generate Excel", details: error.message });
  }
});

module.exports = router;
