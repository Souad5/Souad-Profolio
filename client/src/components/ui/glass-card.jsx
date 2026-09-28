import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Reusable glassmorphism card container with an optional gradient glow border.
 *
 * Built on a backdrop-blur surface in both light/dark modes. Set `glow` to
 * show a gradient sheen across the surface, and `interactive` to add a hover
 * lift.
 */
const GlassCard = React.forwardRef(function GlassCard(
  { glow = false, interactive = false, className, children, ...props },
  ref,
) {
  const classes = cn(
    "relative rounded-3xl border border-slate-200 bg-white/70 shadow-2xl shadow-slate-900/5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/50",
    interactive &&
      "transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-400/60 hover:shadow-lg hover:shadow-brand-500/10 dark:hover:border-brand-400/40",
    className,
  )

  return (
    <div
      ref={ref}
      data-slot="glass-card"
      className={classes}
      {...props}
    >
      {glow && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-3xl bg-linear-to-r from-brand-500/5 via-teal-400/5 to-brand-500/5 opacity-0 transition-opacity duration-500"
        />
      )}
      {children}
    </div>
  )
})

GlassCard.displayName = "GlassCard"

export { GlassCard }
