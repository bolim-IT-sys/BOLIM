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
  const getStatus = (status) => {
    const remark =
      status === "brandnew"
        ? "Brand New"
        : status === "ready"
          ? "Used"
          : status === "forChecking"
            ? "For Checking"
            : status === "forRepair"
              ? "For Repair"
              : status === "forDisposal"
                ? "For Disposal"
                : status === "used"
                  ? "Used"
                  : status === "repaired"
                    ? "Repaired"
                    : status === "disposed"
                      ? "Disposed"
                      : "Undefined";

    return remark;
  };

  try {
    const { data } = req.body;

    const excelData = data.map((item) => {
      return {
        "Serial Number": item.serialNumber,
        "PR Date": item.PRDate ? item.PRDate : "N/A",
        "Received Date": item.receivedDate,
        "Deployed Date": item.deployedDate ? item.deployedDate : "N/A",
        Station: item.station ? item.station : "N/A",
        Department: item.department ? item.department : "N/A",
        "Authorized Personel": item.from ? item.from : "N/A",
        Receiver: item.to ? item.to : "N/A",
        Status: getStatus(item.status).toUpperCase(),
        Remarks: item.remarks.toUpperCase(),
        reason: item.reason ? item.reason : "N/A",
      };
    });

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Insert custom header rows at the top
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          "Serial Number",
          "PR Date",
          "Received Date",
          "Deployed Date",
          "Station",
          "Department",
          "Authorized Personel",
          "Receiver",
          "Status",
          "Remarks",
          "Reason",
        ],
      ],
      { origin: "A1" },
    );

    // COLORS FOR COLUMN HEADERS (using hex colors without #)
    const columnColors = [
      "F4B084", // Serial Number
      "FFD966", // PR Date
      "FFD966", // Received Date
      "F4B084", // Deployed Date
      "F4B084", // Station
      "F4B084", // Department
      "F4B084", // Authorized Personel
      "F4B084", // Receiver
      "9BC2E6", // Status
      "9BC2E6", // Remarks
      "9BC2E6", // Reason
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
    }

    // APPLYING BACKGROUND COLORS FOR DATA CELLS (rows 3 and below)
    const rangeAll = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let R = 1; R <= rangeAll.e.r; ++R) {
      for (let C = rangeAll.s.c; C <= rangeAll.e.c; ++C) {
        const address = XLSX.utils.encode_cell({ r: R, c: C });

        // FIX: Only apply styles to cells that actually exist
        if (!worksheet[address]) continue;

        // Apply background color + border + center alignment
        worksheet[address].s = {
          alignment: {
            horizontal: "center",
            vertical: "center",
            wrapText: true,
          },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
        };

        if (C < 8) {
          // FIX: Better validation of cell value
          const cellValue = worksheet[address].v;
          const strValue = String(cellValue).toUpperCase();

          if (strValue === "N/A") {
            worksheet[address].s = {
              ...worksheet[address].s,
              font: {
                color: { rgb: "b0b0b0" },
                bold: true,
              },
            };
          }
        }

        // APPLYING COLORS ON STATUS DATA CELLS
        if (C === 8) {
          // FIX: Better validation of cell value
          const cellValue = worksheet[address].v;
          const strValue = String(cellValue).toLowerCase();

          if (strValue === "brand new") {
            worksheet[address].s = {
              ...worksheet[address].s,
              fill: { fgColor: { rgb: "D9FCE8" } },
              font: {
                color: { rgb: "004A24" },
                bold: true,
              },
            };
          }
          if (
            strValue === "ready" ||
            strValue === "repaired" ||
            strValue === "used"
          ) {
            worksheet[address].s = {
              ...worksheet[address].s,
              fill: { fgColor: { rgb: "FFFF99" } },
              font: {
                color: { rgb: "494529" },
                bold: true,
              },
            };
          }
          if (
            strValue === "for checking" ||
            strValue === "for cepair" ||
            strValue === "for cisposal"
          ) {
            worksheet[address].s = {
              ...worksheet[address].s,
              fill: { fgColor: { rgb: "FABF8F" } },
              font: {
                color: { rgb: "800000" },
                bold: true,
              },
            };
          }
          if (strValue === "disposed") {
            worksheet[address].s = {
              ...worksheet[address].s,
              fill: { fgColor: { rgb: "D9D9D9" } },
              font: {
                color: { rgb: "262626" },
                bold: true,
              },
            };
          }
        }

        // === MAKE "Remarks" GREEN IF === "available" and RED if not ===
        if (C === 9) {
          // FIX: Better validation of cell value
          const cellValue = worksheet[address].v;
          const strValue = String(cellValue).toLowerCase();

          if (strValue === "available") {
            worksheet[address].s = {
              ...worksheet[address].s,
              fill: { fgColor: { rgb: "d9fce8" } },
              font: {
                color: { rgb: "004a24" },
                bold: true,
              },
            };
          } else {
            worksheet[address].s = {
              ...worksheet[address].s,
              fill: { fgColor: { rgb: "fcd7d7" } },
              font: {
                color: { rgb: "400101" },
                bold: true,
              },
            };
          }
        }
      }
    }

    // Set column widths
    worksheet["!cols"] = [
      { wch: 30 }, // Serial Number
      { wch: 20 }, // PR Date
      { wch: 20 }, // Received Date
      { wch: 20 }, // Deployed Date
      { wch: 25 }, // Station
      { wch: 25 }, // Department
      { wch: 25 }, // Authorized Personel
      { wch: 15 }, // Receiver
      { wch: 20 }, // Status
      { wch: 20 }, // Remarks
      { wch: 45 }, // Reason
    ];

    worksheet["!rows"] = [{ hpt: 20 }];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Stock Report");

    // Generate file buffer
    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    res.setHeader("Content-Disposition", `attachment; filename=Sample`);
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

module.exports = router;
