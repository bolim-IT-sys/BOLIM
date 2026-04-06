import React from "react";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
};

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    children,
    title,
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 flex justify-center items-center z-50"
            onClick={onClose} // close when clicking outside
        >
            <div
                className="bg-white p-5 rounded-2xl w-auto border border-gray-400"
                onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-bold">{title || "Status"}</h2>
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

                {/* Body */}
                <div className="overflow-y-scroll max-h-180">{children}</div>
            </div>
        </div>
    );
};

export default Modal;