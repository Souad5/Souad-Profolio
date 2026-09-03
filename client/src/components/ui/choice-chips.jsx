import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Reusable group of toggleable choice chips (single-select pills).
 *
 * A controlled set of rounded chips. Clicking an option selects it (calling
 * `onChange(option)`); clicking the active option deselects it (calling
 * `onChange(null)`). Ideal for topics, filters, or quick-pick choices.
 * `chip` is an optional render function to fully customize each chip's content.
 */
const ChoiceChips = React.forwardRef(function ChoiceChips(
  { options, value, onChange, chip, className },
  ref,
) {
  const handleClick = (option) => {
    onChange?.(value === option ? null : option)
  }

  return (
    <div ref={ref} className={cn("flex flex-wrap gap-2", className)}>
      {options.map((option) => {
        const active = value === option
        return (
          <button
            key={option}
            type="button"
            onClick={() => handleClick(option)}
            aria-pressed={active}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200",
              active
                ? "border-brand-500 bg-brand-600 text-white shadow-md shadow-brand-600/25 dark:border-brand-400 dark:bg-brand-500 dark:text-slate-900"
                : "border-slate-300 bg-white/60 text-ink-muted hover:border-brand-400 hover:text-brand-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:border-brand-400/60 dark:hover:text-brand-300",
            )}
          >
            {chip ? (
              chip({ option, active })
            ) : (
              <>
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    active
                      ? "bg-white dark:bg-slate-900"
                      : "bg-slate-300 dark:bg-slate-600",
                  )}
                />
                {option}
              </>
            )}
          </button>
        )
      })}
    </div>
  )
})

ChoiceChips.displayName = "ChoiceChips"

export { ChoiceChips }
