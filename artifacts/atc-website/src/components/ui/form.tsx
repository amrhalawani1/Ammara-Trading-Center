import * as React from "react"
import { useForm, FormProvider } from "react-hook-form"

const Form = FormProvider

const FormItemContext = React.createContext<
  { id: string } | undefined
>(undefined)

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={className} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

const useFormField = () => {
  const itemContext = React.useContext(FormItemContext)
  if (!itemContext) {
    throw new Error("useFormField should be used within <FormItem>")
  }
  return {
    id: itemContext.id,
  }
}

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { id } = useFormField()
  return <Slot ref={ref} id={id} {...props} />
})
FormControl.displayName = "FormControl"

import { Controller, ControllerProps, FieldPath, FieldValues } from "react-hook-form"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormItemContext.Provider value={{ id: props.name }}>
      <Controller {...props} />
    </FormItemContext.Provider>
  )
}

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { id } = useFormField()
  const { formState: { errors } } = useFormContext()
  const error = errors[id]
  
  if (!error) {
    return null
  }
  
  return (
    <p
      ref={ref}
      className={cn("text-[10px] font-medium text-destructive uppercase tracking-wider mt-2", className)}
      {...props}
    >
      {error.message as string}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

import { useFormContext } from "react-hook-form"

export {
  useFormField,
  Form,
  FormItem,
  FormControl,
  FormMessage,
  FormField,
}
