import { createFileRoute } from "@tanstack/react-router";

import { Hero } from "@/components/home/Hero";
import { Impact } from "@/components/home/Impact";
import { Discovery } from "@/components/home/Discovery";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Story } from "@/components/home/Story";
import { FinalCta } from "@/components/home/FinalCta";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ResQMeal — Good Food Deserves Another Chance" },
      {
        name: "description",
        content:
          "Bringing communities together to share surplus food, reduce waste and make every meal count.",
      },
      { property: "og:title", content: "ResQMeal — Good Food Deserves Another Chance" },
      {
        property: "og:description",
        content:
          "Share surplus food with neighbours, discover meals nearby and collect them locally.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <Impact />
      <Discovery />
      <HowItWorks />
      <Story />
      <FinalCta />
    </>
  );
}
