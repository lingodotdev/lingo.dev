import * as React from "react"
import { cn } from "../../lib/utils"

const badgeVariants = {
    default: "border-transparent bg-primary text-slate-50 hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-slate-900 hover:bg-secondary/80",
    destructive: "border-transparent bg-accent-red text-slate-50 hover:bg-accent-red/80",
    outline: "text-slate-950",
    green: "border-transparent bg-green-100 text-green-800 hover:bg-green-200",
    yellow: "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    red: "border-transparent bg-red-100 text-red-800 hover:bg-red-200",
}

function Badge({ className, variant = "default", ...props }) {
    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2",
                badgeVariants[variant],
                className
            )}
            {...props}
        />
    )
}

export { Badge }
