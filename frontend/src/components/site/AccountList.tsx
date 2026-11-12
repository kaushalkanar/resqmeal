import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { EmptyState, FoodGrid } from "./FoodGrid";
import { PageHeader, PageLoading, SignInPrompt } from "./PageHeader";
import { useMyClaims, useMyPosts, useSession } from "@/lib/queries";
import { cn } from "@/lib/utils";

type Kind = "mine" | "claimed";

export function AccountList({ kind }: { kind: Kind }) {
  const { user, ready } = useSession();
  const posts = useMyPosts(!!user && kind === "mine");
  const claims = useMyClaims(!!user && kind === "claimed");
  const q = kind === "mine" ? posts : claims;

  if (!ready) return <PageLoading />;
  if (!user)
    return (
      <SignInPrompt
        title={kind === "mine" ? "Log in to see your posts." : "Log in to see your claims."}
        body="Your posts and claims are tied to your FoodShare account."
        redirect={kind === "mine" ? "/my-posts" : "/my-claims"}
      />
    );

  return (
    <div className="container-editorial pb-24 pt-32 md:pt-40">
      <PageHeader
        eyebrow={`Signed in as ${user.username}`}
        title={kind === "mine" ? "My food posts." : "Food I've claimed."}
      >
        <Button asChild size="lg">
          <Link to="/share">Share food</Link>
        </Button>
      </PageHeader>

      <nav className="mt-8 flex gap-8 border-b border-border" aria-label="Account">
        {(
          [
            ["/my-posts", "My posts", "mine"],
            ["/my-claims", "My claims", "claimed"],
          ] as const
        ).map(([to, label, k]) => (
          <Link
            key={to}
            to={to}
            className={cn(
              "-mb-px border-b-2 pb-3 text-sm font-semibold transition-colors",
              kind === k
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-10">
        <FoodGrid
          foods={q.data}
          user={user}
          isLoading={q.isLoading}
          error={q.error}
          onRetry={() => q.refetch()}
          empty={
            kind === "mine" ? (
              <EmptyState
                title="You haven't shared any food yet."
                body="Got something extra? Post it and a neighbour can collect it today."
                action={
                  <Button asChild>
                    <Link to="/share">Share food</Link>
                  </Button>
                }
              />
            ) : (
              <EmptyState
                title="You haven't claimed any food yet."
                body="Browse what your neighbours are sharing right now."
                action={
                  <Button asChild>
                    <Link to="/" hash="discover">
                      Browse food
                    </Link>
                  </Button>
                }
              />
            )
          }
        />
      </div>
    </div>
  );
}
