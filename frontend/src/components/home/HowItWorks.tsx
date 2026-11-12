import { motion } from "motion/react";

import vegetables from "@/assets/food-vegetables.jpg";
import { Reveal, ease } from "@/components/site/motion";

const steps = [
  {
    n: "01",
    title: "Share surplus food",
    body: "Cooked too much? Bought more than you need? Post it in under a minute — what it is, how much, where to collect it and until when.",
  },
  {
    n: "02",
    title: "Discover food nearby",
    body: "Browse what neighbours have listed. Search by name or filter by type — cooked meals, bakery, fruit, vegetables and more.",
  },
  {
    n: "03",
    title: "Connect and collect",
    body: "Claim a post, reach the sharer on the number they've provided and pick it up before it's gone. Good food, good company.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="bg-secondary py-20 md:py-28" aria-labelledby="how-title">
      <div className="container-editorial grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <p className="eyebrow text-primary">(03) How it works</p>
              <h2 id="how-title" className="text-headline mt-5 text-deep">
                From surplus to supper in three steps.
              </h2>
            </Reveal>
            <Reveal delay={0.15} className="img-zoom mt-10 hidden aspect-[5/4] lg:block">
              <img
                src={vegetables}
                alt="A woven basket of fresh carrots, spinach, tomatoes and cauliflower"
                loading="lazy"
                width={960}
                height={720}
                className="h-full w-full object-cover"
              />
            </Reveal>
          </div>
        </div>

        <ol className="lg:col-span-6 lg:col-start-7">
          {steps.map((s, i) => (
            <motion.li
              key={s.n}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.9, ease, delay: 0.05 }}
              className="grid grid-cols-[auto_1fr] gap-x-6 border-t border-deep/20 py-10 md:gap-x-10 md:py-14"
              style={{ marginLeft: `${i * 6}%` }}
            >
              <span className="text-numeral text-outline !text-[clamp(3rem,6vw,5.5rem)]">
                {s.n}
              </span>
              <div className="pt-2">
                <h3 className="font-display text-2xl font-extrabold text-deep md:text-3xl">
                  {s.title}
                </h3>
                <p className="mt-3 max-w-md leading-relaxed text-foreground/75">{s.body}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
