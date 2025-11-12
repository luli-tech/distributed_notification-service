# ------------------------
# 🧱 Builder Stage
# ------------------------
FROM node:20-alpine AS builder

WORKDIR /app/gateway

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (dev + prod)
RUN pnpm install --frozen-lockfile

## Removed unnecessary global installs and RabbitMQ dependencies

# Copy all source files
COPY . .

# Build NestJS project
RUN pnpm run build

# ------------------------
# 🚀 Production Stage
# ------------------------
FROM node:20-alpine AS production

WORKDIR /app/user-service

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency files
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/gateway/dist ./dist

# Start the app
CMD ["node", "dist/main"]
