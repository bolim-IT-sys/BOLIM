import type { Dispatch, SetStateAction } from "react";
import { Link, useLocation } from "react-router-dom";
import type { User } from "../../services/User.Service";
import { useTranslation } from "react-i18next";

type Props = {
  user: User;
  isHidden: boolean;
  isShowing: boolean;
  isSuperAdmin: boolean;
  setShowSideBar: Dispatch<SetStateAction<boolean>>;
};

export const MobileItems = ({
  user,
  isHidden,
  isShowing,
  isSuperAdmin,
  setShowSideBar,
}: Props) => {
  const location = useLocation();
  const { t } = useTranslation()

  return (
    <>
      <div className="flex md:hidden flex-col justify-start items-start text-neutral-50 gap-1 pt-5.5 mx-3">
        <Link
          className={`relative p-2 flex ${!isHidden ? "justify-start" : "justify-start"} items-center ${location.pathname === "/dashboard" ? "bg-neutral-50 text-neutral-800" : "hover:bg-cyan-400"} transition duration-150 w-full rounded cursor-pointer`}
          to="/dashboard"
          onClick={() => setShowSideBar(false)}
        >
          <h3 className="flex justify-center items-center mx-2 my-1">
            <i className="bx bxs-dashboard mt-1"></i>
          </h3>
          <h4
            className={`absolute w-45 mt-1 start-12 font-bold ${isShowing ? "opacity-100" : "opacity-0"} ${isHidden ? "pointer-events-none" : ""} transition-all duration-250 ease-in-out`}
          >
            {t("sNav.dash")}
          </h4>
        </Link>
        {user?.pins ? (
          <Link
            className={`relative p-2 flex ${!isHidden ? "justify-start" : "justify-start"} items-center ${location.pathname === "/stocks/pins" ? "bg-neutral-50 text-neutral-800" : "hover:bg-cyan-400"} transition duration-150 w-full rounded cursor-pointer`}
            to="/stocks/pins"
            onClick={() => setShowSideBar(false)}
          >
            <h3 className="flex justify-center items-center mx-2 my-1">
              <i className="bx bx-usb mt-1"></i>
            </h3>
            <h4
              className={`absolute w-45 mt-1 start-12 font-bold ${isShowing ? "opacity-100" : "opacity-0"} ${isHidden ? "pointer-events-none" : ""} transition-all duration-250 ease-in-out`}
            >
              {t("sNav.pins")}
            </h4>
          </Link>
        ) : null}
        {user?.it_stocks ? (
          <Link
            className={`relative p-2 flex ${!isHidden ? "justify-start" : "justify-start"} items-center ${location.pathname === "/stocks/it-stocks" ? "bg-neutral-50 text-neutral-800" : "hover:hover:bg-cyan-400"} transition duration-150 w-full rounded cursor-pointer`}
            to="/stocks/it-stocks"
            onClick={() => setShowSideBar(false)}
          >
            <h3 className="flex justify-center items-center mx-2 my-1">
              <i className="bx bx-desktop mt-1"></i>
            </h3>
            <h4
              className={`absolute w-45 mt-1 start-12 font-bold ${isShowing ? "opacity-100" : "opacity-0"} ${isHidden ? "pointer-events-none" : ""} transition-all duration-250 ease-in-out`}
            >
              {t("sNav.it")}
            </h4>
          </Link>
        ) : null}
        {user?.materials ? (
          <Link
            className={`relative p-2 flex ${!isHidden ? "justify-start" : "justify-start"} items-center ${location.pathname === "/stocks/material-control" ? "bg-neutral-50 text-neutral-800" : "hover:hover:bg-cyan-400"} transition duration-150 w-full rounded cursor-pointer`}
            to="/stocks/material-control"
            onClick={() => setShowSideBar(false)}
          >
            <h3 className="flex justify-center items-center mx-2 my-1">
              <i className="bx bxs-wrench mt-1"></i>
            </h3>
            <h4
              className={`absolute w-45 mt-1 start-12 font-bold ${isShowing ? "opacity-100" : "opacity-0"} ${isHidden ? "pointer-events-none" : ""} transition-all duration-250 ease-in-out`}
            >
              {t("sNav.material")}
            </h4>
          </Link>
        ) : null}
        {user?.movement ? (
          <Link
            className={`relative p-2 flex ${!isHidden ? "justify-start" : "justify-start"} items-center ${location.pathname === "/stocks/equipment-movement" ? "bg-neutral-50 text-neutral-800" : "hover:hover:bg-cyan-400"} transition duration-150 w-full rounded cursor-pointer`}
            to="/stocks/equipment-movement"
            onClick={() => setShowSideBar(false)}
          >
            <h3 className="flex justify-center items-center mx-2 my-1">
              <i className="bx bx-transfer mt-1"></i>
            </h3>
            <h4
              className={`absolute w-45 mt-1 start-12 font-bold ${isShowing ? "opacity-100" : "opacity-0"} ${isHidden ? "pointer-events-none" : ""} transition-all duration-250 ease-in-out`}
            >
              {t("Equipment Movement")}
            </h4>
          </Link>
        ) : null}

        {isSuperAdmin ? (
          <>
            <Link
              className={`relative p-2 flex ${!isHidden ? "justify-start" : "justify-start"} items-center ${location.pathname === "/users" ? "bg-neutral-50 text-neutral-800" : "hover:hover:bg-cyan-400"} transition duration-150 w-full rounded cursor-pointer`}
              to="/users"
              onClick={() => setShowSideBar(false)}
            >
              <h3 className="flex justify-center items-center mx-2 my-1">
                <i className="bx bxs-group mt-1"></i>
              </h3>
              <h4
                className={`absolute w-45 mt-1 start-12 font-bold ${isShowing ? "opacity-100" : "opacity-0"} ${isHidden ? "pointer-events-none" : ""} transition-all duration-250 ease-in-out`}
              >
                {t("sNav.user")}
              </h4>
            </Link>
          </>
        ) : null}
      </div>
    </>
  );
};
