import { currentMonth, monthList } from "../../helper/helper";
import * as XLSX from "xlsx-js-style";
import type { Part } from "../../services/Part.Service";
import SuccessButton from "../button/SuccessButton";

interface ItemDataProp {
  parts: Part[];
}

export const DownloadPartData = ({ parts }: ItemDataProp) => {
  const handleExportToExcel = () => {
    // Prepare data for Excel
    const monthObject = Object.fromEntries(monthList.map((m) => [m, ""]));

    const excelData = parts.map((part) => ({
      "Part number": part.partNumber,
      Specifications: part.specs || "N/A",
      Category: part.category,
      "Unit Price": part.unitPrice,
      Company: part.company || "N/A",

      // MONTH LIST FOR INBOUNDS
      ...monthObject,
      "Total Inbounds": "N/A",

      "Current Stocks": part.quantity || "N/A",
    }));

    // Create worksheet from data
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Insert custom header rows at the top
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          "Part Number",
          "Specifications (Description)\n규격(설명)",
          "category\n(유형)",
          "UNIT PRICE\n(Korean won)",
          "company\n(업체)",

          // FOR INBOUND SPAN
          "INBOUND",
          ...Array(monthList.length - 1).fill(""),
          "Inbound Total",

          "CURRENT STOCKS",
        ],
        ["", "", "", "", "", ...monthList, ""],
      ],
      { origin: "A1" }
    );

    // Define colors for each column (using hex colors without #)
    const columnColors = [
      "00B0F0", // Part Number - Light Blue
      "00B0F0", // Specifications - Light Green
      "00B0F0", // Category - Light Yellow
      "00B0F0", // Unit Price - Light Orange
      "00B0F0", // Company - Light Purple
      ...Array(monthList.length + 1).fill("C6E0B4"), // DEC - Green
      "E1CCF0", // Current Stocks - Gold
    ];

    // Apply center alignment and colors to header cells
    const range = XLSX.utils.decode_range(worksheet["!ref"]!);
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

    // Define merges for the header
    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, // A1:A2 (Part Number)
      { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } }, // B1:B2 (Specifications (Description)(규격(설명)))
      { s: { r: 0, c: 2 }, e: { r: 1, c: 2 } }, // C1:C2 (category(유형))
      { s: { r: 0, c: 3 }, e: { r: 1, c: 3 } }, // D1:D2 (UNIT PRICE (Korean won))
      { s: { r: 0, c: 4 }, e: { r: 1, c: 4 } }, // E1:E2 (company(업체))
      { s: { r: 0, c: 5 }, e: { r: 0, c: 16 } }, // F1:Q1 (Inbound header across all months)
      { s: { r: 0, c: 17 }, e: { r: 1, c: 17 } }, // R1:R2 (Current Stocks)
      { s: { r: 0, c: 18 }, e: { r: 1, c: 18 } }, // S1:S2 (Current Stocks)
    ];

    // Center align ALL cells
    const rangeAll = XLSX.utils.decode_range(worksheet["!ref"]!);

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

    // Set column widths
    worksheet["!cols"] = [
      { wch: 20 }, // Part Number
      { wch: 40 }, // Specifications (Description)(규격(설명))
      { wch: 25 }, // category(유형)
      { wch: 30 }, // UNIT PRICE (Korean won)
      { wch: 20 }, // company(업체)

      ...Array(monthList.length).fill({ wch: 5 }), // JAN - DEC
      { wch: 10 }, // Total Inbound

      { wch: 20 }, // Current Stocks
    ];

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Stock Report");

    // Generate filename with current date
    const date = new Date().toISOString().split("T")[0];
    const filename = `${currentMonth()}_Stock_${date}.xlsx`;

    // Download file
    XLSX.writeFile(workbook, filename);
  };
  return (
    <>
      <SuccessButton text="Export to Excel" onClick={handleExportToExcel} />
    </>
  );
};
