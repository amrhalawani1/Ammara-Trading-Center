import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form"
import { cn } from "@/lib/utils"

const Form = FormProvider

/** The field a subtree belongs to, so messages can read that field's error. */
const FormFieldContext = React.createContext<{ name: string } | undefined>(undefined)

/** The DOM id shared by a field's control and its message. */
const FormItemContext = React.createContext<{ id: string } | undefined>(undefined)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()
  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }
  const fieldState = getFieldState(fieldContext.name, formState)
  const id = itemContext?.id ?? fieldContext.name
  return {
    id,
    name: fieldContext.name,
    messageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = React.useId()
    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={className} {...props} />
      </FormItemContext.Provider>
    )
  },
)
FormItem.displayName = "FormItem"

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { id, error, messageId } = useFormField()
  return (
    <Slot
      ref={ref}
      id={id}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? messageId : undefined}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    const { error, messageId } = useFormField()
    const body = error ? String(error.message ?? "") : children
    if (!body) {
      return null
    }
    return (
      <p
        ref={ref}
        id={messageId}
        role="alert"
        className={cn("text-[10px] font-medium text-destructive uppercase tracking-wider mt-2", className)}
        {...props}
      >
        {body}
      </p>
    )
  },
)
FormMessage.displayName = "FormMessage"

export { Form, FormItem, FormControl, FormField, FormMessage, useFormField }
