# ------------------------
# 🧱 Builder Stage
# ------------------------
FROM node:20-alpine AS builder

WORKDIR /app/user-service

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies
RUN pnpm install --frozen-lockfile

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

# Copy build output from builder
COPY --from=builder /app/user-service/dist ./dist

# Start the app (no hot reload)
CMD ["node", "dist/main"]
