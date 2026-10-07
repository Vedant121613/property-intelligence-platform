# Pureframe Production Deployment Guide (Coolify + Docker)

This guide provides end-to-end instructions for running Pureframe locally, testing with Docker/Docker Compose, and deploying the production architecture to **Coolify**.

---

## 1. Architecture Overview

```
                      INTERNET
                         │
                         ▼
               ┌──────────────────┐
               │     Coolify      │
               │ (Traefik/Reverse)│
               └────────┬─────────┘
                        │
            ┌───────────┴───────────┐
            │                       │
            ▼                       ▼
    Frontend Container      Backend Container
    React / Vite (Nginx)    Node.js / Express
    Port: 80                Port: 5000
    https://YOUR_DOMAIN.com https://api.YOUR_DOMAIN.com
            │                       │
            │                       ▼
            │               MSG91 SMS Gateway
            │               (Secret AuthKey stored
            │                ONLY on Backend)
            └───────────┬───────────┘
                        │
                        ▼
                 PostgreSQL (5432)
```

- **Frontend Container**: Nginx Alpine serving Vite compiled static files with SPA fallback routing. Exposes internal port **80**.
- **Backend Container**: Node.js 22 LTS Express API listening on **0.0.0.0:5000**. Handles OTP dispatch, token verification, and PostgreSQL queries. Exposes internal port **5000**.
- **Security Boundary**: MSG91 Secret AuthKey is strictly located in the backend environment. The browser never receives or requires server secrets.

---

## 2. Local Development (Without Docker)

### Prerequisites
- Node.js 20 or 22 LTS
- Local PostgreSQL instance (optional, runs in fallback mode if offline)

### Commands
1. **Install Dependencies**:
   ```bash
   # Root / Frontend
   npm install

   # Backend
   npm --prefix ./server install
   ```

2. **Start Backend Server**:
   ```bash
   # From root:
   npm run server
   # Or from server directory:
   cd server && npm start
   ```
   Backend starts on: `http://localhost:5000`

3. **Start Frontend Dev Server**:
   ```bash
   npm run dev
   ```
   Frontend starts on: `http://localhost:5173` (or `5174`)

### Local Environment Variables
- Root `.env`:
  ```ini
  VITE_API_BASE_URL=http://localhost:5000
  ```
- `server/.env`:
  ```ini
  PORT=5000
  FRONTEND_URL=http://localhost:5173,http://localhost:5174
  MSG91_AUTH_KEY=<your_msg91_auth_key>
  MSG91_WIDGET_ID=366a666d3673323037323934
  PGHOST=localhost
  PGPORT=5432
  PGUSER=postgres
  PGDATABASE=pureframe_db
  PGPASSWORD=<your_postgres_password>
  ```

---

## 3. Local Docker Testing

### Option A: Using Docker Compose (Recommended)
Spins up PostgreSQL, Backend, and Frontend containers simultaneously:

```bash
docker compose up --build
```

- **Frontend**: `http://localhost:8080`
- **Backend API**: `http://localhost:5000`
- **API Health Check**: `http://localhost:5000/api/health`

To stop:
```bash
docker compose down
```

---

### Option B: Building and Running Containers Individually

#### 1. Backend Service
```bash
# Build Backend Image
docker build -t property-backend:latest ./server

# Run Backend Container
docker run -d \
  --name property-backend \
  -p 5000:5000 \
  -e PORT=5000 \
  -e FRONTEND_URL=http://localhost:8080 \
  -e MSG91_AUTH_KEY=your_key_here \
  -e MSG91_WIDGET_ID=366a666d3673323037323934 \
  property-backend:latest
```

Verify backend health:
```bash
curl http://localhost:5000/api/health
```

#### 2. Frontend Service
```bash
# Build Frontend Image (bake in backend API URL)
docker build \
  --build-arg VITE_API_BASE_URL=http://localhost:5000 \
  -t property-frontend:latest .

# Run Frontend Container
docker run -d \
  --name property-frontend \
  -p 8080:80 \
  property-frontend:latest
```

Open `http://localhost:8080` in your browser.

---

## 4. Coolify Production Deployment Step-by-Step

### Domain Preparation
Decide on your production domains (replace `YOUR_DOMAIN.com`):
- Frontend: `https://YOUR_DOMAIN.com`
- Backend API: `https://api.YOUR_DOMAIN.com`

Make sure your DNS A/CNAME records point `YOUR_DOMAIN.com` and `api.YOUR_DOMAIN.com` to your Coolify server IP.

---

### Step 1: Deploy Backend Service in Coolify

1. In Coolify, navigate to your Project & Environment > **+ New Resource** > **Application**.
2. Select your Git repository.
3. Configure the Build settings:
   - **Build Pack**: `Dockerfile`
   - **Base Directory**: `/server` (or context root with Dockerfile `./server/Dockerfile`)
   - **Dockerfile Path**: `Dockerfile` (or `./server/Dockerfile`)
