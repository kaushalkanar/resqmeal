import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Reveal } from "./motion";

export function PageHeader({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  body?: string;
  children?: ReactNode;
}) {
  return (
    <Reveal className="grid gap-8 border-b border-border pb-10 md:grid-cols-12 md:items-end md:pb-14">
      <div className="md:col-span-8">
        <p className="eyebrow text-muted-foreground">{eyebrow}</p>
        <h1 className="text-headline mt-5">{title}</h1>
        {body && <p className="mt-5 max-w-xl text-lg text-muted-foreground">{body}</p>}
      </div>
      {children && <div className="md:col-span-4 md:justify-self-end">{children}</div>}
    </Reveal>
  );
}

export function SignInPrompt({
  title,
  body,
  redirect,
}: {
  title: string;
  body: string;
  redirect: string;
}) {
  return (
    <div className="container-editorial pb-24 pt-32 md:pt-40">
      <PageHeader eyebrow="Members only" title={title} body={body} />
      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link to="/login" search={{ redirect }}>
            Log in
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/login" search={{ mode: "register", redirect }}>
            Create an account
          </Link>
        </Button>
      </div>
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="container-editorial pb-24 pt-32 md:pt-40" aria-busy="true">
      <div className="h-3 w-32 animate-pulse rounded-sm bg-muted" />
      <div className="mt-6 h-14 w-2/3 animate-pulse rounded-sm bg-muted" />
      <div className="mt-4 h-4 w-1/2 animate-pulse rounded-sm bg-muted" />
    </div>
  );
}
