import { Link } from "@tanstack/react-router";

import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="grain bg-deep text-deep-foreground">
      <div className="container-editorial relative z-10 py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo className="text-cream" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-deep-foreground/70">
              A neighbourhood platform for sharing surplus food — so good meals reach people instead
              of bins.
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="eyebrow text-sage">Platform</p>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link to="/" hash="discover" className="link-underline">
                  Browse food
                </Link>
              </li>
              <li>
                <Link to="/share" className="link-underline">
                  Share food
                </Link>
              </li>
              <li>
                <Link to="/" hash="how" className="link-underline">
                  How it works
                </Link>
              </li>
              <li>
                <Link to="/" hash="about" className="link-underline">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="eyebrow text-sage">Account</p>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link to="/login" className="link-underline">
                  Log in
                </Link>
              </li>
              <li>
                <Link to="/login" search={{ mode: "register" }} className="link-underline">
                  Create account
                </Link>
              </li>
              <li>
                <Link to="/my-posts" className="link-underline">
                  My posts
                </Link>
              </li>
              <li>
                <Link to="/my-claims" className="link-underline">
                  My claims
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow text-sage">Contact</p>
            <ul className="mt-5 space-y-3 text-sm text-deep-foreground/80">
              <li>
                <a href="mailto:hello@foodshare.community" className="link-underline">
                  hello@foodshare.community
                </a>
              </li>
              <li>Questions, partnerships or feedback — we read every message.</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-cream/15 pt-6 text-xs text-deep-foreground/60 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} FoodShare. Small acts of sharing make a big difference.
          </p>
          <p>Made for neighbours, everywhere.</p>
        </div>
      </div>
    </footer>
  );
}
