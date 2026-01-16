import {
  useState,
  useCallback,
  type Dispatch,
  type SetStateAction,
} from "react";

export interface ZebraPrinter {
  uid: string;
  name: string;
  connection: string;
  deviceType: string;
  provider: string;
  version: string;
  manufacturer: string;
}

interface BrowserPrintResponse {
  printer?: ZebraPrinter[];
}

export const UseZebraPrinter = () => {
  const [printers, setPrinters] = useState<ZebraPrinter[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState<ZebraPrinter | null>(
    null
  );
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkBrowserPrint = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch("http://localhost:9100/available");
      return response.ok;
    } catch {
      setError("Zebra Browser Print is not running");
      return false;
    }
  }, []);

  const getPrinters = useCallback(
    async (
      setLoadingPrinters: Dispatch<SetStateAction<boolean>>
    ): Promise<void> => {
      setLoadingPrinters(true);
      try {
        const response = await fetch("http://localhost:9100/available");
        const data: BrowserPrintResponse = await response.json();

        if (data.printer?.length) {
          setPrinters(data.printer);
          setSelectedPrinter(data.printer[0]);
          setIsConnected(true);
          setError(null);
        } else {
          setError("No printers found");
          setIsConnected(false);
        }
      } catch (err) {
        console.log("Error: ", err);
        setError("Failed to load printers");
        setIsConnected(false);
      } finally {
        setLoadingPrinters(false);
      }
    },
    []
  );

  // Generate ZPL
  const generateZPL = (
    part: string,
    lot: string,
    qty: string,
    user: string,
    date?: string
  ): string => {
    const qrData = `${part}|${lot}|${qty}`;
    const text_scale_value = localStorage.getItem("text_scale");
    const text_scale = text_scale_value
      ? Number(localStorage.getItem("text_scale"))
      : 0;
    const x_axis_value = localStorage.getItem("text_x_axis");
    const text_x_axis = x_axis_value
      ? Number(localStorage.getItem("text_x_axis"))
      : 0;
    return `
^XA

^CF0,${20 + text_scale}
^FO${20 + text_x_axis},35
^FD${part}^FS

^CF0,15
^FO${20 + text_x_axis},65
^FDLot: ${lot}^FS

^FO${20 + text_x_axis},85
^FDQty: ${qty}^FS

^FO${20 + text_x_axis},105
^FDUser: ${user}^FS

^FO${20 + text_x_axis},125
^FDDate: ${date}^FS

// FOR QR CODE
^FO170,25
^BQN,2,4
^FDLA,${qrData}^FS

^PQ1,0,1,Y
^XZ
`.trim();
  };

  const print = useCallback(
    async (
      zpl: string,
      setIsPrinting?: Dispatch<SetStateAction<boolean>>
    ): Promise<boolean> => {
      if (!selectedPrinter) {
        setError("No printer selected");
        return false;
      }

      try {
        if (setIsPrinting) setIsPrinting(true);
        const response = await fetch("http://localhost:9100/write", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            device: selectedPrinter, // FULL OBJECT
            data: zpl,
          }),
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || "Browser Print error");
        }

        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to write to device"
        );
        return false;
      } finally {
        if (setIsPrinting) setIsPrinting(false);
      }
    },
    [selectedPrinter]
  );

  return {
    printers,
    selectedPrinter,
    setSelectedPrinter,
    isConnected,
    error,
    getPrinters,
    generateZPL,
    print,
    checkBrowserPrint,
  };
};
