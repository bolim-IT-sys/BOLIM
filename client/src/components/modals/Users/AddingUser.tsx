import { useState } from "react";
import { type UserAuth } from "../../../services/authService";
import { createUser } from "../../../services/userService";
import InputField from "../../InputField";
import { Modal } from "../../Modal";
import LightButton from "../../button/LightButton";
import SuccessButton from "../../button/SuccessButton";
import SecondaryButton from "../../button/SecondaryButton";

interface AddingProps {
  fetchAllUsers: () => void;
}

export const AddingUser = ({ fetchAllUsers }: AddingProps) => {
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [formData, setFormData] = useState<UserAuth>({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const result = await createUser(formData);
      console.log("creating user");

      if (result.success) {
        setTimeout(
          () => {
            setIsLoading(false);
            alert("User created successfully!");
            fetchAllUsers();
            setModalShow(false);
          },
          import.meta.env.VITE_TIME_OUT
        );
        // Redirect or update UI
      } else {
        setTimeout(
          () => {
            setIsLoading(false);
            alert(`Error: ${result.message}`);
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
      <LightButton text="Add user" onClick={() => setModalShow(true)} />

      <Modal
        isOpen={modalShow}
        onClose={() => setModalShow(false)}
        title={"CREATE NEW USER"}
        size="md"
        footer={
          <>
            <SuccessButton
              text="ADD USER"
              loadingText="ADDING USER"
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={isLoading}
            />
            <SecondaryButton text="CLOSE" onClick={() => setModalShow(false)} />
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
