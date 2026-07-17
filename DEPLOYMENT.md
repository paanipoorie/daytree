# DayTree - Production Deployment Guide

This guide details the step-by-step process of deploying the DayTree habit tracker application in a production environment. 

## 🗺 Deployment Architecture Overview

```text
  [ Vercel Frontend ] 
         │ (HTTPS Request with Bearer Token)
         ▼
  [ Render Load Balancer ]
         │ (HTTP Proxy, trust proxy: 1)
         ▼
  [ Render Express App ] 
         │ (Mongoose TLS Connection)
         ▼
  [ MongoDB Atlas Cluster ]
```

---

## 🚀 Recommended Deployment Order

To ensure a smooth launch, follow this sequence:
1. **Database Setup**: Deploy MongoDB Atlas first, obtain the connection string, and update your backend `.env` file (local) or hosting service environment variables (production).
2. **Backend Deployment**: Deploy the Express backend on Render, injecting Atlas and Cloudinary secrets.
3. **Frontend Deployment**: Deploy the React frontend on Vercel, injecting the Render backend API URL.

---

## 🗄 Step 1: MongoDB Atlas Setup

1. **Sign Up / Login**: Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. **Create a Project & Cluster**: Create a new project named `DayTree` and spin up a free shared cluster (`M0` sandbox) in your preferred region (e.g., AWS us-east-1 or similar).
3. **Network Access Setup**:
   * Navigate to **Network Access** under Security.
   * Click **Add IP Address**.
   * To allow access from anywhere (necessary for dynamic environments like local dev or Render free web services), add `0.0.0.0/0`.
   * For production, restrict to your hosting provider's static IP(s) if possible.
4. **Database Access Setup**:
   * Navigate to **Database Access**.
   * Click **Add New Database User**.
   * Choose **Password** authentication, create a database username (e.g., `daytree-user`), and generate/choose a strong password.
   * Under **Database User Privileges**, select **Read and write to any database** (or restrict explicitly to the `daytree` database).
5. **Get Connection URI**:
   * Click **Connect** on your Database cluster in the Atlas Dashboard.
   * Select **Drivers** (choose Node.js).
   * Copy the connection string. It will look like:
     `mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority`
6. **Configure URI Variables**:
   * Replace `<username>` with your database user.
   * Replace `<password>` with the secure user password.
   * Specify the database name (e.g., `daytree`) after the slash `/` and before the query parameters (e.g., `mongodb+srv://user:pass@cluster.mongodb.net/daytree?retryWrites=true&w=majority`).
   * Put this final URI in your backend `.env` as `MONGODB_URI`.
7. **Safe Testing Configuration**:
   * Running Jest integration tests locally will clear the database. To prevent your development or production Atlas database from being wiped, you should configure a separate `MONGODB_TEST_URI` in your backend `.env` pointing to a local test database:
     `MONGODB_TEST_URI=mongodb://localhost:27017/daytree_test`
   * This isolates tests completely from your main `MONGODB_URI`.

---

## ⚡ Step 2: Backend Deployment on Render

1. **Sign Up / Login**: Go to [Render](https://render.com/).
2. **Create a Web Service**:
   * Click **New** -> **Web Service**.
   * Connect your GitHub/GitLab repository.
   * Choose the repository containing the `daytree` project.
3. **Configure Web Service**:
   * **Name**: `daytree-backend`
   * **Region**: Choose the closest region to your database.
   * **Runtime**: `Node`
   * **Build Command**: `cd backend && npm install`
   * **Start Command**: `cd backend && npm start`
4. **Configure Environment Variables**:
   Click **Advanced** -> **Add Environment Variable** and add the following keys:
   * `NODE_ENV`: `production`
   * `PORT`: `10000` (Render will override this, but standard default is fine)
   * `MONGODB_URI`: *Your Atlas connection string (replace `<password>` with the actual database user password)*
   * `JWT_SECRET`: *A secure random string (e.g. 64-character hex)*
   * `JWT_EXPIRES_IN`: `7d`
   * `FRONTEND_URL`: *The URL of your deployed frontend (e.g., `https://daytree.vercel.app`). Used for locking down CORS verification.*
   * `CORS_ORIGIN`: *Fallback / alternative for FRONTEND_URL. (e.g., `http://localhost:5173` or matching frontend URL)*
   * `CLOUDINARY_CLOUD_NAME`: *Cloudinary cloud name*
   * `CLOUDINARY_API_KEY`: *Cloudinary API key*
   * `CLOUDINARY_API_SECRET`: *Cloudinary API secret*
   * `RESEND_API_KEY`: *Your Resend API key (e.g. re_xxxx)*
   * `EMAIL_FROM`: *Your verified sender email address (e.g., `"DayTree <no-reply@daytree.paanipoorie.com>"`)*
   * `GOOGLE_CLIENT_ID`: *Your Google OAuth Client ID for verification*
5. **Deploy**: Click **Create Web Service**. Render will build and start the container. Copy the public URL (e.g., `https://daytree-backend.onrender.com`).

---

## 🎨 Step 3: Frontend Deployment on Vercel

1. **Sign Up / Login**: Go to [Vercel](https://vercel.com/).
2. **Import Project**:
   * Click **Add New** -> **Project**.
   * Import your GitHub repository.
3. **Configure Build Settings**:
   * **Framework Preset**: `Vite` (automatically detected)
   * **Root Directory**: `frontend` (the frontend subfolder of the workspace)
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
4. **Configure Environment Variables**:
   * Add the following environment variables:
     * `VITE_API_BASE_URL`: *The Render backend URL (e.g., `https://daytree-backend.onrender.com`)*
     * `VITE_GOOGLE_CLIENT_ID`: *Your Google OAuth Client ID for frontend button initialization (e.g. xxxx.apps.googleusercontent.com)*
5. **Deploy**: Click **Deploy**. Vercel will build and assign a domain (e.g., `https://daytree.vercel.app`).

### 🔄 Step 4: Lock Down CORS (Optional but Recommended)
Go back to your **Render Web Service settings**, edit the environment variables, and update:
* `FRONTEND_URL`: `https://daytree.vercel.app` (your actual Vercel domain)

This restricts API usage to only your deployed frontend.

---

## 🛠 Troubleshooting & Common Issues

### 1. `AggregateError [ECONNREFUSED]` on Frontend
* **Cause**: The Vite proxy cannot connect to the backend server because the backend is not running or the port is wrong.
* **Fix**: Ensure the Render backend service is running and healthy. If in local dev, make sure to run `npm run dev` in the `backend/` directory.

### 2. Rate Limiting blocks requests (`HTTP 429 Too Many Requests`)
* **Cause**: Express rate limits have been triggered. Behind Render, the load balancer IP might be getting rate-limited if the proxy is not trusted.
* **Fix**: Ensure `app.set('trust proxy', 1);` is enabled in `app.js` (which is already configured). If you need higher thresholds, configure `RATE_LIMIT_MAX` or `AUTH_RATE_LIMIT_MAX` environment variables on Render.

### 3. MongoDB connection times out
* **Cause**: MongoDB Atlas is blocking requests because the IP address of the Render service has not been whitelisted.
* **Fix**: Use `0.0.0.0/0` (allow access from anywhere) if your hosting provider's outbound IPs are dynamic (e.g. Render free instances). Otherwise, restrict access to your hosting provider's static IP(s) whenever possible.

### 4. Images fail to upload or profile setup returns `HTTP 500`
* **Cause**: Cloudinary credentials are missing, invalid, or expired.
* **Fix**: Double-check `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` values in your Render dashboard environment configuration.
