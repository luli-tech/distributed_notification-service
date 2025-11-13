
# ------------------------
#  Builder Stage
# ------------------------
FROM node:20-alpine AS builder
WORKDIR /app/queue-service

RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# ------------------------
# 🚀 Production Stage
# ------------------------
FROM node:20-alpine AS production
WORKDIR /app/queue-service

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy production-ready files
COPY --from=builder /app/queue-service/dist ./dist
COPY --from=builder /app/queue-service/node_modules ./node_modules
COPY --from=builder /app/queue-service/package.json ./package.json

# Start the service
CMD ["node", "dist/main"]



