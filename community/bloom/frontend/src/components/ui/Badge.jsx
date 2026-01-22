export default function Badge({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-sm font-medium ${className}`}
    >
      {children}
    </span>
  )
}
