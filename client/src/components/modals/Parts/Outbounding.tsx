import SuccessButton from "../../button/SuccessButton";
import SecondaryButton from "../../button/SecondaryButton";
import InputField from "../../InputField";
import { Modal } from "../../Modal";
import type { Part } from "../../../services/Part.Service";
import {
  outboundPart,
  type InboundOutboundType,
} from "../../../services/InboundOutbound.Service";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  part: Part;
  fetchAllParts: () => void;
  setParts: Dispatch<SetStateAction<Part[]>>;
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
  part,
  fetchAllParts,
  setParts,
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
  const handleOutbound = async () => {
    setOutBounding(true);
    try {
      const result = await outboundPart(formData);
      // console.log("deploying stock item.");

      if (result.success) {
        setTimeout(() => {
          alert(result.message);
          setOutboundShow(false);
          setModalShow(true);
          fetchTransactions();
          fetchAllParts();
          // UPDATING THE QUANTITY OF THE INBOUNDED PART
          setParts((prevParts) =>
            prevParts.map((p) =>
              p.id === formData.partId
                ? { ...p, quantity: p.quantity - Number(formData.quantity) }
                : p
            )
          );
          // RESETTING FORMDATA AFTER INBOUND
          setFormData((prev) => ({
            ...prev,
            partId: part.id!,
            currentQuantity: part.quantity + Number(formData.quantity),
            quantity: "",
          }));
        }, 0);
        // Redirect or update UI
      } else {
        setTimeout(() => {
          alert(`Error: ${result.message}`);
        }, 0);
      }
    } catch (error) {
      console.error("Unexpecter error occured: ", error);
    } finally {
      setTimeout(() => {
        setOutBounding(false);
      }, 0);
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
        title={`OUTBOUND PART (${part.partNumber})`}
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
