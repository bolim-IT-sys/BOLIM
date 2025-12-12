import { useCallback, useEffect, useState } from "react";
import { fetchUserData, type User } from "../services/User.Service";
import { useNavigate, Outlet, useSearchParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import SideNavBar from "../components/SideNavBar";
import {
  fetchAllInbounds,
  fetchAllOutbounds,
} from "../services/InboundOutbound.Service";
import { fetchParts, type Part } from "../services/Part.Service";
import {
  sortByPartNumber,
  sortByPrice,
  sortByStocks,
} from "../helper/sorting.helper";

export default function Mainlayout() {
  const [user, setUser] = useState<User>();
  const [parts, setParts] = useState<Part[]>([]);
  const [ITStocks, setITStocks] = useState<Part[]>([]);
  const [materials, setMaterials] = useState<Part[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  const [searchParams] = useSearchParams();
  const sort = searchParams.get("sort") || "";
  const order = searchParams.get("order") || "";

  const [showSideBar, setShowSideBar] = useState(true);

  const navigate = useNavigate();

  const fetchUserDetails = useCallback(async () => {
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
        // console.log("User details: ", result.data);
      } else {
        console.log("error occured.");
        alert("Invalid Session, logging out...");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails, navigate]);

  const fetchAllParts = useCallback(async () => {
    try {
      // setIsFetching(true);
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

        if (sort === "partNumber") {
          // console.log(`Sorting by part number and by ${order}`);
          const sorted = sortByPartNumber(
            partWithInboundOutbound,
            sort === "partNumber" && order === "asc" ? "asc" : "desc"
          );

          const pins = sorted.filter((item) => item.type === "pin");
          const it = sorted.filter((item) => item.type === "it");
          const material = sorted.filter((item) => item.type === "material");

          setParts(pins);
          setITStocks(it);
          setMaterials(material);
          // console.log(
          //   "Fetch IT and Material stocks: ",
          //   `${ITStocks}, ${materials}`
          // );
        } else if (sort === "stocks") {
          console.log(`Sorting by stocks and by ${order}`);
          const sorted = sortByStocks(
            partWithInboundOutbound,
            sort === "stocks" && order === "asc" ? "desc" : "asc"
          );

          const pins = sorted.filter((item) => item.type === "pin");
          const it = sorted.filter((item) => item.type === "it");
          const material = sorted.filter((item) => item.type === "material");

          setParts(pins);
          setITStocks(it);
          setMaterials(material);
        } else if (sort === "unitPrice") {
          console.log(`Sorting by unit price and by ${order}`);
          const sorted = sortByPrice(
            partWithInboundOutbound,
            sort === "unitPrice" && order === "asc" ? "desc" : "asc"
          );

          const pins = sorted.filter((item) => item.type === "pin");
          const it = sorted.filter((item) => item.type === "it");
          const material = sorted.filter((item) => item.type === "material");

          setParts(pins);
          setITStocks(it);
          setMaterials(material);
        } else {
          // console.log(`Sorting by part number and by ${order}`);
          const sorted = sortByPartNumber(
            partWithInboundOutbound,
            sort === "partNumber" && order === "asc" ? "desc" : "asc"
          );

          const pins = sorted.filter((item) => item.type === "pin");
          const it = sorted.filter((item) => item.type === "it");
          const material = sorted.filter((item) => item.type === "material");

          setParts(pins);
          setITStocks(it);
          setMaterials(material);
          // console.log("IT: ", it);
          // console.log("Material: ", material);
        }

        // console.log(
        //   "Fetched Parts with inbounds and outbounds: ",
        //   partWithInboundOutbound
        // );
      } else {
        console.log("No parts found.");
        setParts([]);
      }
    } catch (err) {
      console.log("Unexpected error occured: ", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadParts = useCallback(async () => {
    // console.log("fetching parts");
    try {
      setIsFetching(true);
      await fetchAllParts();
    } finally {
      setTimeout(
        () => {
          setIsFetching(false);
        },
        import.meta.env.VITE_TIME_OUT
      );
    }
  }, [fetchAllParts]);

  useEffect(() => {
    loadParts();
  }, [loadParts, navigate]);

  return (
    <div className="relative" style={{ height: "100dvh" }}>
      <NavBar
        user={user!}
        showSideBar={showSideBar}
        setShowSideBar={setShowSideBar}
      />
      <div className="flex justify-start h-dvh w-dvw pt-15 overflow-hidden">
        <div>
          <SideNavBar user={user!} showSideBar={showSideBar} />
        </div>
        <div className={`w-10/10`}>
          <div className="bg-white h-95/100 my-7 mx-5 p-5 rounded-sm">
            <Outlet
              context={{
                fetchUserDetails,
                user,
                parts,
                setParts,
                ITStocks,
                setITStocks,
                materials,
                setMaterials,
                fetchAllParts,
                isFetching,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
