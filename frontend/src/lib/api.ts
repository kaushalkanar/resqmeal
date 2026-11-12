// Client for the existing Spring Boot REST API. Endpoints, methods, payloads and
// cookie-based sessions (credentials: "include") are unchanged from the original app.
// The base URL defaults to the original value and can be overridden with VITE_API_URL.
export const API_URL: string =
  (import.meta.env["VITE_API_URL"] as string | undefined) ?? "http://localhost:8080/api";

export type User = {
  id?: number | string;
  username: string;
  email?: string;
  [key: string]: unknown;
};

export type Food = {
  id: number | string;
  foodName: string;
  description: string;
  quantity: number;
  foodType: string;
  pickupLocation: string;
  ownerPhone?: string | null;
  ownerUsername: string;
  availableUntil: string;
  status: string;
  claimedBy?: string | null;
  [key: string]: unknown;
};

export type NewFood = {
  foodName: string;
  description: string;
  quantity: number;
  foodType: string;
  pickupLocation: string;
  ownerPhone: string;
  availableUntil: string;
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
    });
  } catch {
    throw new Error(
      "Cannot reach the FoodShare server. Make sure the backend is running on port 8080.",
    );
  }

  if (response.status === 204) return null as T;

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error ||
        data.message ||
        (response.status === 401 || response.status === 403
          ? "Please log in again to continue."
          : `Request failed: ${response.status}`),
    );
  }

  return data as T;
}

export const api = {
  register: (data: { username: string; email: string; password: string }) =>
    request<unknown>("/auth/register", { method: "POST", body: JSON.stringify(data) }),

  login: (data: { username: string; password: string }) =>
    request<unknown>("/auth/login", { method: "POST", body: JSON.stringify(data) }),

  me: () => request<User>("/auth/me"),

  logout: () => request<null>("/auth/logout", { method: "POST" }),

  foods: (search = "", type = "") => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (type) params.set("type", type);
    return request<Food[]>(`/food?${params.toString()}`);
  },

  createFood: (data: NewFood) =>
    request<Food>("/food", { method: "POST", body: JSON.stringify(data) }),

  mine: () => request<Food[]>("/food/mine"),

  claimed: () => request<Food[]>("/food/claimed"),

  claim: (id: Food["id"]) => request<Food>(`/food/${id}/claim`, { method: "POST" }),

  deleteFood: (id: Food["id"]) => request<null>(`/food/${id}`, { method: "DELETE" }),
};
