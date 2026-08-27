export function CandidateFeature({ label }: { label: string }) {
  return (
    <div className="relative group overflow-hidden border border-border/50 bg-background p-4 opacity-70 grayscale-[30%] hover:opacity-100 hover:grayscale-0 transition-all">
      <div className="absolute top-0 right-0 bg-secondary text-secondary-foreground text-[10px] uppercase font-bold tracking-wider px-2 py-1">
        Candidate Feature
      </div>
      <div className="opacity-40 pointer-events-none mt-4">
        {/* Placeholder UI */}
        <div className="h-8 bg-border/40 w-full mb-2"></div>
        <div className="h-20 bg-border/40 w-full"></div>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="font-serif text-lg">{label}</span>
        <span className="text-xs text-muted-foreground">Pending Scope Confirmation</span>
      </div>
    </div>
  );
}
