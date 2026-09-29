import { ArrowUpRight, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TradePrefill } from "@/components/account/trade-prefill";
import { Reveal, RevealGroup, Section } from "@/components/home/primitives";
import { MainLayout } from "@/components/layout/main-layout";
import { MediaImage } from "@/components/media-image";
import { useInquiryForm } from "@/hooks/use-inquiry-form";
import { useOpenStatus } from "@/hooks/use-open-status";
import { company } from "@/lib/content";
import { mapsHref } from "@/lib/maps";
import { parseHours } from "@/lib/opening-hours";
import { SHOWROOMS, showroomHref, type ShowroomEntry } from "@/lib/showrooms";
import { cn } from "@/lib/utils";
import { whatsappUrl } from "@/lib/whatsapp";

const formSchema = z.object({
  name: z.string().min(2, "Enter your name."),
  email: z.string().email("Enter an email address, like name@studio.jo."),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(10, "Tell us a little more (at least 10 characters)."),
});

const fieldClass = "rounded-none shadow-none";

const askHref = whatsappUrl("Hello ATC, I would like to ask about a specification.");

export default function Contact() {
  return <TradePrefill>{(prefill) => <ContactPage key={`${prefill.email}-${prefill.name}`} prefill={prefill} />}</TradePrefill>;
}

