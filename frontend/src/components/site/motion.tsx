import { animate, motion, useInView, useReducedMotion, type Variants } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

export const ease = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};

export const stagger = (gap = 0.09, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article" | "header";
};

/** Fades and lifts content in once when it enters the viewport. */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: { opacity: 0, y: 28 },
        show: { opacity: 1, y: 0, transition: { duration: 0.9, ease, delay } },
      }}
    >
      {children}
    </Comp>
  );
}

/** Container whose motion children (using `fadeUp`) appear one after another. */
export function Stagger({
  children,
  className,
  gap = 0.09,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  gap?: number;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={stagger(gap, delay)}
    >
      {children}
    </motion.div>
  );
}

/** Counts up to `value` the first time it scrolls into view. */
export function Counter({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView) return;
    if (reduce) {
      node.textContent = value.toLocaleString();
      return;
    }
    const controls = animate(0, value, {
      duration: 1.8,
      ease,
      onUpdate: (v) => {
        node.textContent = Math.round(v).toLocaleString();
      },
    });
    return () => controls.stop();
  }, [inView, value, reduce]);

  return (
    <span ref={ref} className={className}>
      0
    </span>
  );
}
