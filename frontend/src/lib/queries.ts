import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, type Food, type User } from "./api";

export const keys = {
  me: ["auth", "me"] as const,
  foods: (search: string, type: string) => ["foods", search, type] as const,
  mine: ["foods", "mine"] as const,
  claimed: ["foods", "claimed"] as const,
};

/** Session check (GET /auth/me). Resolves to null when not signed in. */
export function useSession() {
  const query = useQuery<User | null>({
    queryKey: keys.me,
    queryFn: async () => {
      try {
        return await api.me();
      } catch {
        return null;
      }
    },
    staleTime: 60_000,
    retry: false,
  });
  return { user: query.data ?? null, ready: query.isFetched, refetch: query.refetch };
}

/**
 * The backend only serves GET /food to logged-in users (anything else is a 403),
 * so the list is fetched only once a session exists.
 */
export function useFoods(search: string, type: string) {
  const { user } = useSession();
  return useQuery<Food[]>({
    queryKey: keys.foods(search, type),
    queryFn: () => api.foods(search, type),
    enabled: !!user,
    placeholderData: (prev) => prev,
    retry: 1,
  });
}

export function useMyPosts(enabled: boolean) {
  return useQuery<Food[]>({ queryKey: keys.mine, queryFn: api.mine, enabled });
}

export function useMyClaims(enabled: boolean) {
  return useQuery<Food[]>({ queryKey: keys.claimed, queryFn: api.claimed, enabled });
}

function useRefreshFoods() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ["foods"] });
}

export function useClaimFood() {
  const refresh = useRefreshFoods();
  return useMutation({ mutationFn: (id: Food["id"]) => api.claim(id), onSuccess: refresh });
}

export function useDeleteFood() {
  const refresh = useRefreshFoods();
  return useMutation({ mutationFn: (id: Food["id"]) => api.deleteFood(id), onSuccess: refresh });
}

export function useCreateFood() {
  const refresh = useRefreshFoods();
  return useMutation({ mutationFn: api.createFood, onSuccess: refresh });
}

export function useLogout() {
  const qc = useQueryClient();
  return async () => {
    try {
      await api.logout();
    } finally {
      qc.setQueryData(keys.me, null);
      qc.removeQueries({ queryKey: ["foods"] });
    }
  };
}
