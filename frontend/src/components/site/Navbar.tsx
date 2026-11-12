import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout, useSession } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { ease } from "./motion";

const sections = [
  { hash: "discover", label: "Browse Food" },
  { hash: "how", label: "How It Works" },
  { hash: "about", label: "About" },
] as const;

export function Navbar() {
  const { user, ready } = useSession();
  const logout = useLogout();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  async function handleLogout() {
    await logout();
    toast.success("You've been logged out.");
    navigate({ to: "/" });
  }

  const solid = scrolled || pathname !== "/" || open;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500",
          solid ? "bg-background/95 shadow-nav backdrop-blur-sm" : "bg-transparent",
        )}
      >
        <div className="container-editorial flex h-[4.5rem] items-center justify-between gap-6">
          <Link to="/" className="text-deep" aria-label="FoodShare home">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-9 lg:flex" aria-label="Main">
            {sections.map((s) => (
              <Link
                key={s.hash}
                to="/"
                hash={s.hash}
                className="link-underline pb-0.5 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                {s.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            {!ready ? (
              <span className="h-10 w-40" aria-hidden="true" />
            ) : user ? (
              <>
                <Button asChild variant="default">
                  <Link to="/share">Share food</Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-1.5">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-secondary font-display text-xs font-bold uppercase text-deep">
                        {user.username.slice(0, 1)}
                      </span>
                      {user.username}
                      <ChevronDown className="opacity-60" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 rounded-sm">
                    <DropdownMenuLabel className="eyebrow text-muted-foreground">
                      Your account
                    </DropdownMenuLabel>
                    <DropdownMenuItem onSelect={() => navigate({ to: "/my-posts" })}>
                      My posts
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => navigate({ to: "/my-claims" })}>
                      My claims
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={handleLogout}>Log out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild variant="default">
                  <Link to="/login" search={{ mode: "register" }}>
                    Get started
                  </Link>
                </Button>
              </>
            )}
          </div>

          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-sm text-foreground transition-colors hover:bg-muted active:scale-95 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease }}
            className="grain fixed inset-x-0 bottom-0 top-[4.5rem] z-40 overflow-y-auto bg-background lg:hidden"
          >
            <motion.nav
              className="container-editorial flex flex-col pt-6"
              aria-label="Mobile"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
            >
              {sections.map((s, i) => (
                <motion.div
                  key={s.hash}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
                  }}
                >
                  <Link
                    to="/"
                    hash={s.hash}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between border-b py-5 font-display text-3xl font-extrabold tracking-tight"
                  >
                    {s.label}
                    <span className="eyebrow text-muted-foreground">0{i + 1}</span>
                  </Link>
                </motion.div>
              ))}

              <motion.div
                className="mt-8 flex flex-col gap-3 pb-10"
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
                }}
              >
                {user ? (
                  <>
                    <p className="eyebrow mb-1 text-muted-foreground">
                      Signed in as {user.username}
                    </p>
                    <Button asChild size="lg">
                      <Link to="/share">Share food</Link>
                    </Button>
                    <div className="grid grid-cols-2 gap-3">
                      <Button asChild size="lg" variant="outline">
                        <Link to="/my-posts">My posts</Link>
                      </Button>
                      <Button asChild size="lg" variant="outline">
                        <Link to="/my-claims">My claims</Link>
                      </Button>
                    </div>
                    <Button size="lg" variant="ghost" onClick={handleLogout}>
                      Log out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild size="lg">
                      <Link to="/login" search={{ mode: "register" }}>
                        Get started
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                      <Link to="/login">Log in</Link>
                    </Button>
                  </>
                )}
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
