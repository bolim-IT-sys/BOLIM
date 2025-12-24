import { useState } from "react";
import InputField from "../InputField";
import { Modal } from "../Modal";
import { editStock, type Stock } from "../../services/stockService";
import PrimaryButton from "../button/PrimaryButton";

interface EditingProps {
  fetchAllStocks: () => void;
  stock: Stock;
}

export const EditingStock = ({ fetchAllStocks, stock }: EditingProps) => {
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [formData, setFormData] = useState<Stock>({
    name: stock.name,
    specs: stock.specs,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const id = stock.id;

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const result = await editStock(id!, formData);
      // console.log("creating stock");

      if (result.success) {
        setTimeout(
          () => {
            alert(result.message);
            fetchAllStocks();
            setModalShow(false);
            setFormData({ name: "", specs: "" });
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

  return (
    <>
      <PrimaryButton text={`Edit`} onClick={() => setModalShow(true)} />

      <Modal
        isOpen={modalShow}
        onClose={() => setModalShow(false)}
        size="md"
        title={"Edit stock details"}
        footer={
          <>
            <button
              className={` transition duration-200 ease-in-out ${isLoading ? "cursor-progress" : "bg-emerald-500 hover:bg-emerald-600 cursor-pointer"} disabled:cursor-no-drop disabled:bg-emerald-400 text-neutral-50 w-full rounded py-1`}
              type="submit"
              onClick={handleSubmit}
              disabled={
                isLoading ||
                (stock.name === formData.name && stock.specs === formData.specs)
              }
            >
              <p className="flex justify-center items-center gap-1">
                {isLoading ? (
                  <>
                    <i className="bx bx-loader-circle bx-spin" />
                    Saving
                  </>
                ) : (
                  <>Save Changes</>
                )}
              </p>
            </button>
            <button
              className="bg-neutral-400 hover:bg-neutral-500 transition duration-200 ease-in-out cursor-pointer text-neutral-50 w-full rounded py-1 "
              onClick={() => setModalShow(false)}
            >
              <p>Close</p>
            </button>
          </>
        }
      >
        <div className="mb-3">
          <InputField
            label="Stock name"
            type="text"
            value={formData.name}
            required={true}
            onChange={(value: string) => handleChange("name", value)}
            autoComplete={`name`}
          />
        </div>
        <div className="mb-3">
          <InputField
            label="Specifications"
            type="text"
            value={formData.specs}
            required={true}
            onChange={(value: string) => handleChange("specs", value)}
            autoComplete={`specs`}
          />
        </div>
      </Modal>
    </>
  );
};
