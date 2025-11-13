
# ------------------------
#  Builder Stage
# ------------------------
FROM node:20-alpine AS builder
WORKDIR /app/user-service

RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# ------------------------
# 🚀 Production Stage
# ------------------------
FROM node:20-alpine AS production
WORKDIR /app/user-service

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy production-ready files
COPY --from=builder /app/user-service/dist ./dist
COPY --from=builder /app/user-service/node_modules ./node_modules
COPY --from=builder /app/user-service/package.json ./package.json

# Start the service
CMD ["node", "dist/main"]



