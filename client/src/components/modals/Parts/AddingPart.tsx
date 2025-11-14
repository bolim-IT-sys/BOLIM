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

interface AddingProps {
  fetchAllParts: () => void;
}

export const AddingPart = ({ fetchAllParts }: AddingProps) => {
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [formData, setFormData] = useState<AddingPartType>({
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
      console.log("Adding part.");

      if (result.success) {
        setTimeout(() => {
          setIsLoading(false);
          alert(result.message);
          fetchAllParts();
          setModalShow(false);
          setFormData({
            partNumber: "",
            specs: "",
            category: "",
            unitPrice: "",
            company: "",
          });
        }, 1500);
        // Redirect or update UI
      } else {
        setTimeout(() => {
          setIsLoading(false);
          alert(`Error: ${result.message}`);
        }, 1500);
      }
    } catch (error) {
      console.error("Unexpecter error occured: ", error);
    }
  };

  return (
    <>
      <PrimaryButton text={`ADD PART`} onClick={() => setModalShow(true)} />

      <Modal
        isOpen={modalShow}
        onClose={() => setModalShow(false)}
        title={"ADD PART"}
        size="md"
        footer={
          <>
            <SuccessButton
              text="ADD"
              loadingText="ADDING PART"
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={isLoading}
            />
            <SecondaryButton text="CLOSE" onClick={() => setModalShow(false)} />
          </>
        }
      >
        <div className="mb-1">
          <label className="block font-medium text-gray-700">
            <p>PART NUMBER</p>
          </label>
          <InputField
            label="PART NUMBER"
            type="text"
            value={formData.partNumber}
            required={true}
            onChange={(value: string) => handleChange("partNumber", value)}
            autoComplete={`partNumber`}
          />
        </div>
        <div className="mb-1">
          <label className="block font-medium text-gray-700">
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
          <label className="block font-medium text-gray-700">
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
          <label className="block font-medium text-gray-700">
            <p>UNIT PRICE</p>
          </label>
          <InputField
            label="UNIT PRICE"
            type="text"
            value={formData.unitPrice}
            required={true}
            onChange={(value: string) => handleChange("unitPrice", value)}
            autoComplete={`unitPrice`}
          />
        </div>
        <div className="mb-1">
          <label className="block font-medium text-gray-700">
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
