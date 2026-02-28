# Secure Task Management Dashboard

Full-stack task management application with JWT authentication, protected APIs, and a TypeScript-first codebase.

## Features

- JWT authentication (`/api/auth/login`, `/api/auth/register`)
- Protected task APIs (all `/api/tasks/*` routes require bearer token)
- Task CRUD:
  - Create task
  - Read user tasks
  - Update task (title/description/status/priority/due date)
  - Delete task
- Task UX enhancements:
  - Priority (`high | medium | low`)
  - Due date
  - Status filters (`All`, `In Progress`, `Completed`)
  - Search (title + description)
  - Sort (created date / priority)
  - Edit modal + delete confirmation modal
- Type-safe frontend and backend (TypeScript)
- React Query integration for data fetching and mutation state
- Tailwind CSS responsive UI

## Tech Stack

- Frontend: React, TypeScript, Vite, React Router, Tailwind CSS, Axios, React Query
- Backend: Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, bcrypt

## Repository Structure

```text
.
├─ task-frontend/   # React + Vite app
├─ task-backend/    # Express + MongoDB API
└─ Html MVP/        # legacy/static MVP files
```

## Prerequisites

- Node.js 18+ (recommended)
- npm 9+
- MongoDB instance (local or cloud)

## Environment Variables

Create `task-backend/.env`:

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## Installation

Install dependencies in both apps:

```powershell
npm -C "task-backend" install
npm -C "task-frontend" install
```

## Run Locally

Start backend:

```powershell
npm -C "task-backend" run dev
```

Start frontend (new terminal):

```powershell
npm -C "task-frontend" run dev
```

Default URLs:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:4000/api`

## Build / Quality Commands

Frontend lint:

```powershell
npm -C "task-frontend" run lint
```

Frontend build:

```powershell
npm -C "task-frontend" run build
```

Backend build:

```powershell
npm -C "task-backend" run build
```

## Authentication Flow

1. User registers or logs in via `/api/auth/*`.
2. Backend returns JWT token (and user email on login).
3. Frontend stores token in `localStorage`.
4. Axios request interceptor attaches `Authorization: Bearer <token>`.
5. Backend `authMiddleware` validates token for all `/api/tasks` routes.
6. On `401`, frontend clears session data and redirects to `/login`.

## API Reference

Base URL: `http://localhost:4000/api`

### Auth

- `POST /auth/register`
  - Body:
    ```json
    { "email": "user@example.com", "password": "secret" }
    ```
  - Responses:
    - `201` success
    - `400` missing fields
    - `409` duplicate user

- `POST /auth/login`
  - Body:
    ```json
    { "email": "user@example.com", "password": "secret" }
    ```
  - Response:
    ```json
    { "token": "jwt-token", "email": "user@example.com" }
    ```

### Tasks (Protected)

All endpoints require header:

```http
Authorization: Bearer <token>
```

- `GET /tasks`  
  Returns all tasks for authenticated user.

- `POST /tasks`
  - Body:
    ```json
    {
      "title": "My task",
      "description": "Optional details",
      "priority": "medium",
      "dueDate": "2026-03-10"
    }
    ```

- `PUT /tasks/:id`
  - Body (any updatable fields):
    ```json
    {
      "title": "Updated title",
      "description": "Updated details",
      "completed": true,
      "priority": "high",
      "dueDate": "2026-03-20"
    }
    ```

- `DELETE /tasks/:id`
  Deletes the task if it belongs to authenticated user.

## Notes

- Task ownership is enforced by `userId` checks in task queries.
- Frontend route `/tasks` is protected by `ProtectedRoute`.
- Login/register pages are public by design; task data is not publicly accessible.

## Future Improvements

- Add backend request validation (e.g., Zod/Joi).
- Add backend linting and automated tests.
- Add `/auth/me` endpoint to hydrate session user details server-side.
