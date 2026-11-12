import { Link } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { EmptyState, FoodGrid } from "@/components/site/FoodGrid";
import { Reveal } from "@/components/site/motion";
import { FOOD_TYPES } from "@/lib/food";
import { useFoods, useSession } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/lib/use-hydrated";

export function Discovery() {
  const { user, ready: sessionReady } = useSession();
  const ready = useHydrated() && sessionReady;
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setSearch(input.trim()), 300);
    return () => clearTimeout(t);
  }, [input]);

  const { data, isLoading, isFetching, error, refetch } = useFoods(search, type);
  const filtered = !!search || !!type;

  function clear() {
    setInput("");
    setSearch("");
    setType("");
  }

  return (
    <section id="discover" className="py-20 md:py-28" aria-labelledby="discover-title">
      <div className="container-editorial">
        <Reveal className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <p className="eyebrow text-muted-foreground">(02) Browse food</p>
            <h2 id="discover-title" className="text-headline mt-5">
              What's on the table today<span className="text-accent">.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <label className="relative block">
              <span className="sr-only">Search for food</span>
              <Search className="pointer-events-none absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Search for food…"
                className="h-14 w-full border-0 border-b-2 border-foreground/20 bg-transparent pl-8 pr-10 text-lg outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
              />
              {isFetching && !isLoading && (
                <span className="absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              )}
            </label>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 flex items-center gap-4 border-b border-border">
          <div
            className="-mb-px flex flex-1 gap-6 overflow-x-auto [scrollbar-width:none] md:gap-8"
            role="tablist"
            aria-label="Filter by food type"
          >
            {[["", "All food"] as const, ...FOOD_TYPES.map((t) => [t, t] as const)].map(
              ([value, label]) => (
                <button
                  key={value || "all"}
                  role="tab"
                  aria-selected={type === value}
                  onClick={() => setType(value)}
                  className={cn(
                    "shrink-0 border-b-2 pb-4 pt-1 text-sm font-semibold transition-colors",
                    type === value
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  {label}
                </button>
              ),
            )}
          </div>
          {filtered && (
            <button
              onClick={clear}
              className="mb-3 inline-flex shrink-0 items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" /> Clear
            </button>
          )}
        </Reveal>

        <div className="mt-10">
          {ready && !user ? (
            <div className="flex flex-col items-start gap-5 border border-border bg-card p-8 md:p-12">
              <p className="eyebrow text-muted-foreground">Members only</p>
              <h3 className="font-display text-2xl font-extrabold md:text-3xl">
                Log in to see what your neighbours are sharing.
              </h3>
              <p className="max-w-xl text-muted-foreground">
                Browsing and claiming food needs a free FoodShare account, so sharers know who is
                collecting their meal.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/login" search={{ redirect: "/" }}>
                    Log in
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/login" search={{ mode: "register", redirect: "/" }}>
                    Create an account
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <FoodGrid
              foods={data}
              user={user}
              isLoading={!ready || isLoading}
              error={error}
              onRetry={() => refetch()}
              featureFirst={!filtered}
              empty={
                <EmptyState
                  title={
                    filtered ? "Nothing matches that search." : "The table is empty — for now."
                  }
                  body={
                    filtered
                      ? "No food posts found. Try another search or a different food type."
                      : "No food posts yet. Be the first to share something good with your neighbours."
                  }
                  action={
                    filtered ? (
                      <Button variant="outline" onClick={clear}>
                        Clear filters
                      </Button>
                    ) : (
                      <Button asChild>
                        <Link to="/share">Share food</Link>
                      </Button>
                    )
                  }
                />
              }
            />
          )}
        </div>
      </div>
    </section>
  );
}
