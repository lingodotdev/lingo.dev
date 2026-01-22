export default function Button({
  children,
  onClick,
  type = "button",
  className = "",
  variant = "primary",
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:pointer-events-none"

  const variants = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700",
    outline:
      "border border-slate-300 bg-white text-slate-800 hover:bg-emerald-50 hover:border-emerald-400",
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
