# 🌿 DayTree

DayTree is a professional, production-ready MERN habit tracking application designed around daily execution, period-based scheduling, and long-term consistency metrics. 

It is constructed with a highly structured, feature-based architecture and features a striking, minimal Brutalist design.

---

## 📸 Screenshots & Previews

### 1. Habit Dashboard (Daily Board)
![DayTree Dashboard](public/main-page.png)

### 2. Secure Authenticated Gate
![DayTree Auth Portal](public/auth-tree.png)

---

## ✨ Features

* **Brutalist Monospaced UI**: A bold, clean, accessibility-compliant monochrome layout that prioritizes usability.
* **Period-Based Habit Tracking**: Organize habits into dedicated time blocks (Morning, Afternoon, Evening, Night) to structure your daily routine.
* **Unified Analytics Engine**: Computes daily averages, completion streaks, and compiles dynamic heatmap metrics directly on the server to prevent heavy frontend CPU utilization.
* **Intelligent Backlog Detection**: Automatically lists past habits that were missed during their designated time window to encourage user catch-ups.
* **Robust Security Controls**: Protected routes, JWT token session management, Helmet headers, express body-size protection (100kb limit), and custom MongoDB operator sanitizers to guard against script injections.
* **Granular IP Rate Limiter**: Enforces strict endpoint throttling (100 requests / 15 minutes globally; 15 requests / 15 minutes for security-critical Auth/Multer endpoints).
* **Observability & Request Tracing**: Assigns and appends UUID request-tracking headers (`X-Request-Id`) across logs, error responses, and audit hooks.

---

## 🛠 Tech Stack

### Frontend
* **Core**: React 19, Vite, Javascript
* **Routing**: React Router DOM (v7)
* **Styling**: Vanilla CSS (Custom Brutalist Monochrome design tokens)

### Backend
* **Core**: Node.js, Express.js
* **Database**: MongoDB Atlas, Mongoose
* **Auth**: JWT, bcrypt
* **File Upload**: Multer, Cloudinary API
* **Security & Observability**: Helmet, Express Mongo Sanitize, Express Rate Limit, UUID Request Tracer, Audit Service logger
* **Testing**: Jest, Supertest (28 comprehensive integration test specs)

---

## 📁 Repository Directory Structure

```text
daytree/
├── .github/                 # GitHub workflows & issue/PR templates
├── backend/                 # Node & Express microservice folder
│   ├── src/
│   │   ├── config/          # Central configuration (DB, Cloudinary, Env)
│   │   ├── controllers/     # Controller handlers (Auth, Habits, Users, Tally)
│   │   ├── middleware/      # Global hooks (Auth guard, Rate Limiter, Error Handler, Tracer)
│   │   ├── models/          # Database models (User, Habit, HabitCompletion)
│   │   ├── routes/          # Router paths mapping endpoints to controllers
│   │   ├── services/        # Decoupled business engines (Tally calculations)
│   │   ├── utils/           # Shared response formats & helpers
│   │   ├── validators/      # Route parameter Zod schemas
│   │   ├── app.js           # Express app configuring middleware & routing
│   │   └── server.js        # Server bootstrapping & OS signal listeners
│   ├── tests/               # Sequential Supertest integration suite
│   ├── .env.example         # Template for environment variables
│   └── package.json         # Backend dependency lock
├── frontend/                # React Single Page Application (SPA) folder
│   ├── src/
│   │   ├── app/             # Providers, layout templates, routing guards
│   │   ├── features/        # Feature-focused modules (Auth, Habits, Tally pages)
│   │   └── shared/          # Reusable generic widgets, helpers, constants
│   ├── public/              # Static assets & brand graphics
│   ├── vite.config.js       # Vite configuration
│   ├── eslint.config.js     # ESLint configuration
│   ├── .env.example         # Template for frontend env variables
│   └── package.json         # Frontend dependency lock
├── API.md                   # Full endpoint parameter specifications
├── DEPLOYMENT.md            # Render/Vercel/Atlas cloud manual
├── LICENSE                  # MIT License
└── README.md                # Repository overview & startup instructions
```

---

## 🚀 Local Quickstart

### Prerequisites
* [Node.js](https://nodejs.org/) (v18+)
* [Docker Desktop](https://www.docker.com/) (to run local MongoDB container)

### 1. Database Setup
Spin up a local MongoDB container:
```bash
# Pull and start MongoDB
docker run -d --name daytree-mongo -p 27017:27017 mongo:latest
```

### 2. Backend Setup
Navigate to the backend, install dependencies, and set up environment secrets:
```bash
cd backend
npm install
cp .env.example .env
```
Ensure you open the newly created `.env` file and configure the following variables:
* `MONGODB_URI`: Set to `mongodb://localhost:27017/daytree` (default local) or your **MongoDB Atlas** connection string.
* `MONGODB_TEST_URI`: (Optional) Dedicated MongoDB connection URI for running integration tests. Recommended if you use an Atlas cluster for `MONGODB_URI` so tests do not wipe your development/production database.
* `RESEND_API_KEY`: Resend API key for OTP delivery.
* `EMAIL_FROM`: Verified sender identity on Resend.
* `GOOGLE_CLIENT_ID`: Google OAuth client ID for Google Sign-In verification.

### 3. Frontend Setup
Navigate to the frontend, install dependencies:
```bash
cd frontend
npm install
```

### 4. Running the Application (Monorepo Convenience Scripts)
Since the repository is structured as a full-stack monorepo, you can run convenience scripts directly from the workspace root:

*   **Start Backend Developer Server**:
    ```bash
    npm run backend
    ```
*   **Start Frontend Developer Server**:
    ```bash
    npm run frontend
    ```
*   **Build Frontend Bundle**:
    ```bash
    npm run frontend:build
    ```
*   **Run Backend Integration Tests**:
    ```bash
    npm run backend:test
    ```

You can still navigate into `/backend` or `/frontend` to execute standard subdirectory commands if preferred.

---

## ☁️ Deployment Specifications

* **Database**: MongoDB Atlas Cluster.
* **Backend**: Deployed to Render (utilizes `trust proxy: 1` settings to read client IPs safely behind load balancers).
* **Frontend**: Deployed to Vercel (points to the Render domain using the environment variable `VITE_API_BASE_URL`).

For detailed instructions on cloud deployment, reference the [DEPLOYMENT.md](DEPLOYMENT.md) guide.

---

## 🗺 Future Roadmap
* **Habit Reminders**: Support push notifications and email integrations.
* **Personal Goals**: Expose user custom goals and target streaks.
* **Visual Themes**: Toggle support for brutalist color matrices (e.g. amber, emerald neon).

---

## 📄 License
This project is open-source software licensed under the [MIT License](LICENSE).
