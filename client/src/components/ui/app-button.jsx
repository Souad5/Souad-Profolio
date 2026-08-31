import * as React from "react"
import { forwardRef } from "react"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const baseStyles =
  "group inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg font-medium tracking-tight transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none"

const variants = {
  primary:
    "bg-brand-600 text-white shadow-[0_4px_16px_rgba(79,70,229,0.25)] hover:bg-brand-700 dark:bg-brand-400 dark:text-ink dark:hover:bg-brand-300",
  secondary:
    "bg-slate-900 text-white shadow-[0_2px_8px_rgba(15,23,42,0.2)] hover:bg-slate-800 dark:bg-slate-200 dark:text-ink dark:hover:bg-slate-300",
  outline:
    "border border-slate-300 bg-surface text-ink hover:border-brand-500 hover:bg-brand-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:bg-slate-800/80 dark:hover:text-white",
  ghost:
    "bg-transparent text-ink-muted hover:bg-surface-muted hover:text-ink dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white",
  destructive:
    "bg-red-600 text-white hover:bg-red-700 dark:bg-red-500/90 dark:text-white dark:hover:bg-red-600",
}

const sizes = {
  xs: "h-7 px-3 text-sm",
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-base",
  lg: "h-12 px-8 text-lg",
  icon: "h-10 w-10 p-0",
  "icon-sm": "h-8 w-8 p-0",
  "icon-xs": "h-7 w-7 p-0",
}

/**
 * Reusable button on top of framer-motion with a shadcn-style API.
 * Variants/sizes mirror the AcademiaButton reference, colors use the
 * brand palette. Adds `isLoading`/`loading` (spinner + disabled),
 * `leftIcon`/`rightIcon` conveniences and press feedback via whileTap.
 * `asChild` renders a Slot onto a single child (anchor/Link) — no motion.
 */
const AppButton = forwardRef(function AppButton(
  {
    variant = "primary",
    size = "md",
    isLoading = false,
    loading = false,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    className,
    children,
    disabled,
    asChild = false,
    animate,
    whileHover,
    whileTap,
    transition,
    ...props
  },
  ref
) {
  const busy = isLoading || loading
  const classes = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    busy && asChild && "pointer-events-none opacity-50 select-none",
    className
  )

  if (asChild) {
    return (
      <Slot.Root className={classes} aria-busy={busy || undefined} {...props}>
        {React.Children.only(children)}
      </Slot.Root>
    )
  }

  return (
    <motion.button
      ref={ref}
      disabled={disabled || busy}
      aria-busy={busy || undefined}
      animate={animate}
      whileHover={whileHover}
      whileTap={
        whileTap ?? (!disabled && !busy ? { scale: 0.98 } : undefined)
      }
      transition={transition ?? { type: "spring", stiffness: 400, damping: 25 }}
      className={classes}
      {...props}
    >
      {busy ? (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
      ) : LeftIcon ? (
        <LeftIcon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-105" />
      ) : null}

      {children && (
        <span className="inline-flex items-center gap-2 truncate">{children}</span>
      )}

      {!busy && RightIcon && (
        <RightIcon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
      )}
    </motion.button>
  )
})

AppButton.displayName = "AppButton"

export { AppButton }