import type { ReactNode } from "react";

export const inputClass =
  "mt-2 block h-12 w-full rounded-sm border border-input bg-card px-4 text-[0.95rem] text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/15";

export const textareaClass = inputClass.replace("h-12", "min-h-28 py-3 leading-relaxed");

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string | undefined;
  children: ReactNode;
  className?: string | undefined;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="text-sm font-semibold text-foreground">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}
