import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import InputField from "../components/InputField";
import { fetchUserData } from "../services/User.Service";
import PrimaryButton from "../components/button/PrimaryButton";
import logo from "/logowithtext.png";
import background from "/bolim_image.png";
import Swal from "sweetalert2";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // CHECKING IF THE USER IS LOGGED IN
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          // console.log("No token found...");
          return;
        }
        const result = await fetchUserData(token);
        if (result.success) {
          navigate("/dashboard");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserDetails();
  }, [navigate]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const result = await login(formData);

      if (result.success) {
        setTimeout(
          () => {
            Swal.fire({
              icon: "success",
              title: "Login Successful",
              text: "You have logged in successfully.",
              timer: 1500,
              showConfirmButton: false,
            }).then(() => {
              navigate("/dashboard");
            });
          },
          import.meta.env.VITE_TIME_OUT,
        );
      } else {
        setTimeout(
          () => {
            Swal.fire({
              icon: "error",
              title: "Login Failed",
              text: "Invalid credentials.",
            });
          },
          import.meta.env.VITE_TIME_OUT,
        );
      }
    } catch (error) {
      console.error("Unexpected error occurred: ", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again later.",
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
    <div className="flex items-center justify-center h-dvh">
      <div className="absolute h-10/10 w-10/10">
        <img className="w-full h-full object-cover" src={background} alt="" />
      </div>
      <div className=" w-100 mx-5 bg-white p-6 rounded-xl shadow z-10">
        <div className="w-full flex justify-center">
          <div className="w-2/10">
            <img className="w-full" src={logo} alt="" />
          </div>
        </div>
        <h2 className="h4 text-center mb-4">
          <b>SPARE INVENTORY</b>
        </h2>
        <div className="mb-3">
          <InputField
            label="Username"
            type="text"
            value={formData.username}
            required={true}
            onChange={(value: string) => handleChange("username", value)}
            autoComplete={`username`}
            onKeyPress={handleSubmit}
          />
        </div>
        <div className="mb-3">
          <InputField
            label="Password"
            type="password"
            value={formData.password}
            required={true}
            onChange={(value: string) => handleChange("password", value)}
            autoComplete={`current-password`}
            onKeyPress={handleSubmit}
          />
        </div>
        <div className="h-10">
          <PrimaryButton
            text={
              <>
                <span className="my-1.5">Log in</span>
              </>
            }
            loadingText={
              <>
                <span className="my-1.5">Loging in</span>
              </>
            }
            onClick={handleSubmit}
            disabled={
              formData.username === "" || formData.password === "" || isLoading
            }
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
