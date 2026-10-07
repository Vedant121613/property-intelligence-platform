# ========================================================
# Pureframe Frontend Production Dockerfile (Multi-Stage)
# ========================================================

# --- Stage 1: Build React/Vite Application ---
FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies deterministically
COPY package*.json ./
RUN npm ci

# Copy frontend source code
COPY . .

# Build argument for backend API URL (baked in by Vite at build time)
ARG VITE_API_BASE_URL=https://api.YOUR_DOMAIN.com
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Compile production bundle to /app/dist
RUN npm run build

# --- Stage 2: Serve via Nginx ---
FROM nginx:alpine

# Copy custom Nginx SPA configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled assets from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/nginx-health || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
