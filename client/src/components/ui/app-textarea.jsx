import * as React from "react"

import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

/**
 * Reusable textarea on top of shadcn Textarea.
 * Adds `label`, `hint` and `error` handling with automatic id wiring.
 * Grows automatically with content (field-sizing). All shadcn Textarea
 * props pass through unchanged.
 */
function AppTextarea({ className, id, label, hint, error, ...props }) {
  const generatedId = React.useId()
  const textareaId = id ?? (label ? generatedId : undefined)

  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      {label && <Label htmlFor={textareaId}>{label}</Label>}
      <Textarea
        id={textareaId}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

export { AppTextarea }