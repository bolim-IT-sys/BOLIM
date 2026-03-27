import type { User } from "../services/User.Service";
import { logout } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, DropdownItem } from "./Dropdown";
import DangerButton from "./button/DangerButton";
import logo from "/bolimlogo.png";
import { type Dispatch, type SetStateAction } from "react";
import LightButton from "./button/LightButton";
import LanguageButton from "./button/LanguageButoon";
import { useTranslation } from "react-i18next";

interface NavbarProps {
  user: User;
  fetchAllUsers?: () => void;
  showSideBar: boolean;
  setShowSideBar: Dispatch<SetStateAction<boolean>>;
  collapse: boolean;
  setCollapse: Dispatch<SetStateAction<boolean>>;
}

export default function NavBar({
  user,
  showSideBar,
  setShowSideBar,
  collapse,
  setCollapse,
}: NavbarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const { t } = useTranslation();

  // useEffect(() => {
  //   console.log(`Nav: ${showSideBar}, Side: ${collapse}`);
  // }, [showSideBar, collapse]);

  return (
    <>
      <div
        className="bg-neutral-50 absolute py-3 top-0 shadow-md z-50"
        style={{ width: "100%" }}
      >
        <div className="flex justify-between items-center mx-3">
          <div className="flex justify-center items-center gap-2">
            <div className="size-10 flex justify-center items-center">
              <img className="w-full" src={logo} alt="navLogo" />
            </div>
            <h4 className="hidden sm:block">{t("nav.title")}</h4>
            <div
              className={`size-9 ${showSideBar ? "bg-sky-600 hover:bg-sky-700 text-neutral-50" : "hover:bg-neutral-200"}  rounded transition duration-200 flex justify-center items-center cursor-pointer`}
              onClick={() => {
                setShowSideBar((prev) => !prev);
                setCollapse(showSideBar && !collapse ? true : true);
              }}
            >
              <h3>
                <i className="bx mt-2 bx-menu"></i>
              </h3>
            </div>
          </div>
          <div className="flex gap-2">
            <LanguageButton />
            <Dropdown
              trigger={
                <h4 className="m-0 flex items-center gap-2 mx-2">
                  {user?.username}
                  <i className="bx bx-caret-down"></i>
                </h4>
              }
            >
              <DropdownItem>
                <Link to={`/profile`}>
                  <LightButton
                    text={
                      <>
                        <span className="my-1">{t("nav.acc")}</span>
                      </>
                    }
                  />
                </Link>
              </DropdownItem>
              <DropdownItem>
                <DangerButton
                  text={
                    <>
                      <span className="my-1">{t("nav.logout")}</span>
                    </>
                  }
                  onClick={handleLogout}
                />
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
      </div>
    </>
  );
}
