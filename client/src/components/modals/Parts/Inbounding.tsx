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
}: Props) => {
  const [itemDetails, setItemDetails] = useState<addItemType>({
    // from: formData.from!,
    stockId: item.id!,
    serialNumber: `${item.partNumber} ${item.inbounds!.length + 1}`,
    PRDate: "",
    receivedDate: formData.inboundDate!,
  });

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
            setFormData
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
          setFormData
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
        title={`INBOUND ${
          type === "pin"
            ? "PIN"
            : type === "it"
              ? "ITEM"
              : type === "material"
                ? "MATERIAL"
                : "INVALID TYPE"
        } (${item.partNumber})`}
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
                disabled={inbounding || inboundFilled()}
              />
            </div>
          </>
        }
      >
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
                    setItemDetails((prev) => ({ ...prev, serialNumber: value }))
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
        </div>
      </Modal>
    </>
  );
};
