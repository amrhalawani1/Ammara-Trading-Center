import { useForm, type DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType, z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useCreateInquiry, type InquiryInput } from "@workspace/api-client-react";
import { apiErrorMessage } from "@/lib/api-error";
import { publicEnv } from "@/lib/env";
import { recordLocalInquiry } from "@/lib/trade-inquiries";

interface UseInquiryFormOptions<TSchema extends ZodType> {
  schema: TSchema;
  defaultValues: DefaultValues<z.infer<TSchema>>;
  /** Maps the validated form values to the inquiry payload (everything but `kind`). */
  toPayload: (values: z.infer<TSchema>) => Omit<InquiryInput, "kind">;
  successTitle: string;
  /** Toast body; a function receives the enquiry ref. returned by the API, when there is one. */
  successDescription: string | ((reference: string | undefined) => string);
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
        onSuccess: (result) => {
          const payload = toPayload(values);
          if (!publicEnv.clerkIsConfigured) {
            recordLocalInquiry({
              email: payload.email,
              reference: result.reference,
              kind: "general",
              message: payload.message,
            });
          }
          const description = typeof successDescription === "function" ? successDescription(result.reference) : successDescription;
          toast({ title: successTitle, description });
          form.reset();
        },
        onError: (error) => {
          toast({
            title: errorTitle,
            description: apiErrorMessage(error, "Check your connection and try again, or ask on WhatsApp."),
            variant: "destructive",
          });
        },
      },
    );
  }

  return { form, onSubmit, isPending: inquiry.isPending };
}
