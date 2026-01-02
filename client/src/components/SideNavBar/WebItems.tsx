import { Link, useLocation } from "react-router-dom";
import type { User } from "../../services/User.Service";
import { SideNavBarToolTip } from "./SideNavBarToolTip";

type Props = {
  user: User;
  isHidden: boolean;
  isShowing: boolean;
  isSuperAdmin: boolean;
};

export const WebItems = ({
  user,
  isHidden,
  isShowing,
  isSuperAdmin,
}: Props) => {
  const location = useLocation();

  return (
    <>
      <div className="hidden md:flex flex-col justify-start items-start text-neutral-50 gap-1 pt-5.5 mx-3">
        <Link
          className={`group relative p-2 flex items-center ${location.pathname === "/dashboard" ? "bg-neutral-50 text-neutral-800" : "hover:bg-cyan-400"} transition duration-150 w-full rounded cursor-pointer`}
          to="/dashboard"
        >
          <h3 className="flex justify-center items-center mx-2 my-1">
            <i className="bx bxs-dashboard mt-1 ms-0.5"></i>
          </h3>
          <SideNavBarToolTip isHidden={isHidden} toolTipName={"Dashboard"} />
          <h4
            className={`absolute w-45 mt-1 start-12 font-bold ${isShowing ? "opacity-100" : "opacity-0"} ${isHidden ? "pointer-events-none" : ""} transition-all duration-250 ease-in-out`}
          >
            Dashboard
          </h4>
        </Link>
        {user?.pins ? (
          <Link
            className={`group relative p-2 flex items-center ${location.pathname === "/stocks/pins" ? "bg-neutral-50 text-neutral-800" : "hover:bg-cyan-400"} transition duration-150 w-full rounded cursor-pointer`}
            to="/stocks/pins"
          >
            <h3 className="flex justify-center items-center mx-2 my-1">
              <i className="bx bx-usb mt-1 ms-0.5"></i>
            </h3>
            <SideNavBarToolTip isHidden={isHidden} toolTipName={"Pins"} />
            <h4
              className={`absolute w-45 mt-1 start-12 font-bold ${isShowing ? "opacity-100" : "opacity-0"} ${isHidden ? "pointer-events-none" : ""} transition-all duration-250 ease-in-out`}
            >
              Pins
            </h4>
          </Link>
        ) : null}
        {user?.it_stocks ? (
          <Link
            className={`group relative p-2 flex items-center ${location.pathname === "/stocks/it-stocks" ? "bg-neutral-50 text-neutral-800" : "hover:hover:bg-cyan-400"} transition duration-150 w-full rounded cursor-pointer`}
            to="/stocks/it-stocks"
          >
            <h3 className="flex justify-center items-center mx-2 my-1">
              <i className="bx bx-desktop mt-1 ms-0.5"></i>
            </h3>
            <SideNavBarToolTip isHidden={isHidden} toolTipName={"IT Stocks"} />
            <h4
              className={`absolute w-45 mt-1 start-12 font-bold ${isShowing ? "opacity-100" : "opacity-0"} ${isHidden ? "pointer-events-none" : ""} transition-all duration-250 ease-in-out`}
            >
              IT Stocks
            </h4>
          </Link>
        ) : null}
        {user?.materials ? (
          <Link
            className={`group relative p-2 flex items-center ${location.pathname === "/stocks/material-control" ? "bg-neutral-50 text-neutral-800" : "hover:hover:bg-cyan-400"} transition duration-150 w-full rounded cursor-pointer`}
            to="/stocks/material-control"
          >
            <h3 className="flex justify-center items-center mx-2 my-1">
              <i className="bx bxs-wrench mt-1 ms-0.5"></i>
            </h3>
            <SideNavBarToolTip
              isHidden={isHidden}
              toolTipName={"Material Control"}
            />
            <h4
              className={`absolute w-45 mt-1 start-12 font-bold ${isShowing ? "opacity-100" : "opacity-0"} ${isHidden ? "pointer-events-none" : ""} transition-all duration-250 ease-in-out`}
            >
              Material Control
            </h4>
          </Link>
        ) : null}

        {isSuperAdmin ? (
          <>
            <Link
              className={`group relative p-2 flex items-center ${location.pathname === "/users" ? "bg-neutral-50 text-neutral-800" : "hover:hover:bg-cyan-400"} transition duration-150 w-full rounded cursor-pointer`}
              to="/users"
            >
              <h3 className="flex justify-center items-center mx-2 my-1">
                <i className="bx bxs-group mt-1 ms-0.5"></i>
              </h3>
              <SideNavBarToolTip isHidden={isHidden} toolTipName={"Users"} />
              <h4
                className={`absolute w-45 mt-1 start-12 font-bold ${isShowing ? "opacity-100" : "opacity-0"} ${isHidden ? "pointer-events-none" : ""} transition-all duration-250 ease-in-out`}
              >
                Users
              </h4>
            </Link>
          </>
        ) : null}
      </div>
    </>
  );
};
