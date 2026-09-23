import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useInquiryForm } from "@/hooks/use-inquiry-form";
import { company } from "@/lib/content";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function Contact() {
  const { form, onSubmit, isPending } = useInquiryForm({
    schema: formSchema,
    defaultValues: { name: "", email: "", phone: "", company: "", message: "" },
    toPayload: (values) => ({
      name: values.name,
      email: values.email,
      phone: values.phone || null,
      company: values.company || null,
      message: values.message,
    }),
    successTitle: "Inquiry sent",
    successDescription: "We have received your message and will respond shortly.",
    errorTitle: "Unable to send inquiry",
  });

  return (
    <MainLayout>
      <div className="bg-muted py-12 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-display mb-6">Contact Us</h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
              Whether you are looking for specific technical details or ready to begin a project consultation, our team is available to assist you.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-12 gap-16">
          <div className="md:col-span-5 space-y-12">
            <div>
              <h3 className="font-display text-2xl mb-6">Showrooms</h3>
              <div className="space-y-8">
                {company.showrooms.map((showroom) => (
                  <div key={showroom.name}>
                    <h4 className="font-bold text-sm uppercase tracking-wider mb-2">{showroom.name}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {showroom.addressLines.map((line) => (
                        <span key={line}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </p>
                    <p className="text-sm mt-2 font-medium">{showroom.phone}</p>
                  </div>
                ))}
              </div>
              {company.contactUnconfirmed ? (
                <p className="mt-6 text-xs leading-relaxed text-muted-foreground">{company.contactNote}</p>
              ) : null}
            </div>

            <div>
              <h3 className="font-display text-2xl mb-6">Direct Channels</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="block text-muted-foreground mb-1">General Inquiries</span>
                  <a href={`mailto:${company.email}`} className="font-medium hover:text-primary transition-colors">
                    {company.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            <h3 className="font-display text-2xl mb-8">Send an Inquiry</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="contact-name">Full Name *</Label>
                        <FormControl>
                          <Input id="contact-name" placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="contact-email">Email Address *</Label>
                        <FormControl>
                          <Input id="contact-email" type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="contact-company">Company (Optional)</Label>
                        <FormControl>
                          <Input id="contact-company" placeholder="Architecture Firm LLC" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="contact-phone">Phone Number (Optional)</Label>
                        <FormControl>
                          <Input id="contact-phone" type="tel" placeholder="+962 79 000 0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="contact-message">Message *</Label>
                      <FormControl>
                        <Textarea
                          id="contact-message"
                          placeholder="Please provide details about your inquiry..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  size="lg"
                  disabled={isPending}
                  className="rounded-none tracking-widest uppercase text-xs font-bold w-full md:w-auto"
                >
                  {isPending ? "Sending…" : "Submit Inquiry"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
