// THIS IS FOR OUTBOUNDING STOCKS ON INVENTORY
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
import Swal from "sweetalert2";
import Select, { type SingleValue } from "react-select"

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
// Select Options
type OptionType = {
  value: string;
  label: string;
};
const station: OptionType[] = [
  { value: "Sub1", label: "Sub1" },
  { value: "Sub2", label: "Sub2" },
  { value: "Sub3", label: "Sub3" },
  { value: "Sub4", label: "Sub4" },
  { value: "Sub5", label: "Sub5" },
  { value: "Sub6", label: "Sub6" },
  { value: "Sub7", label: "Sub7" },
  { value: "Sub8", label: "Sub8" },
  { value: "Sub9", label: "Sub9" },
  { value: "Sub10", label: "Sub10" },
  { value: "Material", label: "Material" },
  { value: "Rework", label: "Rework" },
  { value: "Packing", label: "Packing" },
  { value: "Dimension", label: "Dimension" },
  { value: "Production", label: "Production" },
  { value: "Wrap up", label: "Wrap up" },
  { value: "Vision", label: "Vision" },
  { value: "Airleak", label: "Airleak" },
  { value: "Circuit", label: "Circuit" },
  { value: "Fuse and Relay", label: "Fuse and Relay" },
];
const department: OptionType[] = [
  { value: "Assembly", label: "Assembly" },
  { value: "Cutting & Crimpping", label: "Cutting & Crimpping" },
  { value: "Line 1", label: "Line 1" },
  { value: "Line 2", label: "Line 2" },
  { value: "Line 3", label: "Line 3" },
  { value: "Line 4", label: "Line 4" },
  { value: "Line 5", label: "Line 5" },
  { value: "Line 6", label: "Line 6" },
  { value: "Line 7", label: "Line 7" },
  { value: "Line 8", label: "Line 8" },
  { value: "Line 9", label: "Line 9" },
  { value: "Line 10", label: "Line 10" },
  { value: "Line 11", label: "Line 11" },
  { value: "Line 12", label: "Line 12" },
  { value: "Line 13", label: "Line 13" },
  { value: "Line 14", label: "Line 14" },
  { value: "Line 15", label: "Line 15" },
  { value: "Line 16", label: "Line 16" },
  { value: "Line 17", label: "Line 17" },
  { value: "Line 18", label: "Line 18" },
  { value: "Line 19", label: "Line 19" },
  { value: "Planning", label: "Planning" },
  { value: "Quality Control", label: "Quality Control" },
  { value: "Technology 1", label: "Technology 1" },
  { value: "Technology 2", label: "Technology 2" },
  { value: "Warehouse Plannig", label: "Warehouse Plannig" },
];

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
    reason: "",
    remarks: "deployed",
  });

  // SETTING ITEM DETAILS VALUE AUTOMATICALLY
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
  // Test code ONLY! ------------------------
  const handleOutbound = async (action: "pending" | "on_hold" | "completed") => {
    setOutBounding(true);
    try {
      if (type === "it") {
        // DEPLOYING THE ITEM IN THE DATABASE FIRST
        const deployItem = await outboundItem({
          ...itemDetails,
          remarks: action,
        });

        if (!deployItem.success) {
          // IF FAILED RETURN ERROR
          setTimeout(
            () => {
              setOutboundShow(false);
              return Swal.fire({
                icon: "error",
                title: "Outbound Failed",
                text: deployItem.message,
              }).then(() => {
                setOutboundShow(true);
              });
            },
            import.meta.env.VITE_TIME_OUT,
          );
        }
        if (action === "completed") {
          await outboundPart(
            item,
            formData,
            setFormData,
            setOutboundShow,
            setModalShow,
            fetchTransactions,
            fetchAllParts,
            setData,
            setItemDetails,
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
          setItemDetails,
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
        import.meta.env.VITE_TIME_OUT,
      );
    }
  };
  //--------------------------
  {/*const handleOutbound = async () => {
    setOutBounding(true);
    try {
      if (type === "it") {
        // DEPLOYING THE ITEM IN THE DATABASE FIRST
        const deployItem = await outboundItem(itemDetails);

        if (!deployItem.success) {
          // IF FAILED RETURN ERROR
          setTimeout(
            () => {
              setOutboundShow(false);
              return Swal.fire({
                icon: "error",
                title: "Outbound Failed",
                text: deployItem.message,
              }).then(() => {
                setOutboundShow(true);
              });
            },
            import.meta.env.VITE_TIME_OUT,
          );
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
            setItemDetails,
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
          setItemDetails,
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
        import.meta.env.VITE_TIME_OUT,
      );
    }
  };*/}

  // CHECKING IF THE FORM IS COMPLETE BEFORE ENABLING THE SUBMIT BUTTON
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
              {`OUTBOUND ${type === "pin"
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
                text="Request"
                loadingText="OUTBOUNDING"
                onClick={() => handleOutbound("pending")}
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
              {/* THESE FIELDS ARE ONLY ENABLED ON IT STOCKS */}
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
                <div className="w-full">
                  <Select<OptionType>
                    options={station}
                    onChange={(option: SingleValue<OptionType>) =>
                      setItemDetails((prev) => ({ ...prev, station: option?.value || "" }))}
                    isSearchable
                    placeholder="Select Station"
                  />
                </div>
              </div>
              <div className="mb-1">
                <label
                  htmlFor="DEPARTMENT"
                  className="block font-medium text-gray-700"
                >
                  <p>DEPARTMENT</p>
                </label>
                <div className="w-full">
                  <Select<OptionType>
                    options={department}
                    onChange={(option: SingleValue<OptionType>) =>
                      setItemDetails((prev) => ({ ...prev, department: option?.value || "" }))}
                    isSearchable
                    placeholder="Select Department"
                  />
                </div>
              </div>
              <div className="mb-1">
                <label
                  htmlFor="REASON"
                  className="block font-medium text-gray-700"
                >
                  <p>REASON</p>
                </label>
                <InputField
                  label="REASON"
                  type="text"
                  value={itemDetails.reason!}
                  onChange={(value: string) =>
                    setItemDetails((prev) => ({ ...prev, reason: value }))
                  }
                  autoComplete={`reason`}
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
        </div >
      </Modal >
    </>
  );
};
