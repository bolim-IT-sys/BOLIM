import { useState } from "react";
import InputField from "../../InputField";
import { Modal } from "../../Modal";
import SuccessButton from "../../button/SuccessButton";
import SecondaryButton from "../../button/SecondaryButton";
import PrimaryButton from "../../button/PrimaryButton";
import {
  createInventory,
  type CreateInventory,
} from "../../../services/Inventory.Service";

interface AddingProps {
  load_inventories: () => void;
}

export const AddingInventory = ({ load_inventories }: AddingProps) => {
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [formData, setFormData] = useState<CreateInventory>({
    inventory_name: "",
    item_name: "",
    unique_item: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const result = await createInventory(formData);
      // console.log("creating inventory: ", formData);

      if (result.success) {
        setTimeout(
          () => {
            setIsLoading(false);
            alert("Inventory created successfully!");
            load_inventories();
            setModalShow(false);
          },
          import.meta.env.VITE_TIME_OUT
        );
        // Redirect or update UI
      } else {
        setTimeout(
          () => {
            setIsLoading(false);
            alert(`${result.message}`);
          },
          import.meta.env.VITE_TIME_OUT
        );
      }
    } catch (error) {
      console.error("Unexpecter error occured: ", error);
    }
  };

  return (
    <>
      <PrimaryButton text="ADD INVENTORY" onClick={() => setModalShow(true)} />

      <Modal
        isOpen={modalShow}
        onClose={() => setModalShow(false)}
        title={"CREATE NEW INVENTORY"}
        size="md"
        footer={
          <>
            <div className="h-10 flex gap-2 ">
              <SecondaryButton
                text="CLOSE"
                onClick={() => setModalShow(false)}
              />
              <SuccessButton
                text="ADD INVENTORY"
                loadingText="ADDING INVENTORY"
                onClick={handleSubmit}
                isLoading={isLoading}
                disabled={
                  formData.inventory_name === "" ||
                  formData.item_name === "" ||
                  isLoading
                }
              />
            </div>
          </>
        }
      >
        <div className="mb-1">
          <label
            htmlFor="Inventory Name"
            className="block font-medium text-gray-700"
          >
            <p>INVENTORY NAME</p>
          </label>
          <InputField
            label="Inventory Name"
            type="text"
            value={formData.inventory_name}
            required={true}
            onChange={(value: string) => handleChange("inventory_name", value)}
            autoComplete={`new-inventory`}
          />
        </div>
        <div className="mb-1">
          <label htmlFor="Password" className="block font-medium text-gray-700">
            <p>ITEM NAME</p>
          </label>
          <InputField
            label="Item Name"
            type="text"
            value={formData.item_name}
            required={true}
            onChange={(value: string) => handleChange("item_name", value)}
            autoComplete={`new-item`}
          />
        </div>
        <div className="flex justify-between flex-col sm:flex-row">
          <div className="mb-1">
            <label
              htmlFor="material_admin"
              className="block font-medium text-gray-700"
            >
              <p>REQUIRES UNIQUE ITEM:</p>
            </label>
            <select
              className="w-full sm:w-40 no-arrow rounded-lg border border-neutral-300 hover:bg-neutral-200 transition duration-350 cursor-pointer px-2 py-2 focus:bg-neutral-50  focus:ring-1 focus:ring-neutral-300 focus:outline-none"
              id="material_admin"
              name="material_admin"
              value={formData.unique_item}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  unique_item: Number(e.target.value),
                }))
              }
            >
              <option value={0}>NO</option>
              <option value={1}>YES</option>
            </select>
          </div>
        </div>
      </Modal>
    </>
  );
};
