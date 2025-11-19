import { currentMonth } from "../../helper/helper";
import * as XLSX from "xlsx";
import SuccessButton from "../button/SuccessButton";
import type { Part } from "../../services/Part.Service";

interface ItemDataProp {
  parts: Part[];
}

export const DownloadPartData = ({ parts }: ItemDataProp) => {
  const handleExportToExcel = () => {
    // Prepare data for Excel
    const excelData = parts.map((part) => ({
      "Part number": part.partNumber,
      Specifications: part.specs || "N/A",
      Category: part.category,
      "Unit Price": part.unitPrice,
      Company: part.company || "N/A",
      "Current Stocks": part.quantity || "N/A",
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    worksheet["!cols"] = [
      { wch: 20 }, // Serial Number
      { wch: 15 }, // PR Date
      { wch: 15 }, // Received Date
      { wch: 15 }, // Deployed Date
      { wch: 20 }, // Station
      { wch: 20 }, // Department
    ];

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet);

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
