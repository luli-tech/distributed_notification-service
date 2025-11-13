# ------------------------
#  Builder Stage
# ------------------------
FROM node:20-alpine AS builder
WORKDIR /app/user-service

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy the workspace lockfile and service package.json
COPY pnpm-lock.yaml ./pnpm-lock.yaml
COPY user-service/package.json ./package.json

# Install dependencies (using frozen lockfile for consistency)
RUN pnpm install --frozen-lockfile

# Copy service source code
COPY user-service ./ 

# Build the service
RUN pnpm run build

# ------------------------
# 🚀 Production Stage
# ------------------------
FROM node:20-alpine AS production
WORKDIR /app/user-service

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy production files
COPY --from=builder /app/user-service/dist ./dist
COPY --from=builder /app/user-service/node_modules ./node_modules
COPY --from=builder /app/user-service/package.json ./package.json

# Start the service
CMD ["node", "dist/main"]
