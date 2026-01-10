import React, { useEffect, useState } from "react";
import { useZebraPrinter } from "../../../services/ZebraPrinter.Service";

const ZebraPrintTest: React.FC = () => {
  const {
    printers,
    selectedPrinter,
    setSelectedPrinter,
    isConnected,
    error,
    getPrinters,
    print,
    checkBrowserPrint,
  } = useZebraPrinter();

  const [labelText, setLabelText] = useState<string>("Sample Label");
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    const initialize = async () => {
      const available = await checkBrowserPrint();
      if (available) {
        await getPrinters();
      }
    };
    initialize();
  }, [checkBrowserPrint, getPrinters]);

  // Generate ZPL
  const generateZPL = (text: string): string => {
    return `
^XA
^FO50,50
^BQN,2,6
^FDLA,${text}^FS
^XZ
`.trim();
  };

  const handlePrint = async (): Promise<void> => {
    const zpl = generateZPL(labelText);
    const success = await print(zpl);
    if (success) {
      alert("Print job sent successfully!");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h2>Zebra ZD220 Printer Control</h2>

      {/* Status */}
      <div
        style={{
          padding: "10px",
          marginBottom: "20px",
          backgroundColor: isConnected ? "#d4edda" : "#f8d7da",
          border: `1px solid ${isConnected ? "#c3e6cb" : "#f5c6cb"}`,
          borderRadius: "4px",
        }}
      >
        <strong>Status:</strong> {isConnected ? "Connected" : "Not Connected"}
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            padding: "10px",
            marginBottom: "20px",
            backgroundColor: "#fff3cd",
            border: "1px solid #ffeaa7",
            borderRadius: "4px",
            color: "#856404",
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Printer Select */}
      {printers.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontWeight: "bold", display: "block" }}>
            Select Printer:
          </label>
          <select
            value={selectedPrinter?.uid ?? ""}
            onChange={(e) => {
              const printer =
                printers.find((p) => p.uid === e.target.value) ?? null;
              setSelectedPrinter(printer);
            }}
          >
            {printers.map((printer) => (
              <option key={printer.uid} value={printer.uid}>
                {printer.name} ({printer.connection})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Label Text */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ fontWeight: "bold", display: "block" }}>
          Label Text:
        </label>
        <input
          type="text"
          value={labelText}
          onChange={(e) => setLabelText(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />
      </div>

      {/* Quantity (future use) */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ fontWeight: "bold", display: "block" }}>
          Quantity:
        </label>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value) || 1)}
          style={{ width: "100%", padding: "8px" }}
        />
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={handlePrint}
          disabled={!isConnected}
          style={{
            padding: "10px 20px",
            backgroundColor: isConnected ? "#007bff" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Print Label
        </button>

        <button
          onClick={getPrinters}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Refresh Printers
        </button>
      </div>
    </div>
  );
};

export default ZebraPrintTest;
