// PROFILE MANAGEMENT PAGE
import { useEffect, useState } from "react";
import InputField from "../../components/InputField";
import {
  editUser,
  type CreateUserType,
  type User,
} from "../../services/User.Service";
import { useOutletContext } from "react-router-dom";
import SuccessButton from "../../components/button/SuccessButton";
import Swal from "sweetalert2";

type ContextType = {
  user: User;
  fetchUserDetails: () => void;
};

export default function Profile() {
  const { user, fetchUserDetails } = useOutletContext<ContextType>();
  const [formData, setFormData] = useState<CreateUserType>({
    username: "",
    password: "",
    pins: 0,
    it_stocks: 0,
    materials: 0,
    movement: 0,
  });
  const [id, setId] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // console.log("USER DATA: ", user);
    if (user) {
      setId(user.id);
      setFormData((prev) => ({
        ...prev,
        username: user.username,
        pins: user.pins,
        it_stocks: user.it_stocks,
        materials: user.materials,
      }));
    }
  }, [user]);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!id) return;

      const result = await editUser(id, formData);
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
            });
            fetchUserDetails();
            setFormData({
              username: formData.username,
              password: "",
              pins: formData.pins,
              it_stocks: formData.it_stocks,
              materials: formData.materials,
              movement: formData.movement,
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
      console.error("Unexpecter error occured: ", error);
      Swal.fire({
        icon: "error",
        title: "UPDATE FAILED",
        text: `Unexpecter error occured: ${error}`,
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

  const NoChanges =
    user?.username === "" ||
    (user?.username === formData.username && formData.password === "");

  return (
    <>
      <div className="h-8/10 flex justify-center items-center flex-col ">
        <div className="w-full md:w-120 mb-1">
          <label htmlFor="USERNAME" className="block font-medium text-gray-700">
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
        <div className="w-full md:w-120 mb-3">
          <label htmlFor="PASSWORD" className="block font-medium text-gray-700">
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
        <div className="h-10 w-full md:w-120 flex">
          <SuccessButton
            text={
              <>
                <span>UPDATE</span>
              </>
            }
            loadingText={
              <>
                <span>UPDATING</span>
              </>
            }
            onClick={handleSubmit}
            disabled={isLoading || NoChanges}
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  );
}
