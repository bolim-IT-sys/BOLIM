interface buttonProps {
  text: ReactNode;
  loadingText?: string;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export default function DangerButton({
  text,
  loadingText,
  onClick,
  disabled,
  isLoading,
}: buttonProps) {
  return (
    <button
      type="submit"
      className="bg-red-500 hover:bg-red-400 disabled:bg-red-300 disabled:cursor-no-drop transition duration-200 ease-in-out cursor-pointer text-neutral-50 w-full rounded py-1 "
      disabled={disabled || isLoading}
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
