import * as React from "react"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const variants = {
  primary:
    "bg-brand-600 text-white shadow-lg shadow-brand-600/25 hover:bg-brand-700 hover:shadow-brand-600/35 dark:bg-brand-500 dark:text-slate-900 dark:hover:bg-brand-400",
  outline:
    "border border-slate-300 bg-white/70 text-ink backdrop-blur-md hover:border-brand-500 hover:text-brand-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:border-brand-400 dark:hover:text-brand-300",
}

const sizes = {
  sm: "px-4 py-2.5 text-sm",
  md: "px-6 py-3.5 text-sm",
  lg: "px-6 py-4 text-base",
}

/**
 * Reusable button with an animated hover-shine sweep across its surface.
 *
 * Supports `loading` (spinner + disabled), a `rightIcon`/`leftIcon`, a
 * `shine` toggle, and works as a plain button or `asChild` anchor/Slot.
 * `block` makes it full width; `variant` and `size` control styling.
 */
const ShineButton = React.forwardRef(function ShineButton(
  {
    variant = "primary",
    size = "md",
    loading = false,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    shine = true,
    block = false,
    className,
    children,
    disabled,
    asChild = false,
    ...props
  },
  ref,
) {
  const busy = loading
  const classes = cn(
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-70",
    variants[variant],
    sizes[size],
    block && "w-full",
    className,
  )

  if (asChild) {
    return (
      <Slot.Root className={classes} data-slot="shine-button" {...props}>
        {React.Children.only(children)}
      </Slot.Root>
    )
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      disabled={disabled || busy}
      whileTap={!disabled && !busy ? { scale: 0.98 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={classes}
      {...props}
    >
      {shine && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
        />
      )}
      {busy ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : LeftIcon ? (
        <LeftIcon className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:scale-105" />
      ) : null}
      {children && (
        <span className="relative inline-flex items-center gap-2">
          {children}
        </span>
      )}
      {!busy && RightIcon && (
        <RightIcon className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </motion.button>
  )
})

ShineButton.displayName = "ShineButton"

export { ShineButton }
