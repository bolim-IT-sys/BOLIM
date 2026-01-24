import { useState } from "react";
import InputField from "../../InputField";
import { Modal } from "../../Modal";
import SuccessButton from "../../button/SuccessButton";
import SecondaryButton from "../../button/SecondaryButton";
import {
  editInventory,
  type CreateInventory,
  type Inventory,
} from "../../../services/Inventory.Service";

interface EditingProps {
  inventory: Inventory;
  load_inventories: () => void;
}

export const EditingInventory = ({
  inventory,
  load_inventories,
}: EditingProps) => {
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [formData, setFormData] = useState<CreateInventory>({
    inventory_name: inventory.inventory_name,
    item_name: inventory.item_name,
    unique_item: inventory.unique_item,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const id = inventory.id;

  const handleSubmit = async () => {
    if (!id) return;
    await editInventory(
      id,
      formData,
      setIsLoading,
      load_inventories,
      setModalShow,
      setFormData,
    );
  };

  // CHECKING IF THE FORM IS COMPLETED
  const NoChanges = () => {
    // Disable if inventory_name empty
    if (formData.inventory_name.trim() === "") {
      return true;
    }

    // Disable if item_name empty
    if (formData.item_name.trim() === "") {
      return true;
    }

    // Disable if nothing else changed
    return (
      inventory.inventory_name === formData.inventory_name &&
      inventory.item_name === formData.item_name &&
      inventory.unique_item === formData.unique_item
    );
  };

  return (
    <>
      <SuccessButton
        text={
          <>
            <i className="bx bxs-edit"></i> EDIT
          </>
        }
        onClick={() => setModalShow(true)}
      />

      <Modal
        isOpen={modalShow}
        onClose={() => setModalShow(false)}
        size="md"
        title={`EDIT ${inventory.inventory_name.toLocaleUpperCase()} DETAILS `}
        footer={
          <>
            <div className="h-10 flex gap-2 ">
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
            <label
              htmlFor="INVENTORY NAME"
              className="block font-medium text-gray-700"
            >
              <p>INVENTORY NAME</p>
            </label>
            <InputField
              label="INVENTORY NAME"
              type="text"
              value={formData.inventory_name}
              required={true}
              onChange={(value: string) =>
                handleChange("inventory_name", value)
              }
              autoComplete={`new-inventory-name`}
            />
          </div>
          <div className="mb-1">
            <label
              htmlFor="ITEM NAME"
              className="block font-medium text-gray-700"
            >
              <p>ITEM NAME</p>
            </label>
            <InputField
              label="ITEM NAME"
              type="text"
              value={formData.item_name}
              required={true}
              onChange={(value: string) => handleChange("item_name", value)}
              autoComplete={`new-item-name`}
            />
          </div>

          <div className="flex justify-between flex-col sm:flex-row">
            <div className="mb-1">
              <label
                htmlFor="Unique_item"
                className="block font-medium text-gray-700"
              >
                <p>REQUIRES UNIQUE ITEM:</p>
              </label>
              <select
                className="w-full sm:w-40 no-arrow rounded-lg border border-neutral-300 hover:bg-neutral-200 transition duration-350 cursor-pointer px-2 py-2 focus:bg-neutral-50  focus:ring-1 focus:ring-neutral-300 focus:outline-none"
                id="unique_item"
                name="unique_item"
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
        </div>
      </Modal>
    </>
  );
};
