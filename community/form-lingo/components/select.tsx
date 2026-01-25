type SelectProps = {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: readonly string[];
    id?: string;
    disabled?: boolean;
};

export function Select({
    label,
    value,
    onChange,
    options,
    id,
    disabled = false,
}: SelectProps) {
    const selectId = id || label.replace(/\s+/g, "-").toLowerCase();

    return (
        <div className="flex flex-col gap-1">
            <label
                htmlFor={selectId}
                className="block text-sm font-semibold text-text"
            >
                {label}
            </label>

            <select
                id={selectId}
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
                className="w-full border border-boder rounded-lg px-3 py-1.5 bg-crd outline-none text-sm transition focus:ring-2 focus:ring-prim/20 disabled:opacity-60"
            >
                {options.map((opt) => (
                    <option key={opt} value={opt}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </option>
                ))}
            </select>
        </div>
    );
}
