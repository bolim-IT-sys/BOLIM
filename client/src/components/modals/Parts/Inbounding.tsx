import SuccessButton from "../../button/SuccessButton";
import SecondaryButton from "../../button/SecondaryButton";
import InputField from "../../InputField";
import { Modal } from "../../Modal";
import type { Part } from "../../../services/Part.Service";
import {
  addingItem,
  inboundPart,
  type addItemType,
  type InboundOutboundType,
} from "../../../services/InboundOutbound.Service";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import ZebraPrint from "../../../pages/AdminPages/Components/ZebraPrint";
import { SwitchButton } from "../../button/SwitchButton";
import { useZebraPrinter } from "../../../services/ZebraPrinter.Service";

interface Props {
  item: Part;
  type: string;
  fetchAllParts: () => void;
  setData: Dispatch<SetStateAction<Part[]>>;
  formData: InboundOutboundType;
  setFormData: Dispatch<SetStateAction<InboundOutboundType>>;
  fetchTransactions: () => void;
  inboundShow: boolean;
  setInboundShow: (value: boolean) => void;
  inbounding: boolean;
  setInBounding: (value: boolean) => void;
  setModalShow: (value: boolean) => void;
  handleChange: (field: string, value: string) => void;
  showPrinter: boolean;
  setShowPrinter: (value: boolean) => void;
}

