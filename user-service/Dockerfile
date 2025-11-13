# ------------------------
# Builder Stage
# ------------------------
FROM node:20-alpine AS builder
WORKDIR /app/user-service

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package.json and lockfile
COPY package.json ./pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --no-frozen-lockfile


# Copy service source code
COPY . .

# Build the service
RUN pnpm run build

# ------------------------
# Production Stage
# ------------------------
FROM node:20-alpine AS production
WORKDIR /app/user-service

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy production build from builder
COPY --from=builder /app/user-service/dist ./dist
COPY --from=builder /app/user-service/node_modules ./node_modules
COPY --from=builder /app/user-service/package.json ./

# Start the service
CMD ["node", "dist/main"]
