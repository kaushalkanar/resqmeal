import { describe, expect, it } from "vitest";

import type { Food } from "./api";
import { buildFoodPayload, canClaim, computeImpact, emptyFood } from "./food";

const base: Food = {
  id: 1,
  foodName: "Dal",
  description: "Fresh",
  quantity: 2,
  foodType: "Cooked Food",
  pickupLocation: "Block A",
  ownerUsername: "asha",
  availableUntil: "2030-01-01T10:00:00",
  status: "AVAILABLE",
};

describe("claiming rules", () => {
  it("lets another user claim an available post", () => {
    expect(canClaim(base, { username: "ravi" })).toBe(true);
  });
  it("does not let the owner claim their own post", () => {
    expect(canClaim(base, { username: "asha" })).toBe(false);
  });
  it("does not allow claiming a post that is already claimed", () => {
    expect(canClaim({ ...base, status: "CLAIMED" }, { username: "ravi" })).toBe(false);
  });
});

describe("food post payload", () => {
  const now = new Date(2026, 10, 5, 10, 0, 0);

  it("rejects an availability time in the past", () => {
    expect(() =>
      buildFoodPayload({ ...emptyFood, availableUntil: "2026-11-05T09:00" }, now),
    ).toThrow("Choose a future availability time.");
  });

  it("sends quantity as a number and the deadline without timezone suffix", () => {
    const payload = buildFoodPayload(
      { ...emptyFood, quantity: "3", availableUntil: "2026-11-06T12:30" },
      now,
    );
    expect(payload.quantity).toBe(3);
    expect(payload.availableUntil).toBe("2026-11-06T12:30:00");
  });
});

describe("impact numbers", () => {
  it("counts posts, claimed posts and distinct people from real listings", () => {
    const impact = computeImpact([
      base,
      { ...base, id: 2, status: "CLAIMED", claimedBy: "ravi" },
      { ...base, id: 3, ownerUsername: "meena" },
    ]);
    expect(impact).toEqual({ mealsShared: 3, claimed: 1, members: 3 });
  });
});
