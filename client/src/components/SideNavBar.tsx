import { Link, useLocation } from "react-router-dom";

type Props = {
  showSideBar: boolean;
};

export default function SideNavBar({ showSideBar }: Props) {
  const location = useLocation();
  return (
    <>
      <div
        className={`bg-sky-500 ${showSideBar ? "w-65" : ""} transition-all duration-200 ease-in-out shadow-md`}
      >
        <div className="flex flex-col justify-start items-start text-neutral-50 gap-1 mt-5.5 mx-3">
          <Link
            className={`p-2 flex items-center ${location.pathname === "/dashboard" ? "bg-neutral-50 text-neutral-800" : "hover:bg-cyan-400"} transition duration-150 w-full rounded cursor-pointer`}
            to="/dashboard"
          >
            <h3 className="flex justify-center items-center">
              <i className="bx bx-chart-bar-big-columns m-2"></i>
            </h3>
            <h4
              className={`font-bold ${showSideBar ? "" : "hidden"} transition-all duration-100 ease-in-out`}
            >
              Dashboard
            </h4>
          </Link>
          <Link
            className={`p-2 flex items-center ${location.pathname === "/stocks/pins" ? "bg-neutral-50 text-neutral-800" : "hover:bg-cyan-400"} transition duration-150 w-full rounded cursor-pointer`}
            to="/stocks/pins"
          >
            <h3>
              <i className="bx bx-plug-connect m-2"></i>
            </h3>
            <h4
              className={`font-bold ${showSideBar ? "" : "hidden"} transition-all duration-100 ease-in-out`}
            >
              Pins
            </h4>
          </Link>
          <Link
            className={`p-2 flex items-center ${location.pathname === "/stocks/it-stocks" ? "bg-neutral-50 text-neutral-800" : "hover:hover:bg-cyan-400"} transition duration-150 w-full rounded cursor-pointer`}
            to="/stocks/it-stocks"
          >
            <h3>
              <i className="bx bx-computer m-2"></i>
            </h3>
            <h4
              className={`font-bold ${showSideBar ? "" : "hidden"} transition-all duration-100 ease-in-out`}
            >
              IT Stocks
            </h4>
          </Link>
          <Link
            className={`p-2 flex items-center ${location.pathname === "/stocks/meterial-control" ? "bg-neutral-50 text-neutral-800" : "hover:hover:bg-cyan-400"} transition duration-150 w-full rounded cursor-pointer`}
            to="/stocks/meterial-control"
          >
            <h3>
              <i className="bx bx-spanner m-2"></i>
            </h3>
            <h4
              className={`font-bold ${showSideBar ? "" : "hidden"} transition-all duration-100 ease-in-out`}
            >
              Material Control
            </h4>
          </Link>

          <div></div>
        </div>
      </div>
    </>
  );
}
