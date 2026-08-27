import { Link } from "wouter";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function Contact() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, this would be an API call
    console.log(values);
    toast({
      title: "Inquiry Sent",
      description: "We have received your message and will respond shortly.",
    });
    form.reset();
  }

  return (
    <MainLayout>
      <div className="bg-muted py-12 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-serif mb-6">Contact Us</h1>
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
              <h3 className="font-serif text-2xl mb-6">Showrooms</h3>
              <div className="space-y-8">
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wider mb-2">Al-Bayader</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Industrial Area, 8th Circle<br />
                    Amman, Jordan
                  </p>
                  <p className="text-sm mt-2 font-medium">+962 6 581 0000</p>
                </div>
                
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wider mb-2">Al-Wehdat</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Building Materials St.<br />
                    Amman, Jordan
                  </p>
                  <p className="text-sm mt-2 font-medium">+962 6 477 0000</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-serif text-2xl mb-6">Direct Channels</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="block text-muted-foreground mb-1">General Inquiries</span>
                  <a href="mailto:info@amara.jo" className="font-medium hover:text-primary transition-colors">info@amara.jo</a>
                </div>
              </div>
            </div>

            <div className="p-6 bg-accent/30 border border-border/50">
              <h4 className="font-serif text-lg mb-2">Trade Professional?</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Skip the general inquiry and access our dedicated portal for fabricators and architects.
              </p>
              <Link href="/trade" className="text-xs font-bold uppercase tracking-wider text-primary hover:text-foreground transition-colors inline-flex items-center">
                Go to Trade Hub &rarr;
              </Link>
            </div>
          </div>

          <div className="md:col-span-7">
            <h3 className="font-serif text-2xl mb-8">Send an Inquiry</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Full Name *</Label>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
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
                        <Label>Email Address *</Label>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
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
                        <Label>Company (Optional)</Label>
                        <FormControl>
                          <Input placeholder="Architecture Firm LLC" {...field} />
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
                        <Label>Phone Number (Optional)</Label>
                        <FormControl>
                          <Input type="tel" placeholder="+962 79 000 0000" {...field} />
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
                      <Label>Message *</Label>
                      <FormControl>
                        <Textarea 
                          placeholder="Please provide details about your inquiry..." 
                          className="min-h-[150px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" size="lg" className="rounded-none tracking-widest uppercase text-xs font-bold w-full md:w-auto">
                  Submit Inquiry
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
