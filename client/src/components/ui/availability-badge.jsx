import * as React from "react"
import { motion } from "framer-motion"
import { Dot } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Reusable animated availability / status pill badge.
 *
 * An inline-flex pill with a pulsing status dot. Optionally accepts
 * `children`/`trailing` text to render after the main text. Usually placed at
 * the top of a section to indicate availability.
 */
const AvailabilityBadge = React.forwardRef(function AvailabilityBadge(
  { children, trailing, className },
  ref,
) {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-semibold tracking-wide text-emerald-700 backdrop-blur-md dark:border-brand-400/30 dark:bg-brand-500/10 dark:text-brand-300",
        className,
      )}
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
      </span>
      {children}
      {trailing && (
        <>
          <Dot className="h-3 w-3 text-emerald-500" />
          <span className="text-emerald-600 dark:text-brand-300">{trailing}</span>
        </>
      )}
    </motion.div>
  )
})

AvailabilityBadge.displayName = "AvailabilityBadge"

export { AvailabilityBadge }
