import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";

import bakery from "@/assets/food-bakery.jpg";
import { Button } from "@/components/ui/button";
import { Field, inputClass, textareaClass } from "@/components/site/Field";
import { PageHeader, PageLoading, SignInPrompt } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/motion";
import { buildFoodPayload, emptyFood, FOOD_TYPES, type FoodFormValues } from "@/lib/food";
import { useCreateFood, useSession } from "@/lib/queries";

export const Route = createFileRoute("/share")({
  head: () => ({
    meta: [
      { title: "Share food — FoodShare" },
      {
        name: "description",
        content: "Post your surplus food in under a minute so a neighbour can collect it.",
      },
      { property: "og:title", content: "Share food — FoodShare" },
      {
        property: "og:description",
        content: "Cooked too much? Share it with someone nearby on FoodShare.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SharePage,
});

function SharePage() {
  const { user, ready } = useSession();
  if (!ready) return <PageLoading />;
  if (!user)
    return (
      <SignInPrompt
        title="Log in to share food."
        body="Create a free account or log in so neighbours know who is sharing and how to reach you."
        redirect="/share"
      />
    );
  return <FoodForm />;
}

function FoodForm() {
  const navigate = useNavigate();
  const create = useCreateFood();
  const [form, setForm] = useState<FoodFormValues>(emptyFood);
  const [error, setError] = useState("");

  function update(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const payload = buildFoodPayload(form);
      await create.mutateAsync(payload);
      setForm(emptyFood);
      toast.success("Your food post has been created!", {
        action: { label: "View my posts", onClick: () => navigate({ to: "/my-posts" }) },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div className="container-editorial pb-24 pt-32 md:pt-40">
      <PageHeader
        eyebrow="Share food"
        title={
          <>
            Share leftover food<span className="text-accent">.</span>
          </>
        }
        body="Tell neighbours what you have, how much, and where and until when they can collect it."
      />

      <div className="mt-12 grid gap-14 lg:grid-cols-12">
        <Reveal className="order-2 lg:order-1 lg:col-span-4">
          <div className="img-zoom aspect-[4/5]">
            <img
              src={bakery}
              alt="A basket of fresh bread and buns"
              loading="lazy"
              width={960}
              height={720}
              className="h-full w-full object-cover"
            />
          </div>
          <ul className="mt-8 space-y-4 text-sm text-muted-foreground">
            <li className="border-t border-border pt-4">
              <span className="font-semibold text-foreground">Be specific.</span> “Veg pulao, 4
              portions, made at lunch” helps people decide quickly.
            </li>
            <li className="border-t border-border pt-4">
              <span className="font-semibold text-foreground">Pick a clear spot.</span> A gate,
              lobby or landmark makes pickup easy.
            </li>
            <li className="border-t border-border pt-4">
              <span className="font-semibold text-foreground">Add a phone number</span> so the
              person who claims it can reach you.
            </li>
          </ul>
        </Reveal>

        <Reveal delay={0.1} className="order-1 lg:order-2 lg:col-span-7 lg:col-start-6">
          <form onSubmit={submit} className="space-y-6 border border-border bg-card p-6 md:p-10">
            <Field label="Food name">
              <input
                name="foodName"
                value={form.foodName}
                onChange={update}
                maxLength={120}
                required
                placeholder="e.g. Vegetable biryani"
                className={inputClass}
              />
            </Field>

            <Field label="Description">
              <textarea
                name="description"
                value={form.description}
                onChange={update}
                maxLength={1000}
                required
                rows={3}
                placeholder="What is it, when was it made, any allergens?"
                className={textareaClass}
              />
            </Field>

            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Quantity">
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={update}
                  min="1"
                  required
                  className={inputClass}
                />
              </Field>
              <Field label="Food type">
                <select
                  name="foodType"
                  value={form.foodType}
                  onChange={update}
                  className={inputClass}
                >
                  {FOOD_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Pickup location">
              <input
                name="pickupLocation"
                value={form.pickupLocation}
                onChange={update}
                maxLength={255}
                required
                placeholder="e.g. Gate 2, Green Park Apartments"
                className={inputClass}
              />
            </Field>

            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Contact phone number" hint="Optional, shown on your post.">
                <input
                  type="tel"
                  name="ownerPhone"
                  value={form.ownerPhone}
                  onChange={update}
                  placeholder="e.g. 9876543210"
                  maxLength={30}
                  className={inputClass}
                />
              </Field>
              <Field label="Available until">
                <input
                  type="datetime-local"
                  name="availableUntil"
                  value={form.availableUntil}
                  onChange={update}
                  required
                  className={inputClass}
                />
              </Field>
            </div>

            {error && (
              <p
                role="alert"
                className="border-l-2 border-destructive bg-destructive/5 px-4 py-3 text-sm text-destructive"
              >
                {error}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <Link
                to="/my-posts"
                className="link-underline text-sm font-semibold text-muted-foreground"
              >
                View my posts
              </Link>
              <Button type="submit" size="xl" disabled={create.isPending}>
                {create.isPending ? "Publishing…" : "Publish food post"}
              </Button>
            </div>
          </form>
        </Reveal>
      </div>
    </div>
  );
}
