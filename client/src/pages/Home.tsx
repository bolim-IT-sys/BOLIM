import { useEffect, useState } from "react";
import AdminHomePage from "./AdminPages/HomePage";
import { fetchUserData, type User } from "../services/userService";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [user, setUser] = useState<User>();
  const navigate = useNavigate();

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
          setUser(result.data);
          // console.log(result.data);
        } else {
          console.log("error occured.");
          alert("Invalid Session, logging out...");
          navigate("/login");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserDetails();
  }, [navigate]);

  return (
    <div style={{ height: "100dvh" }}>
      <AdminHomePage user={user!} />
    </div>
  );
}
