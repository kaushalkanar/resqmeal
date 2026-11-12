# FoodShare – Lovable frontend + Spring Boot backend

```
food-sharing/
├── backend/    Spring Boot 3 + MySQL (your original code, unchanged)
└── frontend/   Lovable project (TanStack Start + React + Tailwind + shadcn/ui)
```

## 1. Database (once)
```sql
CREATE DATABASE food_sharing_db;
CREATE USER 'food_app'@'localhost' IDENTIFIED BY 'FoodShareLocal@123';
GRANT ALL ON food_sharing_db.* TO 'food_app'@'localhost';
```
(These match `backend/src/main/resources/application.properties`.)

## 2. Backend – http://localhost:8080
```bash
cd backend
./mvnw spring-boot:run        # Windows: mvnw.cmd spring-boot:run
```

## 3. Frontend – http://localhost:5173
```bash
cd frontend
bun install      # or: npm install
bun run dev      # or: npm run dev
```
Open **http://localhost:5173** (use `localhost`, not 127.0.0.1 — the backend's CORS only
allows `http://localhost:5173`; the dev server is pinned to that port for this reason).

## Notes on how the frontend meets the backend
- The backend only serves the food list to logged-in users, so the home page shows a
  "Log in to see what your neighbours are sharing" prompt to visitors and loads food after login.
- "Available until" is sent as local date-time (the backend uses `LocalDateTime`).
- API client: `frontend/src/lib/api.ts` (cookie session, `credentials: "include"`).
  Override the URL with `VITE_API_URL` (see `.env.example`).
