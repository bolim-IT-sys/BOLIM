// FOR EDITING USER
import { useEffect, useState } from "react";
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
import Swal from "sweetalert2";

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
    username: "",
    password: "",
    pins: 0,
    it_stocks: 0,
    materials: 0,
    movement: 0,
  });

  // PUTTING USER DETAILS ON CLICK
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      username: user.username,
      password: "",
      pins: user.pins,
      it_stocks: user.it_stocks,
      materials: user.materials,
      movement: user.movement,
    }));
  }, [user]);
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
      if (result.success) {
        setTimeout(
          () => {
            setModalShow(false);
            Swal.fire({
              icon: "success",
              title: `UPDATE SUCCESS`,
              text: result.message,
              timer: 5000,
              showConfirmButton: false,
            }).then(() => { });
            fetchAllUsers();
            fetchUserDetails();
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
              title: "UPDATE FAILED",
              text: result.message,
            }).then(() => {
              setModalShow(true);
              setFormData((prev) => ({
                ...prev,
                username: user.username,
                password: "",
                pins: user.pins,
                it_stocks: user.it_stocks,
                materials: user.materials,
                movement: user.movement,
              }));
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
        title: "UPDATE FAILED",
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

  const NoChanges = () => {
    // If password has input → allow submit
    if (formData.password?.trim() !== "") {
      return false;
    }

    // Disable if username empty
    if (formData.username.trim() === "") {
      return true;
    }

    // Disable if nothing else changed
    return (
      user.username === formData.username &&
      user.pins === formData.pins &&
      user.it_stocks === formData.it_stocks &&
      user.materials === formData.materials &&
      user.movement === formData.movement
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
        size="lg"
        title={
          <>
            <h3 className="text-start">
              EDIT {user.username.toLocaleUpperCase()} DETAILS
            </h3>
          </>
        }
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
            <div className="mb-1">
              <label
                htmlFor="material_admin"
                className="block font-medium text-gray-700"
              >
                <p>EQUIPMENT MOVEMENT:</p>
              </label>
              <select
                className="w-full sm:w-40 no-arrow rounded-lg border border-neutral-300 hover:bg-neutral-200 transition duration-350 cursor-pointer px-2 py-2 focus:bg-neutral-50  focus:ring-1 focus:ring-neutral-300 focus:outline-none"
                id="movement_admin"
                name="movement_admin"
                value={formData.movement}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    movement: Number(e.target.value),
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
