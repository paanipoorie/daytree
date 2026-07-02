# DayTree

DayTree is a habit tracking dashboard built as a project-based MERN learning application. The product is designed around daily execution: users create habits, complete them by time of day, review missed habits in backlogs, and track long-term consistency through analytics.

The current implementation is a frontend-first React application with production-style structure. Backend integration with Node.js, Express, MongoDB, and JWT authentication is planned.

## Features

- Brutalist dashboard UI with a structured product layout.
- Login and signup UI with frontend-ready authentication architecture.
- Home dashboard for daily habit tracking.
- Habit grouping by time period: Morning, Afternoon, Evening, Night.
- Add, complete, and delete habits.
- Backlog detection for habits missed after their scheduled time window.
- Local persistence through a service abstraction.
- Tally analytics page with heatmap, daily average, current streak, and longest streak.
- Feature-based frontend architecture prepared for backend integration.

## Tech Stack

- React 19
- Vite
- JavaScript
- CSS
- ESLint

Planned backend stack:

- Node.js
- Express.js
- MongoDB
- JWT authentication

## Project Structure

```text
src/
├── app/
│   ├── layouts/
│   ├── providers/
│   └── routes/
├── features/
│   ├── auth/
│   ├── habits/
│   └── tally/
├── shared/
│   ├── components/
│   ├── constants/
│   └── utils/
├── App.jsx
├── index.css
└── main.jsx
```

## Architecture

DayTree uses a feature-based frontend architecture.

The `app/` folder contains application-level wiring: providers, routes, and layouts.

The `features/` folder contains product domains. Each feature owns its components, hooks, services, pages, and utilities.

The `shared/` folder contains reusable code that is not specific to one feature, such as branding components, date helpers, and time period constants.

This separation keeps UI rendering, state management, persistence, and analytics logic from being mixed inside one large component.

## Data Model

Habit objects currently use this shape:

```js
{
  id: "string",
  name: "Read book",
  time: "night",
  createdAt: "2026-05-10",
  completedDates: ["2026-05-10"]
}
```

`completedDates` stores history instead of a single `completed` boolean. This supports heatmaps, streaks, completion percentages, and future backend analytics.

## Time Windows

Habits are assigned to one of four time periods:

```text
Morning:   5:00 AM - 12:00 PM
Afternoon: 12:00 PM - 5:00 PM
Evening:   5:00 PM - 8:30 PM
Night:     8:30 PM - 12:00 AM
```

If a habit is not completed before its time window ends, it appears in Backlogs.

## Tally Analytics

The Tally page derives analytics from habit history.

Completion percentage:

```text
completed habits / active habits for that day
```

Heatmap color rules:

```text
100% completed  -> darkest green
70-99%          -> green
50-69%          -> light green
1-49%           -> very light green
0% or no data   -> grey
```

Streaks currently count days where completion is 100%.

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Vite will print a local development URL, usually:

```text
http://127.0.0.1:5173/
```

### Lint

```bash
npm run lint
```

### Production Build

```bash
npm run build
```

### Preview Build

```bash
npm run preview
```

## Environment Variables

The backend relies on environment variables configured in `backend/.env`. A template is provided in `backend/.env.example`.

Key environment variables:
* `PORT`: Port to run the server on (default: `5000`).
* `MONGODB_URI`: MongoDB connection string (e.g. `mongodb://localhost:27017/daytree`).
* `JWT_SECRET`: Secret key used for signing JWTs.
* `JWT_EXPIRES_IN`: JWT expiration length (default: `7d`).
* `CORS_ORIGIN`: Approved CORS origin for production (default: `http://localhost:5173`).
* `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Credentials for profile picture uploads.

## Backend Setup & Operations

### 1. Prerequisites
Ensure you have `Node.js` (v18+) and `Docker` installed on your machine.

### 2. Start the Local Database
Run the MongoDB database inside Docker:
```bash
# Start a new container
docker run -d --name daytree-mongo -p 27017:27017 mongo:7.0

# Or start the container if it already exists
docker start daytree-mongo
```

### 3. Install Dependencies & Configure
```bash
cd backend
npm install
cp .env.example .env
```
Fill in the variables in `.env` (particularly `JWT_SECRET`).

### 4. Running the Server
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

### 5. Running Tests
Run the comprehensive integration test suite (covering Auth, Habits, Completions, and Tally Analytics):
```bash
npm test
```

## API Endpoint Overview

All endpoints are versioned under `/api/v1` and return structured JSON responses.

### Centralized Response Formats
* **Success**: `{ success: true, message: "...", data: {} }`
* **Error**: `{ success: false, message: "...", errors: [...], requestId: "..." }`

### Endpoints
* **Authentication (`/api/v1/auth`)**:
  * `POST /signup` - Register a new account.
  * `POST /login` - Login and receive a JWT.
  * `GET /me` - Get current user profile details (protected).
  * `POST /logout` - Log out current session (protected).
* **Users (`/api/v1/users`)**:
  * `POST /setup-profile` - Upload profile picture and update username (protected, supports `multipart/form-data` uploads).
* **Habits (`/api/v1/habits`)**:
  * `GET /` - Retrieve active habits (protected).
  * `POST /` - Create a new habit (protected).
  * `PATCH /:id` - Edit habit metadata or archive status (protected).
  * `DELETE /:id` - Soft-delete / archive a habit (protected).
  * `POST /:id/toggle` - Toggle habit completion state for a date key `YYYY-MM-DD` (protected).
* **Tally Analytics (`/api/v1/tally`)**:
  * `GET /` - Fetch unified dashboard analytics including heatmap grid, streaks, daily average, and active summaries (protected).

## Git Hygiene

Do not commit:
- `node_modules/`
- `dist/`
- `.env`
- local editor/cache files

Commit:
- source files
- static assets in `public/`
- configuration files
- `package-lock.json`

## Learning Goal

DayTree is intentionally built through project-based learning. The goal is not only to finish a habit tracker, but to learn how real applications are structured: state flow, feature boundaries, service abstraction, analytics logic, and backend integration planning.
