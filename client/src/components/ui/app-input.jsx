import * as React from "react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

/**
 * Reusable input on top of shadcn Input.
 * Adds `label`, `hint` and `error` handling with automatic id wiring.
 * All shadcn Input props pass through unchanged.
 */
function AppInput({ className, id, label, hint, error, ...props }) {
  const generatedId = React.useId()
  const inputId = id ?? (label ? generatedId : undefined)

  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <Input id={inputId} aria-invalid={error ? true : undefined} {...props} />
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

export { AppInput }