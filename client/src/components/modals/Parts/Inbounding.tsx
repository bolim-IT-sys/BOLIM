import SuccessButton from "../../button/SuccessButton";
import SecondaryButton from "../../button/SecondaryButton";
import InputField from "../../InputField";
import { Modal } from "../../Modal";
import type { Part } from "../../../services/Part.Service";
import {
  inboundPart,
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
  inboundShow: boolean;
  setInboundShow: (value: boolean) => void;
  inbounding: boolean;
  setInBounding: (value: boolean) => void;
  setModalShow: (value: boolean) => void;
  handleChange: (field: string, value: string) => void;
}

export const Inbounding = ({
  part,
  fetchAllParts,
  setParts,
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
  const handleInbound = async () => {
    setInBounding(true);
    try {
      const result = await inboundPart(formData);
      // console.log("deploying stock item.");

      if (result.success) {
        setTimeout(() => {
          alert(result.message);
          fetchTransactions();
          fetchAllParts();
          setInboundShow(false);
          setModalShow(true);
          // UPDATING THE QUANTITY OF THE INBOUNDED PART
          setParts((prevParts) =>
            prevParts.map((p) =>
              p.id === formData.partId
                ? { ...p, quantity: p.quantity + Number(formData.quantity) }
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
        setInBounding(false);
      }, 0);
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
        title={`INBOUND PART (${part.partNumber})`}
        size="md"
        footer={
          <>
            <SuccessButton
              text="CONFIRM"
              loadingText="INBOUNDING"
              onClick={handleInbound}
              isLoading={inbounding}
              disabled={inbounding || inboundFilled()}
            />
            <SecondaryButton
              text="CLOSE"
              onClick={() => {
                setInboundShow(false);
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
