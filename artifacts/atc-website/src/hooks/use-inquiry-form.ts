import { useForm, type DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType, z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useCreateInquiry, type InquiryInput } from "@workspace/api-client-react";
import { apiErrorMessage } from "@/lib/api-error";

interface UseInquiryFormOptions<TSchema extends ZodType> {
  schema: TSchema;
  defaultValues: DefaultValues<z.infer<TSchema>>;
  /** Maps the validated form values to the inquiry payload (everything but `kind`). */
  toPayload: (values: z.infer<TSchema>) => Omit<InquiryInput, "kind">;
  successTitle: string;
  successDescription: string;
  errorTitle: string;
}

/**
 * Submit/toast/reset wiring for the contact inquiry form, kept apart from the
 * page so the form only carries its zod schema, field mapping and copy.
 */
export function useInquiryForm<TSchema extends ZodType>({
  schema,
  defaultValues,
  toPayload,
  successTitle,
  successDescription,
  errorTitle,
}: UseInquiryFormOptions<TSchema>) {
  const { toast } = useToast();
  const inquiry = useCreateInquiry();
  const form = useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  function onSubmit(values: z.infer<TSchema>) {
    inquiry.mutate(
      { data: { kind: "general", ...toPayload(values) } },
      {
        onSuccess: () => {
          toast({ title: successTitle, description: successDescription });
          form.reset();
        },
        onError: (error) => {
          toast({
            title: errorTitle,
            description: apiErrorMessage(error, "Please try again in a few minutes."),
            variant: "destructive",
          });
        },
      },
    );
  }

  return { form, onSubmit, isPending: inquiry.isPending };
}
