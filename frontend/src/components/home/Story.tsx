import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import kitchen from "@/assets/community-kitchen.jpg";
import { Reveal } from "@/components/site/motion";

export function Story() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section id="about" className="py-20 md:py-32" aria-labelledby="about-title">
      <div className="container-editorial">
        <Reveal className="grid gap-6 md:grid-cols-12">
          <p className="eyebrow text-muted-foreground md:col-span-3">(04) About FoodShare</p>
          <h2 id="about-title" className="text-headline md:col-span-9">
            Waste less. Feed more. <span className="text-primary">Know your neighbours.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-7">
            <div ref={ref} className="relative aspect-[3/2] overflow-hidden">
              <motion.img
                src={kitchen}
                alt="Volunteers packing fresh vegetables, bread and cooked meals into containers"
                loading="lazy"
                width={1600}
                height={1072}
                style={{ y, scale: 1.18 }}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="eyebrow mt-4 text-muted-foreground">
              Fig. 02 — Packing the day's surplus
            </p>
          </Reveal>

          <div className="flex flex-col justify-between gap-10 lg:col-span-4 lg:col-start-9">
            <Reveal delay={0.1} className="space-y-5 text-lg leading-relaxed text-foreground/80">
              <p>
                Every day, perfectly good food is thrown away — the extra portions from a family
                dinner, the bread left at closing time, the fruit that won't keep until the weekend.
              </p>
              <p>
                FoodShare makes it simple to pass that food on to someone nearby who'll enjoy it. No
                middlemen, no fees — just neighbours looking out for each other.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <blockquote className="border-l-2 border-accent pl-6 font-display text-2xl font-bold leading-snug tracking-tight text-deep md:text-[1.7rem]">
                Every portion shared is one less thrown away — and one more conversation between
                neighbours.
              </blockquote>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
