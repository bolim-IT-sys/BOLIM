import { useEffect, useState, type ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  size?: string;
  footer: ReactNode;
}

// Reusable Modal Component
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size,
  footer,
}: ModalProps) => {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsAnimating(true);
    } else if (isVisible) {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen, isVisible]);

  if (!isVisible) return null;
  const sizeClass =
    size === "sm"
      ? "w-100"
      : size === "md"
        ? "w-150"
        : size === "lg"
          ? "w-200"
          : size === "xl"
            ? "w-250"
            : size === "2xl"
              ? "w-300"
              : "w-100";

  return (
    <>
      <div
        className={`fixed h-dvh w-dvw left-0 top-0 flex justify-center items-center ${isAnimating ? "modal_fade_in " : "modal_fade_out"}`}
        onClick={onClose}
        style={{ backgroundColor: "rgb(0, 0, 0,.5)", zIndex: 99999 }}
      >
        <div
          className={`bg-neutral-50 p-5 rounded visibl ${sizeClass} ${isAnimating ? "modal_fade_up" : "modal_fade_down"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            {/* MODAL HEADER */}
            <div
              className={`flex justify-between items-center pb-1 border-b border-neutral-300`}
            >
              <div className="modal-title ">{title}</div>
              <button
                className="bg-red-300 hover:bg-red-400 text-neutral-50 transition rounded duration-200 size-9 cursor-pointer"
                onClick={onClose}
                aria-label="Close"
              >
                <h4 className="flex justify-center items-center">
                  <i className="bx  bx-x"></i>
                </h4>
              </button>
            </div>
            {/* MODAL BODY */}
            <div className="pt-3 mb-3">{children}</div>
            {footer && <div className="flex flex-col gap-2">{footer}</div>}
          </div>
        </div>
      </div>
    </>
  );
};

export { Modal };
