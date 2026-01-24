// FOR EDITING INVENTORY STOCKS
import { useRef, useState } from "react";
import InputField from "../../InputField";
import { Modal } from "../../Modal";
import SuccessButton from "../../button/SuccessButton";
import {
  editPart,
  type AddingPartType,
  type Part,
} from "../../../services/Part.Service";
import SecondaryButton from "../../button/SecondaryButton";
import Swal from "sweetalert2";

interface EditingProps {
  fetchAllParts: () => void;
  item: Part;
  type: string;
}

export const EditingPart = ({ fetchAllParts, item, type }: EditingProps) => {
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [formData, setFormData] = useState<AddingPartType>({
    image: null,
    type: item.type,
    partNumber: item.partNumber,
    specs: item.specs,
    category: item.category,
    unitPrice: String(item.unitPrice),
    company: item.company,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const id = item.id;

  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imgURL = URL.createObjectURL(file);
    setPreview(imgURL);
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!id) return;

      const fd = new FormData();

      fd.append("type", formData.type);
      fd.append("partNumber", formData.partNumber);
      fd.append("specs", formData.specs);
      fd.append("category", formData.category);
      fd.append("unitPrice", formData.unitPrice);
      fd.append("company", formData.company);

      if (formData.image) {
        fd.append("image", formData.image);
      }

      const result = await editPart(id, fd);
      // console.log("creating part");

      if (result.success) {
        setTimeout(
          () => {
            Swal.fire({
              icon: "success",
              title: `UPDATE SUCCESS`,
              text: result.message,
              timer: 5000,
              showConfirmButton: false,
            }).then(() => {
              setModalShow(false);
            });
            fetchAllParts();
            setFormData({
              type: formData.type,
              partNumber: formData.partNumber,
              specs: formData.specs,
              category: formData.category,
              unitPrice: String(formData.unitPrice),
              company: formData.company,
            });
          },
          import.meta.env.VITE_TIME_OUT,
        );
        // Redirect or update UI
      } else {
        setTimeout(
          () => {
            Swal.fire({
              icon: "error",
              title: "UPDATE FAILED",
              text: result.message,
            });
          },
          import.meta.env.VITE_TIME_OUT,
        );
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "UPDATE FAILED",
        text: `Unexpecter error occured: ${error}`,
      });
      console.error("Unexpecter error occured: ", error);
    } finally {
      setTimeout(
        () => {
          setIsLoading(false);
        },
        import.meta.env.VITE_TIME_OUT,
      );
    }
  };

  const NoChanges = () => {
    return (
      !formData.image &&
      item.partNumber === formData.partNumber &&
      item.specs === formData.specs &&
      item.category === formData.category &&
      String(item.unitPrice) === formData.unitPrice &&
      item.company === formData.company
    );
  };

  return (
    <>
      <SuccessButton
        text={<i className="bx bxs-edit"></i>}
        onClick={() => setModalShow(true)}
      />

      <Modal
        isOpen={modalShow}
        onClose={() => setModalShow(false)}
        size="md"
        title={
          <>
            <h3 className="text-start">
              EDIT{" "}
              {type === "pin"
                ? "PIN"
                : type === "it"
                  ? "ITEM"
                  : type === "material"
                    ? "MATERIAL"
                    : "INVALID TYPE"}{" "}
              DETAILS
            </h3>
          </>
        }
        footer={
          <>
            <div className="h-10 flex gap-2">
              <SecondaryButton
                text="CLOSE"
                onClick={() => setModalShow(false)}
              />
              <SuccessButton
                text="SAVE"
                loadingText="SAVING CHANGES"
                onClick={handleSubmit}
                isLoading={isLoading}
                disabled={isLoading || NoChanges()}
              />
            </div>
          </>
        }
      >
        <div className="text-start">
          <div className="mb-1">
            <div className="h-38 flex justify-center items-center">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleSelectImage}
              />
              <div
                className="size-38 bg-neutral-200 flex justify-center items-center flex-col rounded  cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : !item.image ? (
                  <>
                    <i className="bx bx-image-landscape"></i>
                    <h6>NO IMAGE</h6>
                  </>
                ) : (
                  <img
                    className="h-full w-full object-cover"
                    src={`${import.meta.env.VITE_API_URL}/uploads/pinImage/${item.image}`}
                    alt=""
                  />
                )}
              </div>
            </div>
          </div>
          <div className="mb-1">
            <label
              htmlFor="PART NUMBER"
              className="block font-medium text-gray-700"
            >
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
              required={true}
              onChange={(value: string) => handleChange("specs", value)}
              autoComplete={`specs`}
            />
          </div>
          <div className="mb-1">
            <label
              htmlFor="CATEGORY"
              className="block font-medium text-gray-700"
            >
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
              type="text"
              value={formData.unitPrice}
              required={true}
              onChange={(value: string) => handleChange("unitPrice", value)}
              autoComplete={`unitPrice`}
            />
          </div>
          <div className="mb-1">
            <label
              htmlFor="COMPANY"
              className="block font-medium text-gray-700"
            >
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