function ContactPage({ prefill }: { prefill: { name: string; email: string; company: string } }) {
  const { form, onSubmit, isPending } = useInquiryForm({
    schema: formSchema,
    defaultValues: { name: prefill.name, email: prefill.email, phone: "", company: prefill.company, message: "" },
    toPayload: (values) => ({
      name: values.name,
      email: values.email,
      phone: values.phone || null,
      company: values.company || null,
      message: values.message,
    }),
    successTitle: "Enquiry sent",
    successDescription: (reference) =>
      reference
        ? `Your enquiry ref. is ${reference}. A consultant will reply with item nos. or a time to visit.`
        : "A consultant will reply with item nos. or a time to visit.",
    errorTitle: "Enquiry not sent",
  });

  return (
    <MainLayout immersiveHeader>
      <section
        id="write"
        className="dark relative flex min-h-[70dvh] flex-col justify-end bg-background text-foreground"
        data-testid="section-contact-hero"
      >
        <div className="mx-auto w-full max-w-[1440px] px-6 pb-16 pt-36 md:px-12 md:pb-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Contact</p>
          <h1 className="mt-5 max-w-[12ch] font-display text-[clamp(2.75rem,6vw,6rem)] font-medium leading-[0.9] tracking-[-0.05em]">
            Write, call, or come in.
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-foreground/70 md:text-lg md:leading-8">
            Whatever you have is enough to start: a drawing, an item no. or a photo of the room. WhatsApp is fastest from site. Use this form when you need a written record, and you will get an enquiry ref.
          </p>

          <div className="mt-14 grid gap-14 lg:mt-16 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <ChannelList />
            </Reveal>

            <Reveal className="lg:col-span-7" delay={0.08}>
              <h2 className="font-display text-3xl font-medium leading-none tracking-[-0.04em] md:text-4xl">
                Send an enquiry
              </h2>
              <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-8" data-testid="form-contact">
                <div className="grid gap-8 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <label htmlFor="contact-name" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          Name
                        </label>
                        <FormControl>
                          <Input id="contact-name" autoComplete="name" placeholder="Your name" className={fieldClass} {...field} />
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
                        <label htmlFor="contact-email" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          Email
                        </label>
                        <FormControl>
                          <Input id="contact-email" type="email" autoComplete="email" placeholder="you@studio.jo" className={fieldClass} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-8 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <label htmlFor="contact-company" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          Company (optional)
                        </label>
                        <FormControl>
                          <Input id="contact-company" autoComplete="organization" className={fieldClass} {...field} />
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
                        <label htmlFor="contact-phone" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          Phone (optional)
                        </label>
                        <FormControl>
                          <Input id="contact-phone" type="tel" autoComplete="tel" className={fieldClass} {...field} />
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
                      <label htmlFor="contact-message" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        What you need
                      </label>
                      <FormControl>
                        <Textarea
                          id="contact-message"
                          placeholder="An item no., the room you are planning, or the problem to solve."
                          className={cn(fieldClass, "min-h-[140px]")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex h-12 items-center gap-3 bg-primary px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-[background-color,color,transform] hover:bg-foreground hover:text-background active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
                  data-testid="button-contact-send"
                >
                  {isPending ? "Sending…" : "Send enquiry"}
                  {!isPending && <ArrowUpRight className="h-4 w-4" strokeWidth={2} />}
                </button>
              </form>
            </Form>
            </Reveal>
          </div>
        </div>
      </section>

      <Section id="floors" tone="panel" className="scroll-mt-24">
        <Reveal className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <div>
            <h2 className="font-display text-5xl font-medium leading-[0.92] tracking-[-0.05em] md:text-6xl">Visit a showroom.</h2>
            <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">
              Walk in, or book ahead. Al-Bayader if you want to use a kitchen. Al-Wehdat if you are working from drawings.
            </p>
          </div>
          <Link
            href="/showroom"
            className="inline-flex min-h-11 items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary transition-colors hover:text-foreground"
            data-testid="link-contact-all-showrooms"
          >
            Both showrooms <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
          </Link>
        </Reveal>
        <RevealGroup as="ul" className="mt-12 border-t border-border md:mt-16" aria-label="Showrooms">
          {SHOWROOMS.map((showroom, index) => (
            <FloorRow key={showroom.slug} showroom={showroom} flip={index % 2 === 1} />
          ))}
        </RevealGroup>
      </Section>
    </MainLayout>
  );
}

function ChannelList() {
  return (
    <dl className="border-t border-white/10">
      <div className="grid gap-1 border-b border-white/10 py-5 sm:grid-cols-[8rem_minmax(0,1fr)] sm:items-baseline">
        <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">WhatsApp</dt>
        <dd>
          <a
            href={askHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-base transition-colors hover:text-primary"
            data-testid="link-contact-whatsapp-rail"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
            {company.whatsapp.display}
          </a>
        </dd>
      </div>
      <div className="grid gap-1 border-b border-white/10 py-5 sm:grid-cols-[8rem_minmax(0,1fr)] sm:items-baseline">
        <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Email</dt>
        <dd>
          <a href={`mailto:${company.email}`} className="text-base transition-colors hover:text-primary" data-testid="link-contact-email">
            {company.email}
          </a>
        </dd>
      </div>
      {company.showrooms.map((showroom) => (
        <div key={showroom.name} className="grid gap-1 border-b border-white/10 py-5 sm:grid-cols-[8rem_minmax(0,1fr)] sm:items-baseline">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{showroom.name}</dt>
          <dd>
            <a href={`tel:${showroom.phone.replace(/\s+/g, "")}`} className="text-base tabular-nums transition-colors hover:text-primary">
              {showroom.phone}
            </a>
            <p className="mt-1 text-sm text-muted-foreground">{showroom.hours}</p>
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** "09:00–18:00", the hours as they would be lettered on the door. */
function doorPlate(hours: string): string | null {
  const schedule = parseHours(hours);
  if (!schedule) return null;
  const plate = (minutes: number) => {
    const hour = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hour).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  };
  return `${plate(schedule.open)}–${plate(schedule.close)}`;
}

function FloorRow({ showroom, flip }: { showroom: ShowroomEntry; flip: boolean }) {
  const status = useOpenStatus(showroom.hours);
  const days = showroom.hours.split(",")[0]?.trim();
  const plate = doorPlate(showroom.hours);
  const room = showroom.gallery[0];
  const tel = showroom.phone.replace(/\s+/g, "");

  return (
    <li className="border-b border-border" data-testid={`row-contact-showroom-${showroom.slug}`}>
      <article className="grid items-center gap-8 py-10 lg:grid-cols-12 lg:gap-12 lg:py-14">
        <Link
          href={showroomHref(showroom.slug)}
          className={cn("group/room relative block aspect-[4/3] overflow-hidden bg-tile lg:col-span-7", flip && "lg:order-2")}
          tabIndex={-1}
          aria-hidden
        >
          {room && (
            <MediaImage
              src={room.src}
              alt={room.alt}
              width={1400}
              height={1050}
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/room:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover/room:scale-100"
            />
          )}
        </Link>

        <div className={cn("flex flex-col lg:col-span-5", flip && "lg:order-1")}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">{showroom.role}</p>
          <h3 className="mt-3 font-display text-4xl font-medium leading-none tracking-[-0.04em] md:text-5xl">{showroom.name}</h3>
          <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">{showroom.summary}</p>

          <p className="mt-8 font-display text-4xl font-medium tabular-nums tracking-[-0.04em] md:text-5xl" data-testid={`text-hours-${showroom.slug}`}>
            {plate ?? showroom.hours}
          </p>
          <p className="mt-3 text-sm text-foreground">
            {days}
            {status && <span className={status.open ? "text-foreground" : "text-muted-foreground"}> · {status.label}</span>}
          </p>
          <p className="mt-4 text-sm leading-6">
            {showroom.addressLines.map((line) => (
              <span key={line} className="block">{line}</span>
            ))}
            <a href={`tel:${tel}`} className="mt-1 inline-flex min-h-11 items-center tabular-nums hover:text-primary">
              {showroom.phone}
            </a>
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href={showroomHref(showroom.slug)}
              className="inline-flex h-11 items-center gap-2 bg-foreground px-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-background transition-[background-color,color] hover:bg-primary hover:text-primary-foreground"
              data-testid={`link-contact-floor-${showroom.slug}`}
            >
              View showroom
            </Link>
            <a
              href={mapsHref(showroom.name, showroom.addressLines)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center gap-2 border border-foreground/20 px-4 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors hover:border-foreground"
              data-testid={`link-contact-directions-${showroom.slug}`}
            >
              Get directions
            </a>
          </div>
        </div>
      </article>
    </li>
  );
}
