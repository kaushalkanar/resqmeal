
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <img
      src="/resqmeal-logo.png"
      alt="ResQMeal Logo"
      className={cn(
        "h-16 w-16 shrink-0 object-contain",
        className
      )}
    />
  );
}
