export function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 my-8 border border-dashed border-border/60 bg-accent/30 text-center">
      <div className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Coming Soon</div>
      <h3 className="font-serif text-xl mb-2">{label}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        This section is currently being prepared for our Phase 2 digital rollout.
      </p>
    </div>
  );
}
