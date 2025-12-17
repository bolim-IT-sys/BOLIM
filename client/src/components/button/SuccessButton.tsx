import type { ReactNode } from "react";

interface buttonProps {
  text: ReactNode;
  loadingText?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export default function SuccessButton({
  text,
  loadingText,
  onClick,
  disabled,
  isLoading,
}: buttonProps) {
  return (
    <button
      type="submit"
      className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 disabled:cursor-no-drop transition duration-200 ease-in-out cursor-pointer text-neutral-50 w-full rounded py-1 "
      disabled={disabled}
      onClick={onClick}
    >
      <div className="flex justify-center items-center gap-1">
        {isLoading ? (
          <>
            <i className="bx bx-loader-dots bx-spin" />
            <p className="">{loadingText}</p>
          </>
        ) : (
          <>
            {/* <i className="bx bx-loader-dots bx-spin " /> */}
            <p className="">{text}</p>
          </>
        )}
      </div>
    </button>
  );
}
