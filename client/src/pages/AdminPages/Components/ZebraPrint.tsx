import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import SecondaryButton from "../../../components/button/SecondaryButton";
import PrimaryButton from "../../../components/button/PrimaryButton";
import SuccessButton from "../../../components/button/SuccessButton";
import type { ZebraPrinter } from "../../../services/ZebraPrinter.Service";

type Props = {
  setShowPrinter: (value: boolean) => void;
  printers: ZebraPrinter[];
  selectedPrinter: ZebraPrinter | null;
  setSelectedPrinter: Dispatch<SetStateAction<ZebraPrinter | null>>;
  isConnected: boolean;
  error: string | null;
  getPrinters: (value: Dispatch<SetStateAction<boolean>>) => void;
  print: (value: string) => Promise<boolean>;
  checkBrowserPrint: () => Promise<boolean>;
};

const ZebraPrint = ({
  setShowPrinter,
  printers,
  selectedPrinter,
  setSelectedPrinter,
  isConnected,
  error,
  getPrinters,
  print,
  checkBrowserPrint,
}: Props) => {
  const [loadingPrinters, setLoadingPrinters] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      const available = await checkBrowserPrint();
      if (available) {
        await getPrinters(setLoadingPrinters);
      }
    };
    initialize();
  }, [checkBrowserPrint, getPrinters]);

  // Generate ZPL
  const generateZPL = (text: string): string => {
    const qrData = `${text}|${text}|${text}`;
    return `
^XA

^CF0,20
^FO220,35
^FD${text}^FS

^CF0,15
^FO220,65
^FDLot: ${text}^FS

^FO220,85
^FDQty: ${text}^FS

^FO220,105
^FDUser: ${text}^FS

^FO220,125
^FDDate: ${text}^FS

// FOR QR CODE
^FO370,25
^BQN,2,4
^FDLA,${qrData}^FS

^PQ1,0,1,Y
^XZ
`.trim();
  };

  const handlePrint = async (): Promise<void> => {
    const zpl = generateZPL("SAMPLE");
    const success = await print(zpl);
    if (success) {
      alert("Print job sent successfully!");
    }
  };

  return (
    <>
      <div className="text-start">
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
        {/* <div style={{ marginBottom: "20px" }}>
          <label style={{ fontWeight: "bold", display: "block" }}>
            Label Text:
          </label>
          <input
            type="text"
            value={labelText}
            onChange={(e) => setLabelText(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div> */}

        {/* Actions */}
        <div className="flex h-10 gap-2">
          <SecondaryButton text="BACK" onClick={() => setShowPrinter(false)} />
          <PrimaryButton text="TEST PRINT" onClick={handlePrint} />
          <SuccessButton
            text="REFRESH"
            loadingText="LOADING"
            isLoading={loadingPrinters}
            disabled={loadingPrinters}
            onClick={() => getPrinters(setLoadingPrinters)}
          />
        </div>
      </div>
    </>
  );
};

export default ZebraPrint;
