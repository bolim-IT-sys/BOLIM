type SwitchProps = {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  label?: string;
};

export const SwitchButton = ({
  checked,
  onChange,
  disabled,
  label,
}: SwitchProps) => {
  return (
    <div className="min-w-max">
      <label className="inline-flex items-center gap-2 cursor-pointer select-none">
        {label && (
          <span
            className={`text-sm ${disabled ? "text-neutral-400" : "text-neutral-700"}`}
          >
            {label}
          </span>
        )}

        <button
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => !disabled && onChange(!checked)}
          className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed
          ${checked ? "bg-sky-600 disabled:bg-sky-200" : "bg-neutral-300 disabled:bg-neutral-200"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
        >
          <span
            className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200
            ${checked ? "translate-x-6" : "translate-x-1"}
          `}
          />
        </button>
        <div
          className={`size-3 ${disabled ? "bg-red-600" : "bg-green-600"} rounded-full`}
        ></div>
      </label>
    </div>
  );
};
