# ========================================================
# Pureframe Backend Production Dockerfile
# ========================================================
FROM node:22-alpine

WORKDIR /app

# Install production dependencies deterministically
COPY package*.json ./
RUN npm ci --omit=dev

# Copy backend application source
COPY . .

# Production defaults
ENV NODE_ENV=production
ENV PORT=5000

# Expose backend API port
EXPOSE 5000

# Container health check against Express health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:5000/api/health || node -e "fetch('http://127.0.0.1:5000/api/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

# Start production server
CMD ["npm", "start"]
