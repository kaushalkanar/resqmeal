<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- This app is a frontend only; all data comes from the user's existing Spring Boot REST API through `src/lib/api.ts` (cookie session, `credentials: "include"`). Why: the backend must never be changed or replaced.
- Do not add Lovable Cloud, Supabase, Firebase, server functions or mock data for app features. Why: the existing REST API is the single source of truth.
- Fetch API data client-side with TanStack Query hooks in `src/lib/queries.ts`, not route loaders. Why: the API runs on the user's machine and uses browser cookies, so SSR cannot reach it.
- The API base URL comes from `VITE_API_URL`, defaulting to the original `http://localhost:8080/api`. Why: keeps the original wiring while allowing other hosts.
- Business rules (who can claim/delete, post payload shape, impact numbers) live in `src/lib/food.ts` with tests in `src/lib/food.test.ts`.
- Scroll/entrance animation uses `motion` helpers in `src/components/site/motion.tsx` under `MotionConfig reducedMotion="user"`. Why: one consistent motion language that respects reduced-motion settings.
