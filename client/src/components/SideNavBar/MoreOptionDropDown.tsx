import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { SideNavBarToolTip } from "./SideNavBarToolTip";
import { Link } from "react-router-dom";
import type { Inventory } from "../../services/Inventory.Service";

type Props = {
  inventories: Inventory[];
  isHidden: boolean;
  isShowing: boolean;
  setShowSideBar: Dispatch<SetStateAction<boolean>>;
  collapse: boolean;
  setCollapse: Dispatch<SetStateAction<boolean>>;
};
export const MoreOptionDropDown = ({
  inventories,
  isHidden,
  isShowing,
  setShowSideBar,
  collapse,
  setCollapse,
}: Props) => {
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!collapse) {
      setShowDropdown(true);
      //   console.log("showing...");
    } else {
      //   console.log("hiding...");
      setTimeout(() => {
        setShowDropdown(false);
        // console.log("hidden.");
      }, 250);
    }
  }, [collapse]);
  return (
    <div className="group w-full">
      <div
        className={`relative w-full p-2 flex items-center ${location.pathname === "" ? "bg-neutral-50 text-neutral-800" : "hover:hover:bg-cyan-400"} transition duration-150 w-full rounded cursor-pointer`}
        onClick={() => {
          setShowSideBar(true);
          setCollapse((prev: boolean) => !prev);
        }}
      >
        <h3 className="flex justify-center items-center mx-2 my-1">
          <i className="bx bxs-down-arrow mt-1 ms-0.5"></i>
        </h3>
        <SideNavBarToolTip isHidden={isHidden} toolTipName={"More Options"} />
        <h4
          className={`absolute w-65 mt-1 start-12 font-bold ${isShowing ? "opacity-100" : "opacity-0"} ${isHidden ? "pointer-events-none" : ""} transition-all duration-250 ease-in-out`}
        >
          More Options
        </h4>
      </div>
      {/* SIDE BAR DROPDOWN ITEMS */}
      <div
        className={`${showDropdown ? "overflow-y-scroll" : "overflow-hidden"} overflow-x-hidden custom_scroll ${collapse ? "h-0" : "h-50"}  transition-all duration-500 ease-in-out p  t-2`}
      >
        {inventories.map((inventory, index) => (
          <Link
            key={index}
            className={` relative p-2 flex items-center ${location.pathname === "" ? "bg-neutral-50 text-neutral-800" : "hover:hover:bg-cyan-400"} transition duration-150 w-full rounded cursor-pointer`}
            to={`/stocks/${inventory.inventory_name}`}
          >
            <h3 className="flex justify-center items-center mx-2 my-1">
              <i className="bx bxs-chevron-right mt-1 ms-0.5"></i>
            </h3>
            <h4
              className={`absolute w-65 mt-1 start-12 font-bold ${isShowing ? "opacity-100" : "opacity-0"} ${isHidden ? "pointer-events-none" : ""} transition-all duration-250 ease-in-out`}
            >
              {inventory.inventory_name}
            </h4>
          </Link>
        ))}
      </div>
    </div>
  );
};
