import { Link } from "react-router-dom";

export default function SideNavBar() {
  return (
    <>
      <div className="bg-neutral-50 w-100 shadow-md">
        <div className="flex flex-col justify-start items-start gap-1 mt-5.5 mx-3">
          <Link
            className="p-2 hover:bg-neutral-300 transition duration-150 w-full rounded cursor-pointer"
            to="/dashboard"
          >
            <h4>Dashbaord</h4>
          </Link>
          <Link
            className="p-2 hover:bg-neutral-300 transition duration-150 w-full rounded cursor-pointer"
            to="/home"
          >
            <h4>Home</h4>
          </Link>

          <div></div>
        </div>
      </div>
    </>
  );
}
