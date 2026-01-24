// THIS IS FOR ADDING ITEMS ON ALL INVENTORY
import { useState } from "react";
import InputField from "../../InputField";
import { Modal } from "../../Modal";
import SuccessButton from "../../button/SuccessButton";
import SecondaryButton from "../../button/SecondaryButton";
import PrimaryButton from "../../button/PrimaryButton";
import {
  createPart,
  type AddingPartType,
} from "../../../services/Part.Service";
import Swal from "sweetalert2";

interface AddingProps {
  fetchAllParts: () => void;
  type: string;
}

export const AddingPart = ({ fetchAllParts, type }: AddingProps) => {
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [formData, setFormData] = useState<AddingPartType>({
    type: type,
    partNumber: "",
    specs: "",
    category: "",
    unitPrice: "",
    company: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleChange = (field: string, value: number | string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const result = await createPart(formData);
      // console.log("Adding part.");
      if (result.success) {
        setTimeout(
          () => {
            setModalShow(false);
            Swal.fire({
              icon: "success",
              title: `ADDING SUCCESS`,
              text: result.message,
              timer: 5000,
              showConfirmButton: false,
            });
            fetchAllParts();
            setFormData({
              type: type,
              partNumber: "",
              specs: "",
              category: "",
              unitPrice: "",
              company: "",
            });
          },
          import.meta.env.VITE_TIME_OUT,
        );
        // Redirect or update UI
      } else {
        setTimeout(
          () => {
            setModalShow(false);
            Swal.fire({
              icon: "error",
              title: "ADDING FAILED",
              text: result.message,
            }).then(() => {
              setModalShow(true);
            });
          },
          import.meta.env.VITE_TIME_OUT,
        );
      }
    } catch (error) {
      console.error("Unexpecter error occured: ", error);
      setModalShow(false);
      Swal.fire({
        icon: "error",
        title: "ADDING FAILED",
        text: `Unexpecter error occured: ${error}`,
      }).then(() => {
        setModalShow(true);
      });
    } finally {
      setTimeout(
        () => {
          setIsLoading(false);
        },
        import.meta.env.VITE_TIME_OUT,
      );
    }
  };

  // CHECKING IF THE FORM IS COMPLETE BEFORE ENABLING THE SUBMIT BUTTON
  const IncompleteForm = () => {
    return (
      formData.partNumber === "" ||
      formData.specs === "" ||
      formData.category === "" ||
      formData.unitPrice === "" ||
      formData.company === ""
    );
  };

  return (
    <>
      <PrimaryButton
        text={
          <>
            {`ADD ${
              type === "pin"
                ? "PIN"
                : type === "it"
                  ? "ITEM"
                  : type === "material"
                    ? "MATERIAL"
                    : "INVALID TYPE"
            }`}
          </>
        }
        onClick={() => setModalShow(true)}
      />

      <Modal
        isOpen={modalShow}
        onClose={() => setModalShow(false)}
        title={
          <>
            <h3>
              ADD{" "}
              {type === "pin"
                ? "PIN"
                : type === "it"
                  ? "ITEM"
                  : type === "material"
                    ? "MATERIAL"
                    : "INVALID TYPE"}
            </h3>
          </>
        }
        size="md"
        footer={
          <>
            <div className="h-10 flex gap-2">
              <SecondaryButton
                text="CLOSE"
                onClick={() => setModalShow(false)}
              />
              <SuccessButton
                text="ADD"
                loadingText={`ADDING ${
                  type === "pin"
                    ? "PIN"
                    : type === "it"
                      ? "ITEM"
                      : type === "material"
                        ? "MATERIAL"
                        : "INVALID TYPE"
                }`}
                onClick={handleSubmit}
                isLoading={isLoading}
                disabled={isLoading || IncompleteForm()}
              />
            </div>
          </>
        }
      >
        <div className="mb-1">
          <label
            htmlFor={
              type === "pin"
                ? "PIN NUMBER"
                : type === "it"
                  ? "ITEM NAME"
                  : type === "material"
                    ? "MATERIAL NAME"
                    : "INVALID TYPE"
            }
            className="block font-medium text-gray-700"
          >
            <p>
              {type === "pin"
                ? "PIN NUMBER"
                : type === "it"
                  ? "ITEM NAME"
                  : type === "material"
                    ? "MATERIAL NAME"
                    : "INVALID TYPE"}
            </p>
          </label>
          <InputField
            label={
              type === "pin"
                ? "PIN NUMBER"
                : type === "it"
                  ? "ITEM NAME"
                  : type === "material"
                    ? "MATERIAL NAME"
                    : "INVALID TYPE"
            }
            type="text"
            value={formData.partNumber}
            required={true}
            onChange={(value: string) => handleChange("partNumber", value)}
            autoComplete={`partNumber`}
          />
        </div>
        <div className="mb-1">
          <label
            htmlFor="SPECIFICATIONS"
            className="block font-medium text-gray-700"
          >
            <p>SPECIFICATIONS</p>
          </label>
          <InputField
            label="SPECIFICATIONS"
            type="text"
            value={formData.specs}
            onChange={(value: string) => handleChange("specs", value)}
            autoComplete={`specs`}
          />
        </div>
        <div className="mb-1">
          <label htmlFor="CATEGORY" className="block font-medium text-gray-700">
            <p>CATEGORY</p>
          </label>
          <InputField
            label="CATEGORY"
            type="text"
            value={formData.category}
            required={true}
            onChange={(value: string) => handleChange("category", value)}
            autoComplete={`category`}
          />
        </div>
        <div className="mb-1">
          <label
            htmlFor="UNIT PRICE"
            className="block font-medium text-gray-700"
          >
            <p>UNIT PRICE</p>
          </label>
          <InputField
            label="UNIT PRICE"
            type="number"
            value={formData.unitPrice}
            required={true}
            onChange={(value: string) => handleChange("unitPrice", value)}
            autoComplete={`unitPrice`}
          />
        </div>
        <div className="mb-1">
          <label htmlFor="COMPANY" className="block font-medium text-gray-700">
            <p>COMPANY</p>
          </label>
          <InputField
            label="COMPANY"
            type="text"
            value={formData.company}
            required={true}
            onChange={(value: string) => handleChange("company", value)}
            autoComplete={`company`}
          />
        </div>
      </Modal>
    </>
  );
};
