import { useEffect, useState } from "react";
import { fetchUserData, type User } from "../services/userService";
import { useNavigate, Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import SideNavBar from "../components/SideNavBar";
import {
  fetchAllInbounds,
  fetchAllOutbounds,
} from "../services/InboundOutbound.Service";
import { fetchParts, type Part } from "../services/Part.Service";

export default function Mainlayout() {
  const [user, setUser] = useState<User>();
  const [parts, setParts] = useState<Part[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          console.log("No token found...");
          alert("Invalid Session, logging out...");
          navigate("/login");
          return;
        }
        const result = await fetchUserData(token!);
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

  const fetchAllParts = async () => {
    try {
      setIsFetching(true);
      const [inResult, outResult, result] = await Promise.all([
        fetchAllInbounds(),
        fetchAllOutbounds(),
        fetchParts(),
      ]);

      if (result.success) {
        const inbounds = inResult.success ? inResult.data : [];
        const outbounds = outResult.success ? outResult.data : [];

        // GETTING PART INBOUNDS AND OUTBOUNDS
        const partWithInboundOutbound = result.data!.map((part) => ({
          ...part,
          inbounds:
            inbounds?.filter((inbound) => inbound.partId === part.id) || [],
          outbounds:
            outbounds?.filter((outbound) => outbound.partId === part.id) || [],
        }));

        setParts(partWithInboundOutbound);
        console.log("Fetched Parts: ", partWithInboundOutbound);
      } else {
        console.log("No parts found.");
        setParts([]);
      }
    } catch (err) {
      console.log("Unexpected error occured: ", err);
    } finally {
      setTimeout(() => {
        setIsFetching(false);
      }, 2000);
    }
  };

  useEffect(() => {
    fetchAllParts();
  }, []);

  return (
    <div className="flex justify-center relative" style={{ height: "100dvh" }}>
      <NavBar user={user!} />
      <div className="flex justify-start w-dvw pt-15 ">
        <SideNavBar />
        <div className="h-full w-9/10 ">
          <div className="bg-neutral-50 h-95/100 my-7 mx-5 p-5 rounded-sm">
            <Outlet
              context={{ user, parts, setParts, fetchAllParts, isFetching }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
