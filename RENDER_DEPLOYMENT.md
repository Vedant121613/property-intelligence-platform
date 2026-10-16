# Render Deployment Guide

Step-by-step instructions for deploying Pureframe on [Render](https://render.com) using the included `render.yaml` Blueprint.

---

## Architecture Deployed on Render

| Service | Type | Plan | Root Dir / Settings | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **`pureframe-postgres`** | PostgreSQL | Free | `pureframe_db` | Persistent database for users, plans, and unlocks |
| **`pureframe-api`** | Web Service (Node.js) | Free | `server/` | Express REST API for OTP, projects, and unlocks |
| **`pureframe-frontend`** | Static Site | Free | Root (`dist`) | Vite + React SPA with rewrite rules |

---

## Method 1: Instant Blueprint Deployment (Recommended)

Render Blueprints allow you to deploy the Database, Backend, and Frontend in **one click** from `render.yaml`.

### Step 1: Open Render Dashboard
1. Log in to [dashboard.render.com](https://dashboard.render.com).
2. In the top right, click **New +** and select **Blueprint**.

### Step 2: Connect GitHub Repository
1. Select your GitHub repository:
   ```
   Vedant121613/property-intelligence-render
   ```
2. Click **Connect**.
3. Choose a Blueprint Instance Name (e.g., `pureframe-production`).
4. Select the branch: `main`.

### Step 3: Configure Environment Variables
Render will detect `render.yaml` and prompt you for the uncommitted environment secrets:

#### A. `pureframe-api` (Backend Web Service)
| Variable | Value / Description |
| :--- | :--- |
| `DATABASE_URL` | *(Automatically linked by Render from `pureframe-postgres`)* |
| `FRONTEND_URL` | `https://pureframe-frontend.onrender.com` *(or your custom frontend domain)* |
| `MSG91_AUTH_KEY` | Your MSG91 AuthKey *(keep confidential)* |
| `MSG91_WIDGET_ID` | `366a666d3673323037323934` |
| `RAZORPAY_KEY_ID` | Razorpay Key ID *(if payment gateway is active)* |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret *(if payment gateway is active)* |

#### B. `pureframe-frontend` (Static Site)
| Variable | Value / Description |
| :--- | :--- |
| `VITE_API_BASE_URL` | `https://pureframe-api.onrender.com` *(your Render backend URL)* |

### Step 4: Click Apply
1. Click **Apply**.
2. Render will provision:
   - PostgreSQL Database: `pureframe-postgres`
   - Express Backend: `pureframe-api`
   - React Frontend: `pureframe-frontend`

---

## Database Auto-Initialization

You do **NOT** need to run any manual `psql` or SQL migration commands. 

Upon first startup, the backend checks for the required tables in PostgreSQL. If they do not exist, it automatically executes `server/init-db.sql`, creating:
- `users` table
- `plans` table with default subscription tiers
- `unlock_logs` table
- Default demo user

---

## Verification & Health Checks

Once deployed, verify your services:

1. **Backend Health Check**:
   ```
   https://pureframe-api.onrender.com/api/health
   ```
   Should return:
   ```json
   {
     "success": true,
     "message": "API is running",
     "database": "connected"
   }
   ```

2. **Frontend SPA Test**:
   - Open `https://pureframe-frontend.onrender.com`
   - Navigate to `/locality/pune/saswad-road`
   - Refresh the page to confirm SPA rewrite routing is working without 404s.

3. **OTP Flow Test**:
   - Open Login modal
   - Enter your 10-digit mobile number
   - Confirm OTP delivery and verification against the live Render API.
