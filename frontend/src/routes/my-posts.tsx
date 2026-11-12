import { createFileRoute } from "@tanstack/react-router";

import { AccountList } from "@/components/site/AccountList";

export const Route = createFileRoute("/my-posts")({
  head: () => ({
    meta: [
      { title: "My posts — FoodShare" },
      { name: "description", content: "Manage the food you've shared with your community." },
      { property: "og:title", content: "My posts — FoodShare" },
      { property: "og:description", content: "Manage the food you've shared on FoodShare." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <AccountList kind="mine" />,
});
