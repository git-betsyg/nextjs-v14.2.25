import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const fieldVariants = cva("flex flex-col gap-2", {
  variants: {
    orientation: {
      vertical: "flex-col",
      horizontal: "flex-row items-center justify-between",
      responsive: "flex-col sm:flex-row sm:items-center sm:justify-between",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
})

interface FieldProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof fieldVariants> {}

const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ className, orientation, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  )
)
Field.displayName = "Field"

const FieldGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col gap-4", className)} {...props} />
))
FieldGroup.displayName = "FieldGroup"

const FieldLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
))
FieldLabel.displayName = "FieldLabel"

const FieldDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs text-muted-foreground", className)}
    {...props}
  />
))
FieldDescription.displayName = "FieldDescription"

interface FieldErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  errors?: unknown[]
}

const FieldError = React.forwardRef<HTMLParagraphElement, FieldErrorProps>(
  ({ className, errors, children, ...props }, ref) => {
    const errorMessage = React.useMemo(() => {
      if (children) return children
      if (!errors || errors.length === 0) return null

      return errors
        .map((e) => {
          if (typeof e === "string") return e
          if (e && typeof e === "object" && "message" in e)
            return (e as { message: string }).message
          return String(e)
        })
        .filter(Boolean)
        .join(", ")
    }, [errors, children])

    if (!errorMessage) return null

    return (
      <p
        ref={ref}
        className={cn("text-sm text-destructive", className)}
        {...props}
      >
        {errorMessage}
      </p>
    )
  }
)
FieldError.displayName = "FieldError"

const FieldContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col gap-1", className)} {...props} />
))
FieldContent.displayName = "FieldContent"

export {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldContent,
}
