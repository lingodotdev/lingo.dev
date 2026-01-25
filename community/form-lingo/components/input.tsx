type InputProps = {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    type?: React.HTMLInputTypeAttribute;
    id?: string;
    disabled?: boolean;
};

export function Input({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    id,
    disabled = false,
}: InputProps) {
    const inputId = id || label.replace(/\s+/g, "-").toLowerCase();

    return (
        <div className="flex flex-col gap-1">
            <label
                htmlFor={inputId}
                className="block text-sm font-medium text-text"
            >
                {label}
            </label>

            <input
                id={inputId}
                type={type}
                value={value}
                disabled={disabled}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className="w-full border border-boder rounded-lg px-3 py-1.5 bg-crd outline-none text-sm transition focus:ring-2 focus:ring-prim/20 disabled:opacity-60"
            />
        </div>
    );
}
