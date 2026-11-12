import type { Food, NewFood, User } from "./api";

import cookedImg from "@/assets/food-cooked.jpg";
import fruitsImg from "@/assets/food-fruits.jpg";
import bakeryImg from "@/assets/food-bakery.jpg";
import packagedImg from "@/assets/food-packaged.jpg";
import vegetablesImg from "@/assets/food-vegetables.jpg";
import otherImg from "@/assets/food-other.jpg";

export const FOOD_TYPES = [
  "Cooked Food",
  "Fruits",
  "Bakery",
  "Packaged Food",
  "Vegetables",
  "Other",
] as const;

const IMAGES: Record<string, string> = {
  "Cooked Food": cookedImg,
  Fruits: fruitsImg,
  Bakery: bakeryImg,
  "Packaged Food": packagedImg,
  Vegetables: vegetablesImg,
  Other: otherImg,
};

export function imageForType(type: string): string {
  return IMAGES[type] ?? otherImg;
}

export function isOwner(food: Food, user: User | null | undefined): boolean {
  return !!user && food.ownerUsername === user.username;
}

/** Same rule as the original app: only non-owners can claim, and only AVAILABLE posts. */
export function canClaim(food: Food, user: User | null | undefined): boolean {
  return !isOwner(food, user) && food.status === "AVAILABLE";
}

export type FoodFormValues = {
  foodName: string;
  description: string;
  quantity: number | string;
  foodType: string;
  pickupLocation: string;
  ownerPhone: string;
  availableUntil: string;
};

export const emptyFood: FoodFormValues = {
  foodName: "",
  description: "",
  quantity: 1,
  foodType: "Cooked Food",
  pickupLocation: "",
  ownerPhone: "",
  availableUntil: "",
};

function toLocalDateTime(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

/** Validates and converts the form into the exact payload the backend expects. */
export function buildFoodPayload(form: FoodFormValues, now: Date = new Date()): NewFood {
  const deadline = new Date(form.availableUntil);
  if (Number.isNaN(deadline.getTime()) || deadline <= now) {
    throw new Error("Choose a future availability time.");
  }
  return {
    ...form,
    quantity: Number(form.quantity),
    // Local wall-clock time, no timezone: the backend stores/compares LocalDateTime.
    availableUntil: toLocalDateTime(deadline),
  };
}

export type Impact = {
  mealsShared: number;
  claimed: number;
  members: number;
};

/** Derives impact numbers only from real listings returned by the API. */
export function computeImpact(foods: Food[]): Impact {
  const people = new Set<string>();
  let claimed = 0;
  for (const food of foods) {
    if (food.ownerUsername) people.add(food.ownerUsername);
    if (food.claimedBy) people.add(food.claimedBy);
    if (food.status === "CLAIMED" || !!food.claimedBy) claimed += 1;
  }
  return { mealsShared: foods.length, claimed, members: people.size };
}

export function formatDateTime(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatStatus(status: string): string {
  if (!status) return "";
  return status.charAt(0) + status.slice(1).toLowerCase().replace(/_/g, " ");
}
