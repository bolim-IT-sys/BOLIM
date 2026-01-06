import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { User } from "../services/User.Service";
import { WebItems } from "./SideNavBar/WebItems";
import { MobileItems } from "./SideNavBar/MobileItems";
import type { Inventory } from "../services/Inventory.Service";

type Props = {
  user: User;
  inventories: Inventory[];
  showSideBar: boolean;
  setShowSideBar: Dispatch<SetStateAction<boolean>>;
  collapse: boolean;
  setCollapse: Dispatch<SetStateAction<boolean>>;
};

export default function SideNavBar({
  user,
  inventories,
  showSideBar,
  setShowSideBar,
  collapse,
  setCollapse,
}: Props) {
  const [isHidden, setIsHidden] = useState(showSideBar);
  const [isShowing, setIsShowing] = useState(showSideBar);

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
        className={`h-full absolute lg:static bg-sky-600 ${showSideBar ? "w-full md:w-70 left-0 " : "w-20 -left-20"} transition-all duration-400 ease-in-out shadow-md z-30`}
      >
        <WebItems
          user={user}
          inventories={inventories}
          isHidden={isHidden}
          isShowing={isShowing}
          isSuperAdmin={Boolean(isSuperAdmin)}
          setShowSideBar={setShowSideBar}
          collapse={collapse}
          setCollapse={setCollapse}
        />
        <MobileItems
          user={user}
          isHidden={isHidden}
          isShowing={isShowing}
          isSuperAdmin={Boolean(isSuperAdmin)}
          setShowSideBar={setShowSideBar}
        />
      </div>
      <div
        className={`${showSideBar ? "opacity-100" : "opacity-0"} ${isHidden ? "hidden" : ""} lg:hidden transition-all duration-400 ease-in-out fixed top-0 left-0 h-dvh w-dvw bg-neutral-900/55 z-10`}
        onClick={() => setShowSideBar(false)}
      ></div>
    </>
  );
}
