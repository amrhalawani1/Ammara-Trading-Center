import type { LucideIcon } from "lucide-react";
import { DoorOpen, Info, Layers, PenTool, Repeat, RotateCw, Ruler, Sun, Weight, Wind, Wrench, Zap } from "lucide-react";

export interface Spec {
  label: string;
  value: string;
}

const ICONS: Array<[RegExp, LucideIcon]> = [
  [/load|weight|capacity/i, Weight],
  [/angle|opening/i, RotateCw],
  [/durab|cycle/i, Repeat],
  [/motion|damp|close|soft/i, Wind],
  [/material|surface|profile/i, Layers],
  [/height|depth|width|length|dimension|diameter|thickness|cavity|coverage|range|delay/i, Ruler],
  [/designer/i, PenTool],
  [/fixing|mount|adjust|control/i, Wrench],
  [/volt|power|driver|sensor/i, Zap],
  [/colour|color|temperature/i, Sun],
  [/application|door|cabinet|rose|rail/i, DoorOpen],
];

export function iconForSpec(label: string): LucideIcon {
  return ICONS.find(([pattern]) => pattern.test(label))?.[1] ?? Info;
}

/** Key facts as one thin-ruled row. On a phone the row scrolls sideways; from `lg` it sits in columns. */
export function ProductFacts({ specs }: { specs: Spec[] }) {
  const facts = specs.filter((spec) => !/designer/i.test(spec.label)).slice(0, 6);
  if (facts.length === 0) return null;
  return (
    <dl
      className="flex snap-x snap-mandatory overflow-x-auto border-y border-border [scrollbar-width:none] lg:grid lg:overflow-visible [&::-webkit-scrollbar]:hidden"
      style={{ gridTemplateColumns: `repeat(${facts.length}, minmax(0, 1fr))` }}
      data-testid="product-facts"
    >
      {facts.map((fact) => {
        const Icon = iconForSpec(fact.label);
        return (
          <div key={fact.label} className="min-w-[46%] shrink-0 snap-start border-r border-border px-4 py-5 last:border-r-0 lg:min-w-0 lg:px-6 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0">
            <dt className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icon className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden /> {fact.label}
            </dt>
            <dd className="mt-3 font-display text-2xl font-light leading-tight text-foreground">{fact.value}</dd>
          </div>
        );
      })}
    </dl>
  );
}
