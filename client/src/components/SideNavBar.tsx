import type { User } from "../services/userService";

interface SideNavbarProps {
  user?: User;
}

export default function SideNavBar({ user }: SideNavbarProps) {
  return (
    <>
      <div className="bg-neutral-50 w-100 shadow-md">
        <div className="flex flex-col justify-start items-start gap-1 mt-5.5 mx-3">
          <h4 className="p-2 hover:bg-neutral-300 transition duration-150 w-full rounded cursor-pointer">
            Home
          </h4>
          {user?.isAdmin ? (
            <>
              <h4 className="p-2 hover:bg-neutral-300 transition duration-150 w-full rounded cursor-pointer">
                Dashbaord
              </h4>
            </>
          ) : null}

          <h4 className="p-2 hover:bg-neutral-300 transition duration-150 w-full rounded cursor-pointer">
            Settngs
          </h4>
          <h4 className="p-2 hover:bg-neutral-300 transition duration-150 w-full rounded cursor-pointer">
            Help / Support
          </h4>
          <div></div>
        </div>
      </div>
    </>
  );
}
