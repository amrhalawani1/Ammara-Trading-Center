import { MainLayout } from "@/components/layout/main-layout";
import { Link } from "wouter";
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
  company: z.string().min(2, "Company name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is required"),
  projectType: z.string().optional(),
  message: z.string().min(10, "Please provide details about your RFQ"),
});

export default function Trade() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      projectType: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "RFQ Submitted",
      description: "Our trade team will contact you within 24 hours.",
    });
    form.reset();
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-background py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl">
            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.25em] text-primary mb-6">Trade Portal</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 leading-[1.1]">
              Built for speed &amp; accountability.
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed font-light">
              We know that on a job site, delays cost money. Our trade portal provides architects, fabricators, and procurement teams with direct access to technical support, volume purchasing, and reliable local inventory.
            </p>
          </div>
          <div className="aspect-[4/3] bg-muted relative border border-border">
            <img 
              src="/images/trade-planning.jpg" 
              alt="Trade blueprints"
              className="w-full h-full object-cover grayscale-[10%]"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        </div>
      </section>

      {/* Why ATC for Trade */}
      <section className="py-24 bg-accent/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-16">
            <h2 className="text-3xl font-serif mb-4">Why ATC?</h2>
            <p className="text-muted-foreground leading-relaxed">
              We are a single accountable partner for your entire hardware spec. We don't drop-ship from unknown sources; we stock deeply in Amman so you can build with confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="border-t-2 border-primary pt-6">
              <h3 className="font-serif text-lg mb-3">Guaranteed Specs</h3>
              <p className="text-sm text-muted-foreground">Original components from authorized manufacturers, backed by factory warranties.</p>
            </div>
            <div className="border-t-2 border-border pt-6">
              <h3 className="font-serif text-lg mb-3">Local Inventory</h3>
              <p className="text-sm text-muted-foreground">Massive stock held in Amman to insulate your project timelines from global shipping delays.</p>
            </div>
            <div className="border-t-2 border-border pt-6">
              <h3 className="font-serif text-lg mb-3">Technical Training</h3>
              <p className="text-sm text-muted-foreground">We train your fabricators on new systems to ensure perfect installation and reduce callbacks.</p>
            </div>
            <div className="border-t-2 border-border pt-6">
              <h3 className="font-serif text-lg mb-3">Accountable Support</h3>
              <p className="text-sm text-muted-foreground">If a system fails, our local team is on the ground to diagnose and resolve it immediately.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Project References */}
      <section className="py-24 bg-accent/20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-serif">Project References</h2>
          </div>
          <div className="bg-background p-8 border border-border text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3 block">Coming Soon</span>
            <h3 className="font-serif text-2xl mb-4">Commercial & Institutional Portfolio</h3>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6 text-sm">
              We are currently compiling documentation and clearances for our recent large-scale project installations across Jordan. This section will feature detailed case studies of our hardware performance in demanding environments.
            </p>
          </div>
        </div>
      </section>

      {/* RFQ Form */}
      <section className="py-24 bg-background border-t border-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif mb-4">Request for Quote</h2>
            <p className="text-muted-foreground">Submit your project details or component lists for a fast, accurate quote.</p>
          </div>

          <div className="p-8 md:p-12 border border-border bg-accent/10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Contact Name *</Label>
                        <FormControl>
                          <Input placeholder="Jane Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Company / Workshop *</Label>
                        <FormControl>
                          <Input placeholder="Smith Fabrication" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Email Address *</Label>
                        <FormControl>
                          <Input type="email" placeholder="jane@example.com" {...field} />
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
                        <Label>Phone Number *</Label>
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
                  name="projectType"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Project Type (Optional)</Label>
                      <FormControl>
                        <Input placeholder="e.g. 50-unit residential, single custom kitchen" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Requirements / Bill of Materials *</Label>
                      <FormControl>
                        <Textarea 
                          placeholder="Paste your item list or describe your requirements..." 
                          className="min-h-[150px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" size="lg" className="rounded-none tracking-widest uppercase text-xs font-bold w-full">
                  Submit RFQ
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
