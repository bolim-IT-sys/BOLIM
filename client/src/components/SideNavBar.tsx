import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Link, useLocation } from "react-router-dom";
import type { User } from "../services/User.Service";

type Props = {
  user: User;
  showSideBar: boolean;
  setShowSideBar: Dispatch<SetStateAction<boolean>>;
};

export default function SideNavBar({
  user,
  showSideBar,
  setShowSideBar,
}: Props) {
  const [isHidden, setIsHidden] = useState(showSideBar);
  const [isShowing, setIsShowing] = useState(showSideBar);
  const location = useLocation();

  const isSuperAdmin = user?.pins && user?.it_stocks && user?.materials;

  useEffect(() => {
    if (showSideBar) {
      setIsHidden(false);
      setTimeout(() => setIsShowing(true), 20);
    } else {
      setIsShowing(false);
      setTimeout(() => setIsHidden(true), 450); // match fade duration
    }
  }, [showSideBar]);
  return (
    <>
      <div
        className={`h-full absolute lg:static bg-sky-600 ${showSideBar ? "w-full md:w-65 left-0 " : "w-20 -left-20"} transition-all duration-400 ease-in-out shadow-md z-30`}
      >
        <div className="flex flex-col justify-start items-start text-neutral-50 gap-1 pt-5.5 mx-3">
          <Link
            className={`relative p-2 flex ${!isHidden ? "justify-start" : "justify-start"} items-center ${location.pathname === "/dashboard" ? "bg-neutral-50 text-neutral-800" : "hover:bg-cyan-400"} transition duration-150 w-full rounded cursor-pointer`}
            to="/dashboard"
          >
            <h3 className="flex justify-center items-center mx-2 my-1">
              <i className="bx bx-chart-bar-big-columns mt-2"></i>
            </h3>
            <h4
              className={`absolute w-45 mt-1 start-12 font-bold ${isShowing ? "opacity-100" : "opacity-0"} ${isHidden ? "pointer-events-none" : ""} transition-all duration-250 ease-in-out`}
            >
              Dashboard
            </h4>
          </Link>
          <Link
            className={`relative p-2 flex ${!isHidden ? "justify-start" : "justify-start"} items-center ${location.pathname === "/stocks/pins" ? "bg-neutral-50 text-neutral-800" : "hover:bg-cyan-400"} transition duration-150 w-full rounded cursor-pointer`}
            to="/stocks/pins"
          >
            <h3 className="flex justify-center items-center mx-2 my-1">
              <i className="bx bx-plug-connect mt-2"></i>
            </h3>
            <h4
              className={`absolute w-45 mt-1 start-12 font-bold ${isShowing ? "opacity-100" : "opacity-0"} ${isHidden ? "pointer-events-none" : ""} transition-all duration-250 ease-in-out`}
            >
              Pins
            </h4>
          </Link>
          <Link
            className={`relative p-2 flex ${!isHidden ? "justify-start" : "justify-start"} items-center ${location.pathname === "/stocks/it-stocks" ? "bg-neutral-50 text-neutral-800" : "hover:hover:bg-cyan-400"} transition duration-150 w-full rounded cursor-pointer`}
            to="/stocks/it-stocks"
          >
            <h3 className="flex justify-center items-center mx-2 my-1">
              <i className="bx bx-computer mt-2"></i>
            </h3>
            <h4
              className={`absolute w-45 mt-1 start-12 font-bold ${isShowing ? "opacity-100" : "opacity-0"} ${isHidden ? "pointer-events-none" : ""} transition-all duration-250 ease-in-out`}
            >
              IT Stocks
            </h4>
          </Link>
          <Link
            className={`relative p-2 flex ${!isHidden ? "justify-start" : "justify-start"} items-center ${location.pathname === "/stocks/meterial-control" ? "bg-neutral-50 text-neutral-800" : "hover:hover:bg-cyan-400"} transition duration-150 w-full rounded cursor-pointer`}
            to="/stocks/meterial-control"
          >
            <h3 className="flex justify-center items-center mx-2 my-1">
              <i className="bx bx-spanner mt-2"></i>
            </h3>
            <h4
              className={`absolute w-45 mt-1 start-12 font-bold ${isShowing ? "opacity-100" : "opacity-0"} ${isHidden ? "pointer-events-none" : ""} transition-all duration-250 ease-in-out`}
            >
              Material Control
            </h4>
          </Link>
          {isSuperAdmin ? (
            <>
              <Link
                className={`relative p-2 flex ${!isHidden ? "justify-start" : "justify-start"} items-center ${location.pathname === "/users" ? "bg-neutral-50 text-neutral-800" : "hover:hover:bg-cyan-400"} transition duration-150 w-full rounded cursor-pointer`}
                to="/users"
              >
                <h3 className="flex justify-center items-center mx-2 my-1">
                  <i className="bx bx-community mt-2"></i>
                </h3>
                <h4
                  className={`absolute w-45 mt-1 start-12 font-bold ${isShowing ? "opacity-100" : "opacity-0"} ${isHidden ? "pointer-events-none" : ""} transition-all duration-250 ease-in-out`}
                >
                  Users
                </h4>
              </Link>
            </>
          ) : null}
        </div>
      </div>
      <div
        className={`${showSideBar ? "opacity-100" : "opacity-0"} ${isHidden ? "hidden" : ""} lg:hidden transition-all duration-400 ease-in-out fixed top-0 left-0 h-dvh w-dvw bg-neutral-900/55`}
        onClick={() => setShowSideBar(false)}
      ></div>
    </>
  );
}
