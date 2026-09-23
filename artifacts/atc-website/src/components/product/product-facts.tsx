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

/** Key facts as one thin-ruled row: no boxes, DND's restraint with Häfele's usefulness. */
export function ProductFacts({ specs }: { specs: Spec[] }) {
  const facts = specs.filter((spec) => !/designer/i.test(spec.label)).slice(0, 4);
  if (facts.length === 0) return null;
  return (
    <dl className="grid grid-cols-2 border-y border-border md:grid-cols-4 md:divide-x md:divide-border" data-testid="product-facts">
      {facts.map((fact) => {
        const Icon = iconForSpec(fact.label);
        return (
          <div key={fact.label} className="py-6 md:px-6 md:first:pl-0 md:last:pr-0">
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
