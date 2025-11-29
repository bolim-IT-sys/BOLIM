import { Link, useLocation } from "react-router-dom";

export default function SideNavBar() {
  const location = useLocation();
  return (
    <>
      <div className="bg-sky-500 w-3/25 shadow-md">
        <div className="flex flex-col justify-start items-start text-neutral-50 gap-1 mt-5.5 mx-3">
          <Link
            className={`p-2 ${location.pathname === "/dashboard" ? "bg-neutral-50 text-neutral-800" : "hover:bg-cyan-400"} transition duration-150 w-full rounded cursor-pointer`}
            to="/dashboard"
          >
            <h4>Dashboard</h4>
          </Link>
          <Link
            className={`p-2 ${location.pathname === "/stocks/pins" ? "bg-neutral-50 text-neutral-800" : "hover:bg-cyan-400"} transition duration-150 w-full rounded cursor-pointer`}
            to="/stocks/pins"
          >
            <h4>Pins</h4>
          </Link>
          <Link
            className={`p-2  ${location.pathname === "/stocks/it-stocks" ? "bg-neutral-50 text-neutral-800" : "hover:hover:bg-cyan-400"} transition duration-150 w-full rounded cursor-pointer`}
            to="/stocks/it-stocks"
          >
            <h4>IT Stocks</h4>
          </Link>
          <Link
            className={`p-2 ${location.pathname === "/stocks/meterial-control" ? "bg-neutral-50 text-neutral-800" : "hover:hover:bg-cyan-400"} transition duration-150 w-full rounded cursor-pointer`}
            to="/stocks/meterial-control"
          >
            <h4>Material Control</h4>
          </Link>

          <div></div>
        </div>
      </div>
    </>
  );
}
