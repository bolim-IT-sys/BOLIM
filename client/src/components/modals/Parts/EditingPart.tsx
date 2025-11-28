import { useState } from "react";
import InputField from "../../InputField";
import { Modal } from "../../Modal";
import SuccessButton from "../../button/SuccessButton";
import {
  editPart,
  type AddingPartType,
  type Part,
} from "../../../services/Part.Service";
import SecondaryButton from "../../button/SecondaryButton";

interface EditingProps {
  fetchAllParts: () => void;
  part: Part;
}

export const EditingPart = ({ fetchAllParts, part }: EditingProps) => {
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [formData, setFormData] = useState<AddingPartType>({
    partNumber: part.partNumber,
    specs: part.specs,
    category: part.category,
    unitPrice: String(part.unitPrice),
    company: part.company,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const id = part.id;

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const result = await editPart(id!, formData);
      // console.log("creating part");

      if (result.success) {
        setTimeout(
          () => {
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
          },
          import.meta.env.VITE_TIME_OUT
        );
        // Redirect or update UI
      } else {
        setTimeout(
          () => {
            alert(`${result.message}`);
          },
          import.meta.env.VITE_TIME_OUT
        );
      }
    } catch (error) {
      console.error("Unexpecter error occured: ", error);
    } finally {
      setTimeout(
        () => {
          setIsLoading(false);
        },
        import.meta.env.VITE_TIME_OUT
      );
    }
  };

  const NoChanges = () => {
    return (
      part.partNumber === formData.partNumber &&
      part.specs === formData.specs &&
      part.category === formData.category &&
      String(part.unitPrice) === formData.unitPrice &&
      part.company === formData.company
    );
  };

  return (
    <>
      <SuccessButton
        text={<i className="bx  bxs-edit"></i>}
        onClick={() => setModalShow(true)}
      />

      <Modal
        isOpen={modalShow}
        onClose={() => setModalShow(false)}
        size="md"
        title={"EDIT PART DETAILS"}
        footer={
          <>
            <SuccessButton
              text="SAVE"
              loadingText="SAVING CHANGES"
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={isLoading || NoChanges()}
            />
            <SecondaryButton text="CLOSE" onClick={() => setModalShow(false)} />
          </>
        }
      >
        <div className="text-start">
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
              required={true}
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
        </div>
      </Modal>
    </>
  );
};
