import SuccessButton from "../../button/SuccessButton";
import SecondaryButton from "../../button/SecondaryButton";
import InputField from "../../InputField";
import { Modal } from "../../Modal";
import type { Part } from "../../../services/Part.Service";
import {
  outboundItem,
  outboundPart,
  type deployItemType,
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
  outboundShow: boolean;
  setOutboundShow: (value: boolean) => void;
  outbounding: boolean;
  setOutBounding: (value: boolean) => void;
  setModalShow: (value: boolean) => void;
  handleChange: (field: string, value: string) => void;
}

export const Outbounding = ({
  item,
  type,
  fetchAllParts,
  setData,
  formData,
  setFormData,
  fetchTransactions,
  outboundShow,
  setOutboundShow,
  outbounding,
  setOutBounding,
  setModalShow,
  handleChange,
}: Props) => {
  const [itemDetails, setItemDetails] = useState<deployItemType>({
    serialNumber: ``,
    deployedDate: formData.outboundDate!,
    station: "",
    department: "",
    remarks: "deployed",
  });

  useEffect(() => {
    setItemDetails((prev) => ({
      ...prev,
      deployedDate: formData.outboundDate!,
      station: prev.station,
      department: prev.department,
    }));
  }, [formData, item]);

  const handleOutbound = async () => {
    setOutBounding(true);
    try {
      if (type === "it") {
        const deployItem = await outboundItem(itemDetails);

        if (!deployItem.success) {
          return alert(deployItem.message);
        }
      }
      const result = await outboundPart(formData);
      // console.log("deploying stock item.");

      if (result.success) {
        setTimeout(
          () => {
            alert(result.message);
            setOutboundShow(false);
            setModalShow(true);
            fetchTransactions();
            fetchAllParts();
            // UPDATING THE QUANTITY OF THE INBOUNDED PART
            setData((prevParts) =>
              prevParts.map((p) =>
                p.id === formData.partId
                  ? { ...p, quantity: p.quantity - Number(formData.quantity) }
                  : p
              )
            );
            // RESETTING FORMDATA AFTER INBOUND
            setFormData((prev) => ({
              ...prev,
              partId: item.id!,
              currentQuantity: item.quantity + Number(formData.quantity),
              quantity: "1",
            }));
            setItemDetails((prev) => ({
              ...prev,
              partId: item.id!,
              currentQuantity: item.quantity + Number(formData.quantity),
              quantity: "1",
            }));
          },
          import.meta.env.VITE_TIME_OUT
        );
        // Redirect or update UI
      } else {
        setTimeout(
          () => {
            alert(`Error: ${result.message}`);
          },
          import.meta.env.VITE_TIME_OUT
        );
      }
    } catch (error) {
      console.error("Unexpecter error occured: ", error);
    } finally {
      setTimeout(
        () => {
          setOutBounding(false);
        },
        import.meta.env.VITE_TIME_OUT
      );
    }
  };

  const outboundFilled = () => {
    return formData.quantity === "" || formData.inboundDate === "";
  };

  return (
    <>
      <Modal
        isOpen={outboundShow}
        onClose={() => {
          setOutboundShow(false);
          setModalShow(true);
        }}
        title={`OUTBOUND ${
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
            <SuccessButton
              text="CONFIRM"
              loadingText="OUTBOUNDING"
              onClick={handleOutbound}
              isLoading={outbounding}
              disabled={outbounding || outboundFilled()}
            />
            <SecondaryButton
              text="CLOSE"
              onClick={() => {
                setOutboundShow(false);
                setModalShow(true);
              }}
            />
          </>
        }
      >
        <div className="text-start">
          {type === "it" ? (
            <>
              <div className="mb-1">
                <label className="block font-medium text-gray-700">
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
                <label className="block font-medium text-gray-700">
                  <p>STATION</p>
                </label>
                <InputField
                  label="PR DATE"
                  type="text"
                  value={itemDetails.station!}
                  onChange={(value: string) =>
                    setItemDetails((prev) => ({ ...prev, station: value }))
                  }
                  autoComplete={`station`}
                />
              </div>{" "}
              <div className="mb-1">
                <label className="block font-medium text-gray-700">
                  <p>DEPARTMENT</p>
                </label>
                <InputField
                  label="PR DATE"
                  type="text"
                  value={itemDetails.department!}
                  onChange={(value: string) =>
                    setItemDetails((prev) => ({ ...prev, department: value }))
                  }
                  autoComplete={`department`}
                />
              </div>
            </>
          ) : (
            <div className="mb-1">
              <label className="block font-medium text-gray-700">
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
            <label className="block font-medium text-gray-700">
              <p>OUTBOUND DATE</p>
            </label>
            <InputField
              label="OUTBOUND DATE"
              type="date"
              value={formData.outboundDate!}
              required={true}
              onChange={(value: string) => handleChange("outboundDate", value)}
              autoComplete={`outboundDate`}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};
