import SuccessButton from "../button/SuccessButton";
import type { ITStocks } from "../../services/InboundOutbound.Service";
import type { Part } from "../../services/Part.Service";

interface DataProp {
  data: ITStocks[];
  item: Part;
  isLoading: boolean;
}

export const DownloadStockData = ({ data, item, isLoading }: DataProp) => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

  const handleExportToExcel = async () => {
    try {
      const res = await fetch(`${API_URL}/export-items-to-excel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data,
        }),
      });

      // Convert backend response to file download
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${item.partNumber.toUpperCase()}_SUMMARY.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
    }
  };
  return (
    <>
      <SuccessButton
        text="EXPORT TO EXCEL"
        onClick={() => handleExportToExcel()}
        disabled={isLoading}
      />
    </>
  );
};
