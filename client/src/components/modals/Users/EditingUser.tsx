import { useState } from "react";
import { type UserAuth } from "../../../services/authService";
import InputField from "../../InputField";
import { Modal } from "../../Modal";
import { editUser, type User } from "../../../services/userService";
import PrimaryButton from "../../button/PrimaryButton";

interface EditingProps {
  fetchAllUsers: () => void;
  user: User;
}

export const EditingUser = ({ fetchAllUsers, user }: EditingProps) => {
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [formData, setFormData] = useState<UserAuth>({
    username: user.username,
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const id = user.id;

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const result = await editUser(id, formData);
      // console.log("creating user");

      if (result.success) {
        setTimeout(() => {
          setIsLoading(false);
          alert(result.message);
          fetchAllUsers();
          setModalShow(false);
        }, 1500);
        // Redirect or update UI
      } else {
        setTimeout(() => {
          setIsLoading(false);
          alert(`${result.message}`);
        }, 1500);
      }
    } catch (error) {
      console.error("Unexpecter error occured: ", error);
    }
  };

  return (
    <>
      <PrimaryButton text={"Edit"} onClick={() => setModalShow(true)} />

      <Modal
        isOpen={modalShow}
        onClose={() => setModalShow(false)}
        size="md"
        title={"Edit user details"}
        footer={
          <>
            <button
              className={` transition duration-200 ease-in-out ${isLoading ? "cursor-progress" : "bg-emerald-500 hover:bg-emerald-600 cursor-pointer"} disabled:cursor-no-drop disabled:bg-emerald-400 text-neutral-50 w-full rounded py-1`}
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading || user.username === formData.username}
            >
              <p className="flex justify-center items-center gap-1">
                {isLoading ? (
                  <>
                    <i className="bx bx-loader-dots bx-spin" />
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
            label="Username"
            type="text"
            value={formData.username}
            required={true}
            onChange={(value: string) => handleChange("username", value)}
            autoComplete={`username`}
          />
        </div>
        <div className="mb-3">
          <InputField
            label="Password"
            type="password"
            value={formData.password}
            required={true}
            onChange={(value: string) => handleChange("password", value)}
            autoComplete={`username`}
          />
        </div>
      </Modal>
    </>
  );
};
