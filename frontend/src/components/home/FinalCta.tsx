import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";

import street from "@/assets/cta-street.jpg";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/motion";
import { useSession } from "@/lib/queries";

export function FinalCta() {
  const { user } = useSession();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section ref={ref} className="relative overflow-hidden" aria-labelledby="cta-title">
      <motion.img
        src={street}
        alt=""
        aria-hidden="true"
        loading="lazy"
        width={1600}
        height={912}
        style={{ y, scale: 1.2 }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="bg-overlay-deep absolute inset-0" />
      <div className="container-editorial relative py-28 md:py-40">
        <Reveal className="max-w-2xl text-cream">
          <p className="eyebrow text-sage">(05) Join in</p>
          <h2 id="cta-title" className="text-headline mt-5">
            Your extra could be someone's dinner tonight.
          </h2>
          <p className="mt-6 max-w-md text-lg text-cream/80">
            Share what you won't use, claim what you will. It takes a minute and it means a lot.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="xl" variant="accent">
              <Link to="/share">
                Share food <ArrowRight />
              </Link>
            </Button>
            {user ? (
              <Button asChild size="xl" variant="outline-cream">
                <Link to="/" hash="discover">
                  Browse food
                </Link>
              </Button>
            ) : (
              <Button asChild size="xl" variant="outline-cream">
                <Link to="/login" search={{ mode: "register" }}>
                  Join the community
                </Link>
              </Button>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
