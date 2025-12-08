import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "default", size = "default", isLoading, children, disabled, ...props },
    ref
  ) => {
    const base = [
      "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium",
      "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
    ]

    const variants = {
      default:
        // ĐỔI MÀU: Chuyển từ bg-primary sang bg-slate-900 (Đen xám sang trọng)
        "bg-slate-900 text-white hover:bg-black shadow-md",   
      destructive:
        "bg-red-600 text-white hover:bg-red-700 shadow-sm",
      outline:
        "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900",
      secondary:
        "bg-slate-100 text-slate-900 hover:bg-slate-200",
      ghost: "hover:bg-slate-100 hover:text-slate-900",
      link: "text-slate-900 underline-offset-4 hover:underline",
    }

    const sizes = {
      default: "h-9 px-4 py-2",
      sm: "h-8 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    }

    return (
      <button
        className={cn(base, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)
Button.displayName = "Button"
export { Button }