import { useState, useRef, useEffect, type ReactNode } from "react";

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
}

function Dropdown({ trigger, children }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState<boolean>(isOpen);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsAnimating(true);
    } else if (isVisible) {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isVisible]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer hover:bg-neutral-300 transition duration-150 p-2 rounded "
      >
        {trigger}
      </div>
      {isVisible && (
        <div
          className={`absolute right-0 top-8 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 ${isAnimating ? "dropdown_fade_in" : "dropdown_fade_out"}`}
          style={{ zIndex: 6 }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

interface DropdownItemProps {
  children: ReactNode;
  onClick?: () => void;
}

function DropdownItem({ children, onClick }: DropdownItemProps) {
  return (
    <div onClick={onClick} className="px-2 py-1">
      {children}
    </div>
  );
}

export { Dropdown, DropdownItem };
