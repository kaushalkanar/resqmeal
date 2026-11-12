import { cn } from "@/lib/utils";

/** Two halves of a plate meeting — the act of sharing. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 32 32" aria-hidden="true" className="h-7 w-7 shrink-0">
        <path d="M15 4a12 12 0 0 0 0 24Z" className="fill-current" />
        <path d="M18 7.2a9 9 0 0 1 0 17.6Z" className="fill-accent" />
      </svg>
      <span className="font-display text-[1.2rem] font-extrabold tracking-[-0.04em]">
        FoodShare
      </span>
    </span>
  );
}
