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
  serialNumber: string;
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
  serialNumber,
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
    from: formData.from!,
    to: formData.to!,
    serialNumber: ``,
    deployedDate: formData.outboundDate!,
    station: "",
    department: "",
    remarks: "deployed",
  });

  useEffect(() => {
    setItemDetails((prev) => ({
      ...prev,
      from: formData.from!,
      to: formData.to!,
      serialNumber: serialNumber ? serialNumber : ``,
      deployedDate: formData.outboundDate!,
      station: prev.station,
      department: prev.department,
    }));
  }, [formData, item, serialNumber]);

  const handleOutbound = async () => {
    setOutBounding(true);
    try {
      if (type === "it") {
        const deployItem = await outboundItem(itemDetails);

        if (!deployItem.success) {
          return alert(deployItem.message);
        } else {
          await outboundPart(
            item,
            formData,
            setFormData,
            setOutboundShow,
            setModalShow,
            fetchTransactions,
            fetchAllParts,
            setData,
            setItemDetails
          );
        }
      } else {
        await outboundPart(
          item,
          formData,
          setFormData,
          setOutboundShow,
          setModalShow,
          fetchTransactions,
          fetchAllParts,
          setData,
          setItemDetails
        );
      }

      // console.log("deploying stock item.");
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

  const incompleteForm = () => {
    if (type === "it") {
      return (
        formData.from === "" ||
        formData.to === "" ||
        formData.serialNumber === "" ||
        itemDetails.station === "" ||
        itemDetails.department === "" ||
        formData.quantity === "" ||
        formData.inboundDate === ""
      );
    }
    return (
      formData.from === "" ||
      formData.to === "" ||
      formData.quantity === "" ||
      formData.inboundDate === ""
    );
  };

  return (
    <>
      <Modal
        isOpen={outboundShow}
        onClose={() => {
          setOutboundShow(false);
          setModalShow(true);
        }}
        title={
          <>
            <h4 className="w-55 sm:w-100 text-start">
              {`OUTBOUND ${
                type === "pin"
                  ? "PIN"
                  : type === "it"
                    ? "ITEM"
                    : type === "material"
                      ? "MATERIAL"
                      : "INVALID TYPE"
              } (${item.partNumber})`}
            </h4>
          </>
        }
        size="md"
        footer={
          <>
            <div className="h-10 flex gap-2">
              <SecondaryButton
                text="CLOSE"
                onClick={() => {
                  setOutboundShow(false);
                  setModalShow(true);
                }}
              />
              <SuccessButton
                text="CONFIRM"
                loadingText="OUTBOUNDING"
                onClick={handleOutbound}
                isLoading={outbounding}
                disabled={outbounding || incompleteForm()}
              />
            </div>
          </>
        }
      >
        <div className="text-start">
          <div className="mb-1">
            <label
              htmlFor="OUTBOUND PERSONEL"
              className="block font-medium text-gray-700"
            >
              <p>OUTBOUND PERSONEL</p>
            </label>
            <InputField
              label="OUTBOUND PERSONEL"
              type="text"
              value={formData.from!}
              onChange={(value: string) =>
                setFormData((prev) => ({ ...prev, from: value }))
              }
              autoComplete={`from`}
            />
          </div>
          <div className="mb-1">
            <label
              htmlFor="RECEIVER"
              className="block font-medium text-gray-700"
            >
              <p>RECEIVER</p>
            </label>
            <InputField
              label="RECEIVER"
              type="text"
              value={formData.to!}
              onChange={(value: string) =>
                setFormData((prev) => ({ ...prev, to: value }))
              }
              autoComplete={`to`}
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
                  htmlFor="STATION"
                  className="block font-medium text-gray-700"
                >
                  <p>STATION</p>
                </label>
                <InputField
                  label="STATION"
                  type="text"
                  value={itemDetails.station!}
                  onChange={(value: string) =>
                    setItemDetails((prev) => ({ ...prev, station: value }))
                  }
                  autoComplete={`station`}
                />
              </div>
              <div className="mb-1">
                <label
                  htmlFor="DEPARTMENT"
                  className="block font-medium text-gray-700"
                >
                  <p>DEPARTMENT</p>
                </label>
                <InputField
                  label="DEPARTMENT"
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
              htmlFor="OUTBOUND DATE"
              className="block font-medium text-gray-700"
            >
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
