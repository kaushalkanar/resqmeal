import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import { useRef } from "react";

import heroTable from "@/assets/hero-table.jpg";
import heroHandover from "@/assets/hero-handover.jpg";
import { Button } from "@/components/ui/button";
import { ease } from "@/components/site/motion";
import { useFoods } from "@/lib/queries";

const lines = [
  { text: "Good Food", className: "" },
  { text: "Deserves", className: "" },
  { text: "Another Chance", className: "text-primary", stop: true },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const smallY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const { data } = useFoods("", "");
  const availableNow = data?.filter((f) => f.status === "AVAILABLE").length;

  return (
    <section ref={ref} className="relative overflow-hidden pt-28 md:pt-32 lg:pt-36">
      <div className="container-editorial grid gap-14 pb-16 md:pb-24 lg:grid-cols-12 lg:gap-8">
        <div className="relative z-10 flex flex-col lg:col-span-7 lg:pt-10">
          <motion.p
            className="eyebrow flex items-center gap-3 text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease }}
          >
            <span className="h-px w-10 bg-foreground/40" />
            Community food sharing
          </motion.p>

          <h1 className="text-display mt-7">
            {lines.map((line, i) => (
              <span key={line.text} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className={`block ${line.className}`}
                  initial={{ y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1.1, ease, delay: 0.15 + i * 0.12 }}
                >
                  {line.text}
                  {line.stop && <span className="text-accent">.</span>}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            className="mt-9 grid gap-8 md:grid-cols-[1fr_auto] md:items-end lg:max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.6 }}
          >
            <p className="max-w-md text-lg leading-relaxed text-foreground/75">
              Bringing communities together to share surplus food, reduce waste and make every meal
              count.
            </p>
          </motion.div>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.8 }}
          >
            <Button asChild size="xl" className="w-full sm:w-auto">
              <Link to="/" hash="discover">
                Explore food
                <ArrowDownRight />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline" className="w-full sm:w-auto">
              <Link to="/share">
                Share food
                <ArrowRight />
              </Link>
            </Button>
          </motion.div>

          <motion.ul
            className="mt-12 flex flex-wrap gap-x-8 gap-y-2 border-t border-border pt-5 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease, delay: 1.05 }}
          >
            <li>
              <span className="font-semibold text-foreground">Free</span> to share and claim
            </li>
            <li>
              <span className="font-semibold text-foreground">Local</span> pickups only
            </li>
            <li>
              <span className="font-semibold text-foreground">Neighbour</span> to neighbour
            </li>
          </motion.ul>
        </div>

        <div className="relative lg:col-span-5">
          <motion.figure
            className="relative ml-auto w-[88%] lg:w-full"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease, delay: 0.1 }}
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <motion.img
                src={heroTable}
                alt="Neighbours passing a bowl of biryani across a wooden table set with homemade dishes"
                width={1280}
                height={1600}
                fetchPriority="high"
                style={{ y: imgY, scale: 1.12 }}
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="eyebrow absolute -right-1 top-6 hidden origin-top-right translate-x-full rotate-90 whitespace-nowrap text-muted-foreground md:block">
              Fig. 01 — Sunday lunch, passed along
            </figcaption>
          </motion.figure>

          <motion.div
            className="absolute -bottom-6 left-0 w-[46%] border-[6px] border-background md:w-[40%] lg:-left-16 lg:bottom-16"
            style={{ y: smallY }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease, delay: 0.55 }}
          >
            <img
              src={heroHandover}
              alt="A paper bag of bread and oranges being handed over at a doorstep"
              width={1024}
              height={1024}
              className="aspect-square w-full object-cover"
            />
          </motion.div>

          {typeof availableNow === "number" && (
            <motion.div
              className="absolute right-4 top-4 bg-background px-4 py-3 md:right-6 md:top-6"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 1.1 }}
            >
              <p className="eyebrow text-muted-foreground">Available now</p>
              <p className="font-display text-2xl font-extrabold text-deep">
                {availableNow} {availableNow === 1 ? "listing" : "listings"}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
