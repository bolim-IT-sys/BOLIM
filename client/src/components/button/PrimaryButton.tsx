import type { ReactNode } from "react";

interface buttonProps {
  text: ReactNode;
  loadingText?: string;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export default function PrimaryButton({
  text,
  loadingText,
  onClick,
  disabled,
  isLoading,
}: buttonProps) {
  return (
    <button
      type="submit"
      className="bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 disabled:cursor-no-drop transition duration-200 ease-in-out cursor-pointer text-neutral-50 w-full rounded py-1 px-3"
      disabled={disabled}
      onClick={onClick}
    >
      <p className="flex justify-center items-center gap-1">
        {isLoading ? (
          <>
            <i className="bx bx-loader-dots bx-spin" />
            {loadingText}
          </>
        ) : (
          <>{text}</>
        )}
      </p>
    </button>
  );
}
