import { Counter, Reveal } from "@/components/site/motion";
import { computeImpact } from "@/lib/food";
import { useFoods, useSession } from "@/lib/queries";
import { useHydrated } from "@/lib/use-hydrated";

export function Impact() {
  const { user, ready: sessionReady } = useSession();
  const ready = useHydrated() && sessionReady;
  const { data, error, isLoading } = useFoods("", "");
  const impact = data ? computeImpact(data) : null;

  const stats = [
    {
      label: "Meals shared",
      value: impact?.mealsShared,
      note: "Food posts listed by neighbours on FoodShare.",
    },
    {
      label: "Successfully claimed",
      value: impact?.claimed,
      note: "Posts that found someone to enjoy them.",
    },
    {
      label: "Community members",
      value: impact?.members,
      note: "People who have shared or claimed food.",
    },
  ];

  return (
    <section className="grain bg-deep text-deep-foreground" aria-labelledby="impact-title">
      <div className="container-editorial relative z-10 py-20 md:py-28">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 id="impact-title" className="text-headline max-w-xl">
            Small acts, <span className="text-sage">adding up.</span>
          </h2>
          <p className="eyebrow text-deep-foreground/60">
            {ready && !user
              ? "Log in to see live community numbers"
              : error
                ? "Live numbers appear when the FoodShare server is reachable"
                : "Live from current community listings"}
          </p>
        </Reveal>

        <div className="mt-14 grid border-t border-cream/15 md:grid-cols-3">
          {stats.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 0.1}
              className="border-b border-cream/15 py-10 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0"
            >
              <p className="eyebrow text-sage">{s.label}</p>
              <p className="text-numeral mt-6 text-cream">
                {typeof s.value === "number" ? (
                  <Counter value={s.value} />
                ) : (
                  <span
                    aria-label={isLoading ? "Loading" : "Unavailable"}
                    className="text-cream/30"
                  >
                    —
                  </span>
                )}
              </p>
              <p className="mt-5 max-w-xs text-sm text-deep-foreground/70">{s.note}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
