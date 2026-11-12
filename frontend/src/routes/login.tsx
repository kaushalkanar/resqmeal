import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";

import handover from "@/assets/hero-handover.jpg";
import { Button } from "@/components/ui/button";
import { Field, inputClass } from "@/components/site/Field";
import { ease } from "@/components/site/motion";
import { api } from "@/lib/api";
import { keys } from "@/lib/queries";
import { cn } from "@/lib/utils";

type Mode = "login" | "register";

export const Route = createFileRoute("/login")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { mode?: Mode | undefined; redirect?: string | undefined } => ({
    mode: search["mode"] === "register" ? "register" : undefined,
    redirect: typeof search["redirect"] === "string" ? search["redirect"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Log in or join — FoodShare" },
      {
        name: "description",
        content:
          "Log in to FoodShare or create an account to share and claim food in your community.",
      },
      { property: "og:title", content: "Log in or join — FoodShare" },
      {
        property: "og:description",
        content: "Connect with your community and help reduce food waste.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [mode, setMode] = useState<Mode>(search.mode ?? "login");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState<{ kind: "error" | "success"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  function update(e: ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function switchMode(next: Mode) {
    setMode(next);
    setMessage(null);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    setBusy(true);
    try {
      if (mode === "register") {
        await api.register(form);
        setMode("login");
        setMessage({ kind: "success", text: "Registration successful. Please log in." });
      } else {
        await api.login({ username: form.username, password: form.password });
        await qc.invalidateQueries({ queryKey: keys.me });
        const me = await qc.fetchQuery({ queryKey: keys.me, queryFn: api.me });
        toast.success(`Welcome back, ${me?.username ?? form.username}.`);
        const to = search.redirect && search.redirect.startsWith("/") ? search.redirect : "/";
        navigate({ to });
      }
    } catch (err) {
      setMessage({
        kind: "error",
        text: err instanceof Error ? err.message : "Something went wrong.",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <motion.img
          src={handover}
          alt="A bag of fresh bread and oranges being handed to a neighbour"
          width={1024}
          height={1024}
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="bg-overlay-deep absolute inset-0" />
        <div className="absolute bottom-0 left-0 p-14 text-cream">
          <p className="eyebrow text-sage">FoodShare</p>
          <p className="mt-4 max-w-md font-display text-4xl font-extrabold leading-tight tracking-tight">
            Share food, spread kindness.
          </p>
        </div>
      </div>

      <div className="flex items-center px-5 pb-16 pt-28 md:px-12 lg:px-20">
        <motion.div
          className="mx-auto w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
        >
          <h1 className="text-headline">
            {mode === "login" ? "Welcome back." : "Join your neighbours."}
          </h1>
          <p className="mt-4 text-muted-foreground">
            Connect with your community and help reduce food waste.
          </p>

          <div className="mt-10 flex gap-8 border-b border-border" role="tablist">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                onClick={() => switchMode(m)}
                className={cn(
                  "-mb-px border-b-2 pb-3 text-sm font-semibold transition-colors",
                  mode === m
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {m === "login" ? "Log in" : "Register"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <Field label="Username">
              <input
                name="username"
                value={form.username}
                onChange={update}
                minLength={3}
                maxLength={100}
                required
                autoComplete="username"
                className={inputClass}
              />
            </Field>

            {mode === "register" && (
              <Field label="Email">
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={update}
                  required
                  autoComplete="email"
                  className={inputClass}
                />
              </Field>
            )}

            <Field
              label="Password"
              hint={mode === "register" ? "At least 8 characters." : undefined}
            >
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={update}
                minLength={8}
                maxLength={72}
                required
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                className={inputClass}
              />
            </Field>

            {message && (
              <p
                role={message.kind === "error" ? "alert" : "status"}
                className={cn(
                  "border-l-2 px-4 py-3 text-sm",
                  message.kind === "error"
                    ? "border-destructive bg-destructive/5 text-destructive"
                    : "border-primary bg-secondary text-deep",
                )}
              >
                {message.text}
              </p>
            )}

            <Button type="submit" size="xl" className="w-full" disabled={busy}>
              {busy ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
            </Button>
          </form>

          <p className="mt-8 text-sm text-muted-foreground">
            Not ready yet?{" "}
            <Link to="/" hash="discover" className="link-underline font-semibold text-primary">
              Back to the home page
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
