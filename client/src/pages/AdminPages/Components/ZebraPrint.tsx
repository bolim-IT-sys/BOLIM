import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import SecondaryButton from "../../../components/button/SecondaryButton";
import PrimaryButton from "../../../components/button/PrimaryButton";
import SuccessButton from "../../../components/button/SuccessButton";
import type { ZebraPrinter } from "../../../services/ZebraPrinter.Service";
import InputField from "../../../components/InputField";

type Props = {
  setShowPrinter: (value: boolean) => void;
  printers: ZebraPrinter[];
  selectedPrinter: ZebraPrinter | null;
  setSelectedPrinter: Dispatch<SetStateAction<ZebraPrinter | null>>;
  isConnected: boolean;
  error: string | null;
  getPrinters: (value: Dispatch<SetStateAction<boolean>>) => void;
  generateZPL: (
    part: string,
    lot: string,
    qty: string,
    user: string,
    date?: string
  ) => string;
  print: (
    value1: string,
    value2?: Dispatch<SetStateAction<boolean>>
  ) => Promise<boolean>;
  loadingPrinters: boolean;
  setLoadingPrinters: Dispatch<SetStateAction<boolean>>;
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
  generateZPL,
  print,
  loadingPrinters,
  setLoadingPrinters,
  checkBrowserPrint,
}: Props) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const [formData, setFormData] = useState({
    text_scale: localStorage.getItem("text_scale") ?? "",
    text_x_axis: localStorage.getItem("text_x_axis") ?? "",
    text_y_axis: localStorage.getItem("text_y_axis") ?? "",
    qr_scale: localStorage.getItem("qr_scale") ?? "",
    qr_x_axis: localStorage.getItem("qr_x_axis") ?? "",
    qr_y_axis: localStorage.getItem("qr_y_axis") ?? "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    localStorage.setItem(field, value);
  };

  useEffect(() => {
    const initialize = async () => {
      const available = await checkBrowserPrint();
      if (available) {
        await getPrinters(setLoadingPrinters);
      }
    };
    initialize();
  }, [checkBrowserPrint, getPrinters, setLoadingPrinters]);

  const handlePrint = async (): Promise<void> => {
    const zpl = generateZPL("SAMPLE", "SAMPLE", "SAMPLE", "SAMPLE", "SAMPLE");
    const success = await print(zpl, setIsPrinting);
    if (success) {
      alert("Print job sent successfully!");
    }
  };

  return (
    <>
      <div className="text-start">
        <h2>Zebra Printer Control</h2>

        {/* Status */}
        <div
          className={`${isConnected ? "bg-green-200" : "bg-red-200"} p-3 mb-2 rounded`}
        >
          <p>
            <strong>Status:</strong>{" "}
            {isConnected ? "Connected" : "Not Connected"}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className={`bg-amber-200 p-3 mb-2 rounded`}>
            <p>
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}

        {/* Printer Select */}
        {!error && printers.length > 0 && (
          <div className="mb-2">
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

        {!error && printers.length > 0 && (
          <div className="overflow-y-auto h-60 sm:h-max mb-2 flex flex-col gap-2">
            {/* TEXT LABEL CONFIGURATIONS */}
            <div className="border border-neutral-300 p-3 rounded">
              <h3>TEXT LABEL</h3>
              <div className="flex flex-col sm:flex-row gap-1 md:gap-2">
                <div className="mb-1">
                  <label
                    htmlFor="SCALE"
                    className="block font-medium text-gray-700"
                  >
                    <p>SCALE:</p>
                  </label>
                  <div className="flex items-center gap-1">
                    <div className="w-8/10">
                      <InputField
                        label="SCALE"
                        type="number"
                        value={formData.text_scale}
                        required={true}
                        onChange={(value: string) =>
                          handleChange("text_scale", value)
                        }
                        autoComplete={`text_scale`}
                      />
                    </div>

                    <h3 className="w-2/10 flex justify-center items-center flex-col">
                      <i className="bx bx-font-size"></i>
                    </h3>
                  </div>
                </div>
                <div className="mb-1">
                  <label
                    htmlFor="X-AXIS"
                    className="block font-medium text-gray-700"
                  >
                    <p>X-AXIS:</p>
                  </label>
                  <div className="flex items-center gap-1">
                    <div className="w-8/10">
                      <InputField
                        label="X-AXIS"
                        type="number"
                        value={formData.text_x_axis}
                        required={true}
                        onChange={(value: string) =>
                          handleChange("text_x_axis", value)
                        }
                        autoComplete={`text_x_axis`}
                      />
                    </div>

                    <h4 className="w-2/10 flex justify-center items-center">
                      <i className="bx bxs-arrow-from-right"></i>
                      <i className="bx bxs-arrow-from-left"></i>
                    </h4>
                  </div>
                </div>
                <div className="mb-1">
                  <label
                    htmlFor="Y-AXIS"
                    className="block font-medium text-gray-700"
                  >
                    <p>Y-AXIS:</p>
                  </label>
                  <div className="flex items-center gap-1">
                    <div className="w-8/10">
                      <InputField
                        label="Y-AXIS"
                        type="number"
                        value={formData.text_y_axis}
                        required={true}
                        onChange={(value: string) =>
                          handleChange("text_y_axis", value)
                        }
                        autoComplete={`text_y_axis`}
                      />
                    </div>

                    <h4 className="w-2/10 flex justify-center items-center flex-col">
                      <i className="bx bxs-arrow-from-bottom"></i>
                      <i className="bx bxs-arrow-from-top"></i>
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            {/* QR CODE CONFIGURATIONS */}
            <div className="border border-neutral-300 p-3 rounded">
              <h3>QR CODE</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="mb-1">
                  <label
                    htmlFor="SCALE"
                    className="block font-medium text-gray-700"
                  >
                    <p>SCALE:</p>
                  </label>
                  <div className="flex items-center gap-1">
                    <div className="w-8/10">
                      <InputField
                        label="SCALE"
                        type="number"
                        value={formData.qr_scale}
                        required={true}
                        onChange={(value: string) =>
                          handleChange("qr_scale", value)
                        }
                        autoComplete={`qr_scale`}
                      />
                    </div>

                    <h3 className="w-2/10 flex justify-center items-center flex-col">
                      <i className="bx bx-fullscreen"></i>
                    </h3>
                  </div>
                </div>
                <div className="mb-1">
                  <label
                    htmlFor="X-AXIS"
                    className="block font-medium text-gray-700"
                  >
                    <p>X-AXIS:</p>
                  </label>
                  <div className="flex items-center gap-1">
                    <div className="w-8/10">
                      <InputField
                        label="X-AXIS"
                        type="number"
                        value={formData.qr_x_axis}
                        required={true}
                        onChange={(value: string) =>
                          handleChange("qr_x_axis", value)
                        }
                        autoComplete={`qr_x_axis`}
                      />
                    </div>

                    <h4 className="w-2/10 flex justify-center items-center">
                      <i className="bx bxs-arrow-from-right"></i>
                      <i className="bx bxs-arrow-from-left"></i>
                    </h4>
                  </div>
                </div>
                <div className="mb-1">
                  <label
                    htmlFor="Y-AXIS"
                    className="block font-medium text-gray-700"
                  >
                    <p>Y-AXIS:</p>
                  </label>
                  <div className="flex items-center gap-1">
                    <div className="w-8/10">
                      <InputField
                        label="Y-AXIS"
                        type="number"
                        value={formData.qr_y_axis}
                        required={true}
                        onChange={(value: string) =>
                          handleChange("qr_y_axis", value)
                        }
                        autoComplete={`qr_y_axis`}
                      />
                    </div>

                    <h4 className="w-2/10 flex justify-center items-center flex-col">
                      <i className="bx bxs-arrow-from-bottom"></i>
                      <i className="bx bxs-arrow-from-top"></i>
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex h-10 gap-2">
          <SecondaryButton text="BACK" onClick={() => setShowPrinter(false)} />
          <PrimaryButton
            text="TEST PRINT"
            loadingText="PRINTING"
            isLoading={isPrinting}
            disabled={isPrinting || loadingPrinters}
            onClick={handlePrint}
          />
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
