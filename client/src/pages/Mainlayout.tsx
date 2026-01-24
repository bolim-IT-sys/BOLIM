// MAIN LAYOUT OF THE SYSTEM
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
import {
  fetchInventories,
  type Inventory,
} from "../services/Inventory.Service";

export default function Mainlayout() {
  const [user, setUser] = useState<User>();
  const [parts, setParts] = useState<Part[]>([]);
  const [ITStocks, setITStocks] = useState<Part[]>([]);
  const [materials, setMaterials] = useState<Part[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  const [inventories, setInventories] = useState<Inventory[]>([]);

  const [searchParams] = useSearchParams();
  const sort = searchParams.get("sort") || "";
  const order = searchParams.get("order") || "";

  // FOR SIDE AND NAV BAR
  const [showSideBar, setShowSideBar] = useState(() => {
    const stored = localStorage.getItem("showSideBar");
    return stored ? JSON.parse(stored) : false;
  });
  const [collapse, setCollapse] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    // SAVING THE SIDEBAR STATE ON LOCALSTORAGE
    localStorage.setItem("showSideBar", JSON.stringify(showSideBar));
  }, [showSideBar]);

  // FOR VERIFYING AND FETCHING OF USERDATA
  const fetchUserDetails = useCallback(async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        // console.log("No token found...");
        alert("Invalid Session, logging out...");
        navigate("/login");
        return;
      }
      const result = await fetchUserData(token!);
      if (result.success) {
        setUser(result.data);
        // console.log("User details: ", result.data);
      } else {
        // console.log("error occured.");
        alert("Invalid Session, logging out...");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  }, [navigate]);

  const load_inventories = async () => {
    await fetchInventories(setInventories);
  };

  useEffect(() => {
    // LOADS DATA ON RENDER
    const loadData = async () => {
      await fetchUserDetails();
      await load_inventories();
    };

    loadData();
  }, [fetchUserDetails, navigate]);

  useEffect(() => {
    if (!inventories) return;
    // console.log("Inventories fetched: ", inventories);
  }, [inventories]);

  // FETCHING INBOUNDS, OUTBOUNDS, AND INVENTORY ITEMS
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
            sort === "partNumber" && order === "asc" ? "asc" : "desc",
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
          // console.log(`Sorting by stocks and by ${order}`);
          const sorted = sortByStocks(
            partWithInboundOutbound,
            sort === "stocks" && order === "asc" ? "desc" : "asc",
          );

          const pins = sorted.filter((item) => item.type === "pin");
          const it = sorted.filter((item) => item.type === "it");
          const material = sorted.filter((item) => item.type === "material");

          setParts(pins);
          setITStocks(it);
          setMaterials(material);
        } else if (sort === "unitPrice") {
          // console.log(`Sorting by unit price and by ${order}`);
          const sorted = sortByPrice(
            partWithInboundOutbound,
            sort === "unitPrice" && order === "asc" ? "desc" : "asc",
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
            sort === "partNumber" && order === "asc" ? "desc" : "asc",
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
        // console.log("No parts found.");
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
        import.meta.env.VITE_TIME_OUT,
      );
    }
  }, [fetchAllParts]);

  useEffect(() => {
    loadParts();
  }, [loadParts, navigate]);

  return (
    <div className="relative" style={{ height: "100dvh" }}>
      {/* TOP NAVIGATION BAR */}
      <NavBar
        user={user!}
        showSideBar={showSideBar}
        setShowSideBar={setShowSideBar}
        collapse={collapse}
        setCollapse={setCollapse}
      />
      <div className="relative flex justify-start h-dvh w-dvw pt-15 overflow-hidden">
        <div>
          {/* SIDE NAVIGATION BAR */}
          <SideNavBar
            user={user!}
            inventories={inventories}
            showSideBar={showSideBar}
            setShowSideBar={setShowSideBar}
            collapse={collapse}
            setCollapse={setCollapse}
          />
        </div>
        <div className={`w-10/10`}>
          <div className="bg-white h-95/100 my-4 md:my-7 mx-2 md:mx-5 p-5 rounded-sm">
            {/* PASSING USESTATES AND DATA TO THE CHILDREN COMPONENTS TO MAKE IT REUSABLE */}
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
                inventories,
                load_inventories,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
