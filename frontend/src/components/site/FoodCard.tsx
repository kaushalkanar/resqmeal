import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Clock, MapPin, Phone, User as UserIcon, Package } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { Food, User } from "@/lib/api";
import { canClaim, formatDateTime, formatStatus, imageForType, isOwner } from "@/lib/food";
import { useClaimFood, useDeleteFood } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { ease } from "./motion";

type Props = {
  food: Food;
  user: User | null;
  index?: number;
  featured?: boolean | undefined;
};

export function FoodCard({ food, user, index = 0, featured = false }: Props) {
  const navigate = useNavigate();
  const claim = useClaimFood();
  const remove = useDeleteFood();
  const [confirm, setConfirm] = useState<null | "claim" | "delete">(null);

  const owner = isOwner(food, user);
  const claimable = canClaim(food, user);
  const available = food.status === "AVAILABLE";

  function startClaim() {
    if (!user) {
      toast("Please log in before claiming food.", {
        action: { label: "Log in", onClick: () => navigate({ to: "/login" }) },
      });
      return;
    }
    setConfirm("claim");
  }

  async function runConfirmed() {
    const action = confirm;
    setConfirm(null);
    try {
      if (action === "claim") {
        await claim.mutateAsync(food.id);
        toast.success("Food claimed successfully!", {
          description: "Contact the sharer to arrange pickup.",
        });
      } else if (action === "delete") {
        await remove.mutateAsync(food.id);
        toast.success("Your post has been deleted.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const busy = claim.isPending || remove.isPending;

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, ease, delay: (index % 3) * 0.08 }}
      className={cn(
        "group flex flex-col border border-border bg-card transition-[transform,box-shadow] duration-500 ease-[var(--ease-editorial)] hover:-translate-y-1 hover:shadow-lift",
        featured && "md:col-span-2 md:grid md:grid-cols-2",
      )}
    >
      <div
        className={cn(
          "img-zoom relative",
          featured ? "aspect-[4/3] md:aspect-auto md:min-h-[22rem]" : "aspect-[4/3]",
        )}
      >
        <img
          src={imageForType(food.foodType)}
          alt={`${food.foodType} — ${food.foodName}`}
          loading="lazy"
          width={960}
          height={720}
          className={cn("h-full w-full object-cover", featured && "md:absolute md:inset-0")}
        />
        <span
          className={cn(
            "absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em]",
            available ? "bg-background text-deep" : "bg-ink text-cream",
          )}
        >
          <span
            className={cn("h-1.5 w-1.5 rounded-full", available ? "bg-primary" : "bg-accent")}
          />
          {formatStatus(food.status)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="eyebrow text-primary">{food.foodType}</p>
          <p className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Package className="h-3.5 w-3.5" />
            Qty {food.quantity}
          </p>
        </div>

        <h3
          className={cn(
            "mt-3 font-display font-extrabold leading-tight",
            featured ? "text-3xl md:text-4xl" : "text-2xl",
          )}
        >
          {food.foodName}
        </h3>
        {food.description && (
          <p
            className={cn(
              "mt-2 text-sm leading-relaxed text-muted-foreground",
              !featured && "line-clamp-2",
            )}
          >
            {food.description}
          </p>
        )}

        <div className="rule-dotted my-5" />

        <dl className="grid gap-2.5 text-sm">
          <Meta icon={<MapPin />} label="Pickup">
            {food.pickupLocation}
          </Meta>
          <Meta icon={<Clock />} label="Until">
            {formatDateTime(food.availableUntil)}
          </Meta>
          <Meta icon={<UserIcon />} label="Shared by">
            {owner ? "You" : food.ownerUsername}
          </Meta>
          {food.ownerPhone && (
            <Meta icon={<Phone />} label="Contact">
              <a
                href={`tel:${food.ownerPhone}`}
                className="link-underline font-medium text-primary"
              >
                {food.ownerPhone}
              </a>
            </Meta>
          )}
          {food.claimedBy && (
            <Meta icon={<UserIcon />} label="Claimed by">
              {food.claimedBy}
            </Meta>
          )}
        </dl>

        <div className="mt-auto pt-6">
          {claimable && (
            <Button className="w-full" size="lg" onClick={startClaim} disabled={busy}>
              {claim.isPending ? "Claiming…" : "Claim food"}
            </Button>
          )}
          {owner && (
            <Button
              className="w-full"
              size="lg"
              variant="outline"
              onClick={() => setConfirm("delete")}
              disabled={busy}
            >
              {remove.isPending ? "Deleting…" : "Delete my post"}
            </Button>
          )}
          {!claimable && !owner && !user && available && (
            <Button asChild className="w-full" size="lg" variant="outline">
              <Link to="/login">Log in to claim</Link>
            </Button>
          )}
        </div>
      </div>

      <AlertDialog open={confirm !== null} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent className="rounded-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-2xl font-extrabold">
              {confirm === "delete" ? "Delete this food post?" : "Do you want to claim this food?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirm === "delete"
                ? `“${food.foodName}” will be removed for everyone.`
                : `You're claiming “${food.foodName}” for pickup at ${food.pickupLocation}.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-sm">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={runConfirmed}
              className={cn(
                "rounded-sm",
                confirm === "delete" &&
                  "bg-destructive text-destructive-foreground hover:bg-destructive/90",
              )}
            >
              {confirm === "delete" ? "Delete" : "Claim food"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.article>
  );
}

function Meta({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[1.25rem_5.5rem_1fr] items-start gap-1">
      <span className="mt-0.5 text-sage [&_svg]:h-4 [&_svg]:w-4">{icon}</span>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{children}</dd>
    </div>
  );
}
