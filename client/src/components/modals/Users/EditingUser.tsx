import { useState } from "react";
import InputField from "../../InputField";
import { Modal } from "../../Modal";
import SuccessButton from "../../button/SuccessButton";
import SecondaryButton from "../../button/SecondaryButton";
import {
  editUser,
  type CreateUserType,
  type User,
} from "../../../services/User.Service";
import { useOutletContext } from "react-router-dom";

interface EditingProps {
  user: User;
  fetchAllUsers: () => void;
}

interface ContextType {
  fetchUserDetails: () => void;
}

export const EditingUser = ({ user, fetchAllUsers }: EditingProps) => {
  const { fetchUserDetails } = useOutletContext<ContextType>();
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [formData, setFormData] = useState<CreateUserType>({
    username: user.username,
    password: "",
    pins: user.pins,
    it_stocks: user.it_stocks,
    materials: user.materials,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const id = user.id;

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!id) return;

      const result = await editUser(id, formData);
      // console.log("creating part");

      if (result.success) {
        setTimeout(
          () => {
            alert(result.message);
            fetchAllUsers();
            fetchUserDetails();
            setModalShow(false);
            setFormData({
              username: formData.username,
              password: "",
              pins: formData.pins,
              it_stocks: formData.it_stocks,
              materials: formData.materials,
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
      formData.username === "" ||
      (user.username === formData.username &&
        user.pins === formData.pins &&
        user.it_stocks === formData.it_stocks &&
        user.materials === formData.materials)
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
        title={`EDIT ${user.username.toLocaleUpperCase()} DETAILS `}
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
            <label
              htmlFor="USERNAME"
              className="block font-medium text-gray-700"
            >
              <p>USERNAME</p>
            </label>
            <InputField
              label="USERNAME"
              type="text"
              value={formData.username}
              required={true}
              onChange={(value: string) => handleChange("username", value)}
              autoComplete={`new-username`}
            />
          </div>
          <div className="mb-1">
            <label
              htmlFor="PASSWORD"
              className="block font-medium text-gray-700"
            >
              <p>PASSWORD</p>
            </label>
            <InputField
              label="PASSWORD"
              type="password"
              value={formData.password}
              required={true}
              onChange={(value: string) => handleChange("password", value)}
              autoComplete={`new-password`}
            />
          </div>
          <div className="flex justify-between">
            <div className="mb-1">
              <label
                htmlFor="pin_admin"
                className="block font-medium text-gray-700"
              >
                <p>PINS:</p>
              </label>
              <select
                className="w-40 no-arrow rounded-lg border border-neutral-300 hover:bg-neutral-200 transition duration-350 cursor-pointer px-2 py-2 focus:bg-neutral-50  focus:ring-1 focus:ring-neutral-300 focus:outline-none"
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
                className="w-40 no-arrow rounded-lg border border-neutral-300 hover:bg-neutral-200 transition duration-350 cursor-pointer px-2 py-2 focus:bg-neutral-50  focus:ring-1 focus:ring-neutral-300 focus:outline-none"
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
                className="w-40 no-arrow rounded-lg border border-neutral-300 hover:bg-neutral-200 transition duration-350 cursor-pointer px-2 py-2 focus:bg-neutral-50  focus:ring-1 focus:ring-neutral-300 focus:outline-none"
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
        </div>
      </Modal>
    </>
  );
};
