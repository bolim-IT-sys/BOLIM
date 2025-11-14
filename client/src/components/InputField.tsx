interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  required?: boolean;
  onChange: (value: string) => void;
  autoComplete?: string;
}

export default function InputField({
  label,
  type,
  value,
  required,
  onChange,
  autoComplete,
}: InputFieldProps) {
  return (
    <div className="caret-pink-500">
      <input
        type={type}
        value={value ?? ""}
        placeholder={label}
        aria-label={label}
        onChange={(e) => onChange(e.target.value)}
        required={required ?? false}
        autoComplete={autoComplete}
        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
