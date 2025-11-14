import { formatDate } from "../../helper/helper";
import type { Stock } from "../../services/stockService";
import * as XLSX from "xlsx";
import SuccessButton from "../button/SuccessButton";

interface ItemDataProp {
  stock: Stock;
}

export const ItemData = ({ stock }: ItemDataProp) => {
  const handleExportToExcel = () => {
    // Prepare data for Excel
    const excelData = stock.availableItems!.map((item) => ({
      "Serial Number": item.serialNumber,
      "PR Date": item.PRDate || "N/A",
      "Received Date": formatDate(item.receivedDate),
      "Deployed Date": item.deployedDate
        ? formatDate(item.deployedDate)
        : "N/A",
      Station: item.station || "N/A",
      Department: item.department || "N/A",
      Status: item.remarks,
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
      { wch: 15 }, // Status
    ];

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, stock.name);

    // Generate filename with current date
    const date = new Date().toISOString().split("T")[0];
    const filename = `${stock.name}_Stock_${date}.xlsx`;

    // Download file
    XLSX.writeFile(workbook, filename);
  };
  return (
    <>
      <SuccessButton text="Export to Excel" onClick={handleExportToExcel} />
    </>
  );
};
