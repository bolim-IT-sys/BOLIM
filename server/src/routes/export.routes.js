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

router.post("/export-to-excel", async (req, res) => {
  try {
    const {
      parts,
      monthList,
      previousMonth,
      previousYear,
      latestMonth,
      latestYear,
    } = req.body;

    // Prepare data for Excel
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
          return inboundQuantity > 0 ? `${inboundQuantity}` : "";
        } else {
          const outboundQuantity = getOutQuantity(part.outbounds, month, year);
          return outboundQuantity > 0 ? `${outboundQuantity}` : "";
        }
      };

      const prevInbounds = getTotalByYearExcludingCurrentMonth(
        part.inbounds.map((i) => ({
          quantity: i.quantity,
          date: String(i.inboundDate),
        })),
        previousYear,
        previousMonth
      );
      const prevOutbounds = getTotalByYearExcludingCurrentMonth(
        part.outbounds.map((o) => ({
          quantity: o.quantity,
          date: String(o.outboundDate),
        })),
        previousYear,
        previousMonth
      );
      const latestOutbounds = getTotalByYearExcludingCurrentMonth(
        part.outbounds.map((o) => ({
          quantity: o.quantity,
          date: String(o.outboundDate),
        })),
        latestYear,
        latestMonth - 1
      );

      const overallInboundsWithCurrentMonth = getTotal(
        part.inbounds.map((i) => ({
          quantity: i.quantity,
          date: String(i.inboundDate),
        })),
        latestYear,
        latestMonth
      );
      const overallOutboundsWithCurrentMonth = getTotal(
        part.outbounds.map((o) => ({
          quantity: o.quantity,
          date: String(o.outboundDate),
        })),
        latestYear,
        latestMonth
      );

      const stocksLeft =
        overallInboundsWithCurrentMonth - overallOutboundsWithCurrentMonth;

      const lastYearOutbounds = getTotalByYearExcludingCurrentMonth(
        part.outbounds.map((o) => ({
          quantity: o.quantity,
          date: String(o.outboundDate),
        })),
        currentYear() - 1,
        12
      );
      const totalInbounds = getTotalByYearExcludingCurrentMonth(
        part.inbounds.map((o) => ({
          quantity: o.quantity,
          date: String(o.inboundDate),
        })),
        latestYear,
        12
      );

      const totalOutbounds = getTotalByYearExcludingCurrentMonth(
        part.outbounds.map((o) => ({
          quantity: o.quantity,
          date: String(o.outboundDate),
        })),
        latestYear,
        12
      );

      const monthInboundObject = Object.fromEntries(
        monthList.map((m) => [
          m + "i",
          getInOutQuantity(m, latestYear, "inbound"),
        ])
      );
      const monthOutboundObject = Object.fromEntries(
        monthList.map((m) => [
          m + "o",
          getInOutQuantity(m, latestYear, "outbound"),
        ])
      );

      const aveMonthlyUsage = Math.round(latestOutbounds / (latestMonth - 1));

      const safetyStock = getSafetyStock(
        part.outbounds.map((o) => ({
          quantity: o.quantity,
          date: String(o.outboundDate),
        })),
        latestYear,
        latestMonth - 1
      );
      const securementRate = Math.round((stocksLeft / safetyStock) * 100);

      const excessInsufficient = stocksLeft - safetyStock;

      return {
        "Part number": part.partNumber,
        Specifications: part.specs || "N/A",
        Category: part.category,
        "Unit Price": part.unitPrice.toLocaleString(),
        Company: part.company || "N/A",

        // MONTH LIST FOR INBOUND DATA
        "STOCKS end of comparing month (ea)": prevInbounds - prevOutbounds || 0,
        ...monthInboundObject,
        "Total Inbound": totalInbounds || 0,

        // MONTH LIST FOR OUTBOUND DATA
        ...monthOutboundObject,
        "Total Usage (ea)": totalOutbounds || 0,

        "Average Monthly Usage: 2024 (12 mos)": Math.round(
          lastYearOutbounds / 11
        ),
        "Average monthly usage": aveMonthlyUsage,

        "safety stock": safetyStock,

        "STOCKS end of 2025(ea)": stocksLeft,
        "Securement rate": securementRate !== 0 ? `${securementRate}%` : "", //END OF MONTH STOCK / SAFETY STOCK

        "Excess/insufficient quantity":
          stocksLeft !== 0 ? excessInsufficient : "", //END OF MONTH STOCK - SAFETY STOCK
        "Urgent Request (Secure Rate Less than 50%)":
          securementRate < 50 && securementRate !== 0
            ? Math.abs(excessInsufficient)
            : "",
        "Order Quantity (Regular Order)":
          securementRate < 100 && securementRate !== 0
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

          "Average Monthly Usage: 2024 (12 mos)\n월평균사용량 2024 (12mos)",
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
      { origin: "A1" }
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
      const color = columnColors[C] || "FFFFFF"; // Default to white if no color defined

      // Row 1 headers
      const address1 = XLSX.utils.encode_col(C) + "1";
      if (worksheet[address1]) {
        worksheet[address1].s = {
          alignment: { horizontal: "center", vertical: "center" },
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
          alignment: { horizontal: "center", vertical: "center" },
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

      { s: { r: 0, c: 19 }, e: { r: 0, c: 30 } }, // T1:AE1 (Inbound header across all months)
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

    // FOR CENTRALIZING ALL CELLS
    const rangeAll = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let R = rangeAll.s.r; R <= rangeAll.e.r; ++R) {
      for (let C = rangeAll.s.c; C <= rangeAll.e.c; ++C) {
        const address = XLSX.utils.encode_cell({ r: R, c: C });

        if (!worksheet[address]) continue; // Skip empty cells

        // Initialize style object if missing
        if (!worksheet[address].s) {
          worksheet[address].s = {};
        }

        worksheet[address].s.alignment = {
          horizontal: "center",
          vertical: "center",
          wrapText: true,
        };
      }
    }

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
    for (let R = 2; R <= rangeAll.e.r; ++R) {
      // row 2 = Excel row 3
      for (let C = rangeAll.s.c; C <= rangeAll.e.c; ++C) {
        const address = XLSX.utils.encode_cell({ r: R, c: C });

        if (!worksheet[address]) continue;

        // Create style if missing
        if (!worksheet[address].s) worksheet[address].s = {};

        const bgColor = dataCellColors[C] || "FFFFFF";

        // Apply background color + border + center alignment
        worksheet[address].s = {
          ...worksheet[address].s,
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
          // Column for Order Quantity (Regular Order)
          const cellValue = Number(worksheet[address].v);
          if (!isNaN(cellValue) && cellValue > 0) {
            worksheet[address].s = {
              ...worksheet[address].s,
              fill: { fgColor: { rgb: "FFC6C6" } },
              font: {
                ...worksheet[address].s.font,
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
      `attachment; filename=Stock_Report_${latestMonth}_${latestYear}.xlsx`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    return res.send(excelBuffer);
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({ error: "Failed to generate Excel" });
  }
});

module.exports = router;
