// FOR ADDING USERS
import { useState } from "react";
import {
  createUser,
  type CreateUserType,
} from "../../../services/User.Service";
import InputField from "../../InputField";
import { Modal } from "../../Modal";
import SuccessButton from "../../button/SuccessButton";
import SecondaryButton from "../../button/SecondaryButton";
import PrimaryButton from "../../button/PrimaryButton";
import Swal from "sweetalert2";

interface AddingProps {
  fetchAllUsers: () => void;
}

export const AddingUser = ({ fetchAllUsers }: AddingProps) => {
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [formData, setFormData] = useState<CreateUserType>({
    username: "",
    password: "",
    pins: 0,
    it_stocks: 0,
    materials: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const result = await createUser(formData);
      // console.log("creating user");

      if (result.success) {
        setTimeout(
          () => {
            setModalShow(false);
            Swal.fire({
              icon: "success",
              title: `ADD SUCCESS`,
              text: result.message,
              timer: 5000,
              showConfirmButton: false,
            }).then(() => {
              fetchAllUsers();
              setFormData((prev) => ({
                ...prev,
                username: "",
                password: "",
                pins: 0,
                it_stocks: 0,
                materials: 0,
              }));
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
      console.error(`Unexpecter error occured: ${error}`);
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

  return (
    <>
      <PrimaryButton text="ADD USER" onClick={() => setModalShow(true)} />

      <Modal
        isOpen={modalShow}
        onClose={() => setModalShow(false)}
        title={
          <>
            <h3 className="text-start">CREATE NEW USER</h3>
          </>
        }
        size="md"
        footer={
          <>
            <div className="h-10 flex gap-2 ">
              <SecondaryButton
                text="CLOSE"
                onClick={() => setModalShow(false)}
              />
              <SuccessButton
                text="ADD USER"
                loadingText="ADDING USER"
                onClick={handleSubmit}
                isLoading={isLoading}
                disabled={
                  formData.username === "" ||
                  formData.password === "" ||
                  isLoading
                }
              />
            </div>
          </>
        }
      >
        <div className="mb-1">
          <label htmlFor="Username" className="block font-medium text-gray-700">
            <p>USERNAME</p>
          </label>
          <InputField
            label="Username"
            type="text"
            value={formData.username}
            required={true}
            onChange={(value: string) => handleChange("username", value)}
            autoComplete={`new-username`}
          />
        </div>
        <div className="mb-1">
          <label htmlFor="Password" className="block font-medium text-gray-700">
            <p>PASSWORD</p>
          </label>
          <InputField
            label="Password"
            type="password"
            value={formData.password}
            required={true}
            onChange={(value: string) => handleChange("password", value)}
            autoComplete={`new-password`}
          />
        </div>
        <div className="flex justify-between flex-col sm:flex-row">
          <div className="mb-1">
            <label
              htmlFor="pin_admin"
              className="block font-medium text-gray-700"
            >
              <p>PINS:</p>
            </label>
            <select
              className="w-full sm:w-40 no-arrow rounded-lg border border-neutral-300 hover:bg-neutral-200 transition duration-350 cursor-pointer px-2 py-2 focus:bg-neutral-50  focus:ring-1 focus:ring-neutral-300 focus:outline-none"
              id="pin_admin"
              name="pin_admin"
              value={formData.pins}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  pins: Number(e.target.value),
                }))
              }
            >
              <option value={0}>NOT ADMIN</option>
              <option value={1}>ADMIN</option>
            </select>
          </div>
          <div className="mb-1">
            <label
              htmlFor="it_admin"
              className="block font-medium text-gray-700"
            >
              <p>IT STOCKS:</p>
            </label>
            <select
              className="w-full sm:w-40 no-arrow rounded-lg border border-neutral-300 hover:bg-neutral-200 transition duration-350 cursor-pointer px-2 py-2 focus:bg-neutral-50  focus:ring-1 focus:ring-neutral-300 focus:outline-none"
              id="it_admin"
              name="it_admin"
              value={formData.it_stocks}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  it_stocks: Number(e.target.value),
                }))
              }
            >
              <option value={0}>NOT ADMIN</option>
              <option value={1}>ADMIN</option>
            </select>
          </div>
          <div className="mb-1">
            <label
              htmlFor="material_admin"
              className="block font-medium text-gray-700"
            >
              <p>MATERIALS:</p>
            </label>
            <select
              className="w-full sm:w-40 no-arrow rounded-lg border border-neutral-300 hover:bg-neutral-200 transition duration-350 cursor-pointer px-2 py-2 focus:bg-neutral-50  focus:ring-1 focus:ring-neutral-300 focus:outline-none"
              id="material_admin"
              name="material_admin"
              value={formData.materials}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  materials: Number(e.target.value),
                }))
              }
            >
              <option value={0}>NOT ADMIN</option>
              <option value={1}>ADMIN</option>
            </select>
          </div>
        </div>
      </Modal>
    </>
  );
};
