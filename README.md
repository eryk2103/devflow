# Devflow

A task management application for software projects. Organize your work by creating projects, adding tasks with priorities and types, and tracking progress through statuses.

## App screenshot
<img src="app.png" alt="app" style="max-width: 500px;"/>

## Features

- **Authentication** — register, login, and persistent sessions via JWT access tokens with HTTP-only refresh cookies
- **Projects** — create and manage multiple software projects per user
- **Tasks** — full CRUD with status, type, and priority classification
  - Status: `TODO` · `IN_PROGRESS` · `DONE`
  - Type: `BUG` · `FEATURE` · `REFACTOR` · `TEST` · `DOCUMENTATION` · `OPTIMIZATION`
  - Priority: `LOW` · `MEDIUM` · `HIGH` · `CRITICAL`
- **Filtering** — filter tasks by status within a project

## Tech Stack

### Backend
- **FastAPI** — REST API with automatic OpenAPI docs
- **SQLAlchemy** — ORM with PostgreSQL
- **Alembic** — database migrations
- **Pydantic** — request/response validation
- **PyJWT + argon2** — JWT authentication and password hashing
- **Docker** — containerized API and PostgreSQL (via Compose)
- **PyTest** - testing

### Frontend
- **React 19** + **TypeScript** — UI
- **Vite** — build tooling
- **Material UI** — component library
- **React Router v7** — client-side routing
- **React Hook Form** + **Zod** — form handling and validation