4. Configure General settings:
   - **Name**: `pureframe-backend`
   - **Domains**: `https://api.YOUR_DOMAIN.com`
   - **Exposed Port**: `5000`
5. Configure Environment Variables in Coolify:
   ```ini
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://YOUR_DOMAIN.com
   MSG91_AUTH_KEY=<your_real_msg91_auth_key>
   MSG91_WIDGET_ID=366a666d3673323037323934
   MSG91_TEMPLATE_ID=
   MSG91_SENDER_ID=
   PGHOST=<coolify_postgres_host_or_ip>
   PGPORT=5432
   PGUSER=postgres
   PGDATABASE=pureframe_db
   PGPASSWORD=<coolify_postgres_password>
   ```
6. Click **Deploy**.
7. Once deployed, verify in browser or terminal:
   ```bash
   curl https://api.YOUR_DOMAIN.com/api/health
   ```
   Expected response:
   ```json
   {
     "success": true,
     "message": "API is running",
     "database": "connected"
   }
   ```

---

### Step 2: Deploy Frontend Service in Coolify

1. In Coolify, click **+ New Resource** > **Application**.
2. Select the same Git repository.
3. Configure the Build settings:
   - **Build Pack**: `Dockerfile`
   - **Base Directory**: `/`
   - **Dockerfile Path**: `Dockerfile`
4. Configure Build Arguments (or Build Environment Variables in Coolify):
   ```ini
   VITE_API_BASE_URL=https://api.YOUR_DOMAIN.com
   ```
   *(Note: Vite bakes this variable into the compiled bundle during `npm run build` in Stage 1).*
5. Configure General settings:
   - **Name**: `pureframe-frontend`
   - **Domains**: `https://YOUR_DOMAIN.com`
   - **Exposed Port**: `80`
6. Click **Deploy**.
7. Coolify's Traefik reverse proxy will automatically generate and attach Let's Encrypt SSL certificates for HTTPS.

---

### Step 3: Database Setup (PostgreSQL in Coolify)

You have two choices for PostgreSQL:

#### Choice A: Coolify-Managed PostgreSQL (Recommended)
1. In Coolify, go to your Project > **+ New Resource** > **Database** > **PostgreSQL**.
2. Set container name / database name: `pureframe_db`.
3. Coolify automatically creates persistent Docker volumes for PostgreSQL data, ensuring no data loss on redeploys.
4. Coolify will display the generated internal connection details:
   - Internal Host (e.g., `postgresql` or service UUID)
   - Port: `5432`
   - User: `postgres`
   - Password: `<generated_password>`
   - Database: `pureframe_db`
   - Or a full `DATABASE_URL` (e.g., `postgresql://postgres:pass@postgresql:5432/pureframe_db`).
5. Copy these values directly into your **pureframe-backend** environment variables.
6. **Initialize Tables**: Run the schema from `server/init-db.sql` against the database via Coolify's PostgreSQL Terminal/Web CLI or via psql:
   ```bash
   psql -h <HOST> -U postgres -d pureframe_db -f server/init-db.sql
   ```

#### Choice B: External PostgreSQL (Supabase, Neon, AWS RDS)
If using an external managed PostgreSQL provider:
1. Copy the connection string or host/user/password provided by your cloud provider.
2. In Coolify's backend service, set `DATABASE_URL` or `PGHOST`, `PGPORT`, `PGUSER`, `PGDATABASE`, `PGPASSWORD`.
3. If SSL is required by your provider, node-postgres handles `DATABASE_URL?sslmode=require` automatically.
4. Execute `server/init-db.sql` once on your remote database to create the `users` and `plans` tables.

---

### Step 4: Verification & Smoke Testing

1. **SPA Routing**:
   - Navigate to `https://YOUR_DOMAIN.com`
   - Refresh on sub-paths: `https://YOUR_DOMAIN.com/property/123`, `https://YOUR_DOMAIN.com/plans`
   - Confirm Nginx returns `index.html` without 404 errors.
2. **Health Check**:
   - Visit `https://api.YOUR_DOMAIN.com/api/health`
   - Verify it returns HTTP 200 with `"database": "connected"`.
3. **CORS Verification**:
   - Check browser console on `https://YOUR_DOMAIN.com`; ensure no CORS blocking errors occur when calling `https://api.YOUR_DOMAIN.com/api/...`.
4. **OTP Flow Verification**:
   - Open login modal on frontend.
   - Enter test mobile number.
   - Click "Get OTP".
   - Confirm OTP SMS / WhatsApp arrives.
   - Enter OTP and confirm authentication succeeds.

