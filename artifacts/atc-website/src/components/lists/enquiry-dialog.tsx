import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Copy } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateInquiry } from "@workspace/api-client-react";
import { btn, field } from "@/components/lists/ui";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { apiErrorMessage } from "@/lib/api-error";
import { enquiryMessage } from "@/lib/shortlist-message";
import { referenceCount, type Shortlist } from "@/lib/shortlists";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().trim().min(2, "Your name, at least two characters."),
  company: z.string().trim().max(120).optional(),
  email: z.string().trim().email("An email address we can reply to."),
  phone: z.string().trim().min(6, "A phone number we can call."),
  projectType: z.string().trim().max(80).optional(),
  timeline: z.string().trim().max(80).optional(),
  notes: z.string().trim().max(4000).optional(),
});
type Values = z.infer<typeof schema>;

const label = "text-sm font-medium leading-none";

/**
 * Project details for a shortlist enquiry. On success the dialog shows the reference ATC issued,
 * which the visitor quotes when they call or write.
 */
export function EnquiryDialog({ list, open, onOpenChange }: { list: Shortlist; open: boolean; onOpenChange: (open: boolean) => void }) {
  const inquiry = useCreateInquiry();
  const [reference, setReference] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", company: "", email: "", phone: "", projectType: "", timeline: "", notes: "" },
  });

  useEffect(() => {
    if (!open) return;
    setReference(null);
    setCopied(false);
    inquiry.reset();
  }, [open]);

  const submit = (values: Values) => {
    if (list.items.length === 0) return;
    inquiry.mutate(
      {
        data: {
          kind: "shortlist",
          name: values.name,
          email: values.email,
          phone: values.phone || null,
          company: values.company || null,
          projectType: values.projectType || null,
          timeline: values.timeline || null,
          listName: list.name,
          message: enquiryMessage(list, values.notes ?? ""),
          items: list.items.map(({ slug, name, brandName, reference: ref, variant, quantity }) => ({ slug, name, brandName, reference: ref || null, variant, quantity })),
        },
      },
      { onSuccess: (result) => setReference(result.reference) },
    );
  };

  const copy = async () => {
    if (!reference) return;
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-none sm:rounded-none" data-testid="dialog-enquiry">
        {reference ? (
          <div className="grid gap-4" data-testid="enquiry-success">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl font-medium tracking-[-0.02em]">Sent to ATC.</DialogTitle>
              <DialogDescription>Quote this reference when you call or write. Our specification team replies with availability and project terms.</DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-between gap-4 border border-border bg-card px-5 py-4">
              <span className="font-mono text-xl tracking-[0.12em] text-foreground" data-testid="text-enquiry-reference">{reference}</span>
              <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-foreground" data-testid="button-copy-reference">
                {copied ? <Check className="h-4 w-4 text-primary" strokeWidth={2} /> : <Copy className="h-4 w-4" strokeWidth={1.5} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="flex sm:justify-end">
              <button type="button" onClick={() => onOpenChange(false)} className={btn("outline")} data-testid="button-enquiry-close">
                Close
              </button>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)} className="grid gap-4" noValidate>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl font-medium tracking-[-0.02em]">Send “{list.name}” to ATC.</DialogTitle>
                <DialogDescription>
                  {referenceCount(list.items.length)} with quantities will reach our specification team together with your project details.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="name" render={({ field: f }) => (
                  <FormItem className="grid gap-2">
                    <label htmlFor="enq-name" className={label}>Your name</label>
                    <FormControl><input id="enq-name" {...f} autoComplete="name" required className={field} data-testid="input-enquiry-name" /></FormControl>
                    <FormMessage className="mt-0" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="company" render={({ field: f }) => (
                  <FormItem className="grid gap-2">
                    <label htmlFor="enq-company" className={label}>Company (optional)</label>
                    <FormControl><input id="enq-company" {...f} autoComplete="organization" className={field} data-testid="input-enquiry-company" /></FormControl>
                    <FormMessage className="mt-0" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field: f }) => (
                  <FormItem className="grid gap-2">
                    <label htmlFor="enq-email" className={label}>Email</label>
                    <FormControl><input id="enq-email" type="email" {...f} autoComplete="email" required className={field} data-testid="input-enquiry-email" /></FormControl>
                    <FormMessage className="mt-0" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field: f }) => (
                  <FormItem className="grid gap-2">
                    <label htmlFor="enq-phone" className={label}>Phone</label>
                    <FormControl><input id="enq-phone" type="tel" {...f} autoComplete="tel" required className={field} data-testid="input-enquiry-phone" /></FormControl>
                    <FormMessage className="mt-0" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="projectType" render={({ field: f }) => (
                  <FormItem className="grid gap-2">
                    <label htmlFor="enq-project" className={label}>Project type</label>
                    <FormControl><input id="enq-project" {...f} placeholder="Kitchen, wardrobe, villa fit-out" className={field} data-testid="input-enquiry-project" /></FormControl>
                    <FormMessage className="mt-0" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="timeline" render={({ field: f }) => (
                  <FormItem className="grid gap-2">
                    <label htmlFor="enq-timeline" className={label}>Timeline</label>
                    <FormControl><input id="enq-timeline" {...f} placeholder="For example, within six weeks" className={field} data-testid="input-enquiry-timeline" /></FormControl>
                    <FormMessage className="mt-0" />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="notes" render={({ field: f }) => (
                <FormItem className="grid gap-2">
                  <label htmlFor="enq-notes" className={label}>Project details</label>
                  <FormControl><textarea id="enq-notes" {...f} rows={3} placeholder="Openings, finishes, quantities per unit, site address." className={cn(field, "h-auto min-h-[60px]")} data-testid="input-enquiry-notes" /></FormControl>
                  <FormMessage className="mt-0" />
                </FormItem>
              )} />

              {inquiry.isError && (
                <p className="text-sm text-primary" role="alert" data-testid="text-enquiry-error">
                  {apiErrorMessage(inquiry.error, "The enquiry could not be sent. Try again, or send the list on WhatsApp.")}
                </p>
              )}

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end">
                <button type="submit" disabled={inquiry.isPending || list.items.length === 0} className={btn("primary")} data-testid="button-enquiry-submit">
                  {inquiry.isPending ? "Sending" : "Send enquiry"}
                </button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
