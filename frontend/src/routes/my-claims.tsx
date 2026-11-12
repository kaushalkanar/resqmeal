import { createFileRoute } from "@tanstack/react-router";

import { AccountList } from "@/components/site/AccountList";

export const Route = createFileRoute("/my-claims")({
  head: () => ({
    meta: [
      { title: "My claims — FoodShare" },
      { name: "description", content: "See the food you've claimed and arrange pickup." },
      { property: "og:title", content: "My claims — FoodShare" },
      { property: "og:description", content: "See the food you've claimed on FoodShare." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <AccountList kind="claimed" />,
});
