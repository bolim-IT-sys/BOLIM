import { AddingUser } from "./modals/Users/AddingUser";
import type { User } from "../services/userService";
import { logout } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Dropdown, DropdownItem } from "./Dropdown";
import DangerButton from "./button/DangerButton";

interface NavbarProps {
  user: User;
  fetchAllUsers?: () => void;
}

export default function NavBar({ user, fetchAllUsers }: NavbarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <div
        className="bg-neutral-50 absolute py-3 top-0 shadow-md"
        style={{ width: "100%" }}
      >
        <div className="flex justify-between items-center mx-3">
          <h4 className="">BOLIM(SPARE PARTS)</h4>
          <div>
            <Dropdown
              trigger={
                <h4 className="m-0 flex items-center gap-2 mx-2">
                  {user?.username}
                  <i className="bx bx-caret-down"></i>
                </h4>
              }
            >
              <DropdownItem>
                <AddingUser fetchAllUsers={fetchAllUsers!} />
              </DropdownItem>
              <DropdownItem>
                <DangerButton text="Logout" onClick={handleLogout} />
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
      </div>
    </>
  );
}
