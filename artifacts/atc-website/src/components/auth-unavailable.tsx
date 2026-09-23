import { BrandLogo } from "@/components/brand-logo";
export function AuthUnavailablePage({ title }: { title: string }) {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-12 bg-background px-4">
      <a href={import.meta.env.BASE_URL} aria-label="Amara Trading Center home">
        <BrandLogo size="md" priority />
      </a>
      <div className="max-w-lg border border-border bg-card p-8 text-center">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
          Local development
        </p>
        <h1 className="mb-3 font-display text-3xl">{title}</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Clerk is not configured on this machine. Public pages work without it.
          To enable staff sign-in, set a real{" "}
          <code className="font-mono text-xs">VITE_CLERK_PUBLISHABLE_KEY</code>.
        </p>
      </div>
    </div>
  );
}
