import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import InputField from "../components/InputField";
import { fetchUserData } from "../services/userService";
import PrimaryButton from "../components/button/PrimaryButton";

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
          navigate("/home");
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
        setTimeout(() => {
          navigate("/home");
          alert("Loggin Success");
        }, 1500);
      } else {
        setTimeout(() => {
          alert("Invalid credentials");
        }, 1500);
      }
    } catch (error) {
      console.error("Unexpected error occured: ", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  };

  return (
    <div className="flex items-center justify-center h-dvh">
      <div
        className="bg-white p-4 rounded shadow w-100"
        style={{ maxWidth: "400px" }}
      >
        <h2 className="h4 text-center mb-4">Login</h2>
        <div className="mb-3">
          <InputField
            label="Username"
            type="text"
            value={formData.username}
            required={true}
            onChange={(value: string) => handleChange("username", value)}
          />
        </div>
        <div className="mb-3">
          <InputField
            label="Password"
            type="password"
            value={formData.password}
            required={true}
            onChange={(value: string) => handleChange("password", value)}
          />
        </div>
        <PrimaryButton
          text={"Log in"}
          loadingText={"Loging in"}
          onClick={handleSubmit}
          disabled={
            formData.username === "" || formData.password === "" || isLoading
          }
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
