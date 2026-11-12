import * as React from "react"
import { WarningIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

import { Input } from "./input"
import { Label } from "./label"

/*
 * Clærio field parts: helper text, error text and TextField.
 *
 * Sources: claude-design-reference/components/Input, the states spec
 * (Form validation) and decisions.md (Inputs).
 *
 * - Label to field: space-2, 8px (decided 2026-11-12; the reference
 *   used 6px, which is off the spacing scale).
 * - Field to helper or error: 4px (states spec).
 * - Helper: body-small in --muted-foreground.
 * - Error: body-small in --error-foreground, with a leading Phosphor
 *   Warning icon at 16px. The error replaces the helper; the two never
 *   stack.
 */

function Field({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="field" className={cn("flex flex-col", className)} {...props} />
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn("mt-1 font-sans text-body-small text-muted-foreground", className)}
      {...props}
    />
  )
}

function FieldError({ className, children, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-error"
      className={cn(
        "mt-1 flex items-center gap-1 font-sans text-body-small text-error-foreground",
        className
      )}
      {...props}
    >
      <WarningIcon aria-hidden className="size-4 shrink-0" />
      {children}
    </p>
  )
}

type TextFieldProps = Omit<React.ComponentProps<"input">, "id"> & {
  /** Visible label above the field. Required: never rely on the placeholder. */
  label: React.ReactNode
  /** Helper text under the field. Hidden while an error shows. */
  helper?: React.ReactNode
  /** Error message. When set, the field is marked invalid and this replaces the helper. */
  error?: React.ReactNode
  /** Optional id. One is generated when left out. */
  id?: string
  /** Class for the outer wrapper. */
  fieldClassName?: string
}

/**
 * A labelled text input with optional helper and error text. It links the
 * message to the input for screen readers and sets aria-invalid when an
 * error is present.
 */
function TextField({ label, helper, error, id, fieldClassName, ...inputProps }: TextFieldProps) {
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const messageId = `${inputId}-message`
  const hasError = Boolean(error)
  const message = hasError ? error : helper

  return (
    <Field className={fieldClassName}>
      <Label htmlFor={inputId} className="mb-2">
        {label}
      </Label>
      <Input
        id={inputId}
        aria-invalid={hasError || undefined}
        aria-describedby={message ? messageId : undefined}
        {...inputProps}
      />
      {hasError ? (
        <FieldError id={messageId}>{error}</FieldError>
      ) : helper ? (
        <FieldDescription id={messageId}>{helper}</FieldDescription>
      ) : null}
    </Field>
  )
}

export { Field, FieldDescription, FieldError, TextField }
export type { TextFieldProps }
