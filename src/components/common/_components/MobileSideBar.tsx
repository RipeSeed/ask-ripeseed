import { MouseEvent } from "react";
import { Menu, X } from "lucide-react";
import GeneralSideBar from "@/app/_components/GeneralSidebar";

interface MobileSideBarProps {
  toggle: boolean;
  setToggle: (toggle: boolean) => void;
}

const MobileSideBar: React.FC<MobileSideBarProps> = ({ toggle, setToggle }) => {
  const toggleHandler = (e: MouseEvent) => {
    e.stopPropagation();
    setToggle(!toggle);
  };

  return (
    <>
      {toggle ? (
        <X
          onClick={(e) => toggleHandler(e)}
          className="absolute left-[14px] top-4 h-5 w-5 cursor-pointer md:hidden"
        />
      ) : (
        <Menu
          className="absolute left-[14px] top-4 h-5 w-5 cursor-pointer md:hidden"
          onClick={(e) => toggleHandler(e)}
        />
      )}
      <div
        className={`absolute top-11 mt-3 z-40 flex h-full w-[200px] transform flex-col bg-[rgb(235,235,235)] p-4 transition-transform duration-200 ease-in-out dark:bg-black md:hidden ${
          toggle ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <GeneralSideBar />
      </div>
    </>
  );
};

export default MobileSideBar;