export const Inbounding = ({
  item,
  type,
  fetchAllParts,
  setData,
  formData,
  setFormData,
  fetchTransactions,
  inboundShow,
  setInboundShow,
  inbounding,
  setInBounding,
  setModalShow,
  handleChange,
  showPrinter,
  setShowPrinter,
}: Props) => {
  const [printLabel, setPrintLabel] = useState(false);
  const [loadingPrinters, setLoadingPrinters] = useState(false);
  const [itemDetails, setItemDetails] = useState<addItemType>({
    // from: formData.from!,
    stockId: item.id!,
    serialNumber: `${item.partNumber} ${item.inbounds!.length + 1}`,
    PRDate: "",
    receivedDate: formData.inboundDate!,
  });

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

  useEffect(() => {
    const initialize = async () => {
      const available = await checkBrowserPrint();
      if (available) {
        await getPrinters(setLoadingPrinters);
      }
    };
    initialize();
  }, [checkBrowserPrint, getPrinters]);

  useEffect(() => {
    setItemDetails((prev) => ({
      ...prev,
      // from: formData.from!,
      serialNumber: `${item.partNumber} ${item.inbounds!.length + 1}`,
      receivedDate: formData.inboundDate!,
      PRDate: prev.PRDate,
    }));
  }, [formData, item]);

  const handleInbound = async () => {
    setInBounding(true);
    try {
      if (type === "it") {
        const addItem = await addingItem(itemDetails);

        if (!addItem.success) {
          return alert(addItem.message);
        } else {
          await inboundPart(
            item,
            formData,
            fetchTransactions,
            fetchAllParts,
            setInboundShow,
            setModalShow,
            setData,
            setFormData,
            print
          );
        }
      } else {
        await inboundPart(
          item,
          formData,
          fetchTransactions,
          fetchAllParts,
          setInboundShow,
          setModalShow,
          setData,
          setFormData,
          print
        );
      }

      // console.log("deploying stock item.");
    } catch (error) {
      alert(`Unexpecter error occured: ${error}`);
    } finally {
      setTimeout(
        () => {
          setInBounding(false);
        },
        import.meta.env.VITE_TIME_OUT
      );
    }
  };

  const inboundFilled = () => {
    return formData.quantity === "" || formData.inboundDate === "";
  };

  return (
    <>
      <Modal
        isOpen={inboundShow}
        onClose={() => {
          setInboundShow(false);
          setModalShow(true);
        }}
        title={
          <>
            <h3 className="text-start">
              INBOUND{" "}
              {type === "pin"
                ? "PIN"
                : type === "it"
                  ? "ITEM"
                  : type === "material"
                    ? "MATERIAL"
                    : "INVALID TYPE"}{" "}
              ({item.partNumber})
            </h3>
          </>
        }
        size="md"
        footer={
          <>
            <div className="h-10 flex gap-2">
              <SecondaryButton
                text="CLOSE"
                onClick={() => {
                  setInboundShow(false);
                  setModalShow(true);
                }}
              />
              <SuccessButton
                text="CONFIRM"
                loadingText="INBOUNDING"
                onClick={handleInbound}
                isLoading={inbounding}
                disabled={inbounding || inboundFilled() || !isConnected}
              />
            </div>
          </>
        }
      >
        {showPrinter ? (
          <ZebraPrint
            setShowPrinter={setShowPrinter}
            printers={printers}
            selectedPrinter={selectedPrinter}
            setSelectedPrinter={setSelectedPrinter}
            isConnected={isConnected}
            error={error}
            getPrinters={getPrinters}
            print={print}
            checkBrowserPrint={checkBrowserPrint}
          />
        ) : (
          <div className="text-start">
            <div className="mb-1">
              <label
                htmlFor="INBOUNDING PERSONEL"
                className="block font-medium text-gray-700"
              >
                <p>INBOUNDING PERSONEL</p>
              </label>
              <InputField
                label="INBOUNDING PERSONEL"
                type="text"
                value={formData.from}
                onChange={(value: string) => handleChange("from", value)}
                autoComplete={`from`}
              />
            </div>
            {type === "it" ? (
              <>
                <div className="mb-1">
                  <label
                    htmlFor="SERIAL NUMBER"
                    className="block font-medium text-gray-700"
                  >
                    <p>SERIAL NUMBER</p>
                  </label>
                  <InputField
                    label="SERIAL NUMBER"
                    type="text"
                    value={itemDetails.serialNumber!}
                    onChange={(value: string) =>
                      setItemDetails((prev) => ({
                        ...prev,
                        serialNumber: value,
                      }))
                    }
                    autoComplete={`serialNumber`}
                  />
                </div>
                <div className="mb-1">
                  <label
                    htmlFor="PR DATE"
                    className="block font-medium text-gray-700"
                  >
                    <p>PR DATE</p>
                  </label>
                  <InputField
                    label="PR DATE"
                    type="text"
                    value={itemDetails.PRDate!}
                    onChange={(value: string) =>
                      setItemDetails((prev) => ({ ...prev, PRDate: value }))
                    }
                    autoComplete={`PRDate`}
                  />
                </div>
              </>
            ) : (
              <div className="mb-1">
                <label
                  htmlFor="QUANTITY"
                  className="block font-medium text-gray-700"
                >
                  <p>QUANTITY</p>
                </label>
                <InputField
                  label="QUANTITY"
                  type="number"
                  value={formData.quantity}
                  onChange={(value: string) => handleChange("quantity", value)}
                  autoComplete={`quantity`}
                />
              </div>
            )}
            <div className="mb-1">
              <label
                htmlFor="INBOUND DATE"
                className="block font-medium text-gray-700"
              >
                <p>INBOUND DATE</p>
              </label>
              <InputField
                label="INBOUND DATE"
                type="date"
                value={formData.inboundDate!}
                required={true}
                onChange={(value: string) => handleChange("inboundDate", value)}
                autoComplete={`inboundDate`}
              />
            </div>
            <div className="flex items-center h-10 gap-1 mt-2">
              <SwitchButton
                checked={printLabel}
                onChange={setPrintLabel}
                disabled={!isConnected}
                label="Print Label"
              />
              <div>
                <h2
                  className="text-green-700 cursor-pointer"
                  onClick={() => getPrinters(setLoadingPrinters)}
                >
                  <i
                    className={`bx bx-refresh ${loadingPrinters ? "bx-spin" : ""}`}
                  ></i>
                </h2>
              </div>
              <div>
                <h2
                  className="text-sky-600 hover:text-sky-700 transition duration-300 ease-in-out cursor-pointer"
                  onClick={() => {
                    setShowPrinter(true);
                  }}
                >
                  <i className="bx bxs-cog"></i>
                </h2>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
