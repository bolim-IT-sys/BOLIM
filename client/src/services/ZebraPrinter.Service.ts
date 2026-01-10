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

export const useZebraPrinter = () => {
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

  const print = useCallback(
    async (zpl: string): Promise<boolean> => {
      if (!selectedPrinter) {
        setError("No printer selected");
        return false;
      }

      try {
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
    print,
    checkBrowserPrint,
  };
};
