import { motion, useReducedMotion } from "framer-motion";
import { iconForSpec } from "./product-facts";

/**
 * Barazza's icon feature list and Blum's benefit headlines, as one thin-ruled grid.
 * Titles only; icons are picked from the words in each title.
 */
export function FeatureList({ features }: { features: { title: string; body?: string | null }[] }) {
  const reduceMotion = useReducedMotion();
  if (features.length === 0) return null;
  return (
    <ul className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3" data-testid="feature-list">
      {features.map((feature, index) => {
        const Icon = iconForSpec(feature.title);
        return (
          <motion.li
            key={feature.title}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ type: "spring", stiffness: 120, damping: 22, delay: reduceMotion ? 0 : index * 0.04 }}
            className="flex items-start gap-4 bg-background p-6"
          >
            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={1.5} aria-hidden />
            <div>
              <p className="text-sm font-medium leading-6 text-foreground">{feature.title}</p>
              {feature.body && <p className="mt-1 text-sm leading-6 text-muted-foreground">{feature.body}</p>}
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
}
