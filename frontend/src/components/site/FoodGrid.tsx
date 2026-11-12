import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Food, User } from "@/lib/api";
import { API_URL } from "@/lib/api";
import { FoodCard } from "./FoodCard";

type Props = {
  foods: Food[] | undefined;
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  onRetry?: () => void;
  empty: ReactNode;
  featureFirst?: boolean | undefined;
};

export function FoodGrid({ foods, user, isLoading, error, onRetry, empty, featureFirst }: Props) {
  if (isLoading && !foods) {
    return (
      <div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        aria-busy="true"
        aria-label="Loading food"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border border-border bg-card">
            <div className="aspect-[4/3] animate-pulse bg-muted" />
            <div className="space-y-3 p-6">
              <div className="h-3 w-24 animate-pulse rounded-sm bg-muted" />
              <div className="h-6 w-3/4 animate-pulse rounded-sm bg-muted" />
              <div className="h-3 w-full animate-pulse rounded-sm bg-muted" />
              <div className="h-3 w-2/3 animate-pulse rounded-sm bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error && !foods) {
    return (
      <div className="flex flex-col items-start gap-4 border border-destructive/30 bg-card p-8 md:p-10">
        <AlertTriangle className="h-6 w-6 text-destructive" />
        <div>
          <h3 className="font-display text-2xl font-extrabold">We couldn't load food listings.</h3>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            {error.message}. Make sure the FoodShare server is running and reachable at{" "}
            <code className="rounded-sm bg-muted px-1.5 py-0.5 text-xs">{API_URL}</code>.
          </p>
        </div>
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            Try again
          </Button>
        )}
      </div>
    );
  }

  if (!foods || foods.length === 0) {
    return <>{empty}</>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {foods.map((food, i) => (
        <FoodCard
          key={food.id}
          food={food}
          user={user}
          index={i}
          featured={featureFirst && i === 0 && foods.length > 2}
        />
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="grid gap-8 border-y border-border py-16 md:grid-cols-12 md:py-20">
      <p className="text-numeral text-outline md:col-span-3">0</p>
      <div className="md:col-span-7">
        <h3 className="font-display text-3xl font-extrabold">{title}</h3>
        <p className="mt-3 max-w-lg text-muted-foreground">{body}</p>
        {action && <div className="mt-6">{action}</div>}
      </div>
    </div>
  );
}
