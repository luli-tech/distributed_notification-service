# ------------------------
# 🧱 Development Stage
# ------------------------
FROM node:20-alpine AS builder
WORKDIR /app/queue-service
# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml ./
# Install all dependencies
RUN pnpm install --frozen-lockfile
COPY . .
# Build the project
RUN pnpm run build

FROM node:20-alpine AS production
WORKDIR /app/queue-service
# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml ./
# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile
# Copy build output from builder
COPY --from=builder /app/queue-service/dist ./dist
# Start the service
CMD ["node", "dist/main"]
