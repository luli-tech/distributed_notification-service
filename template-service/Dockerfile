# ------------------------
#  Builder Stage
# ------------------------
FROM node:20-alpine AS builder
WORKDIR /app/template-service

RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# ------------------------
# 🚀 Production Stage
# ------------------------
FROM node:20-alpine AS production
WORKDIR /app/template-service

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy production-ready files
COPY --from=builder /app/template-service/dist ./dist
COPY --from=builder /app/template-service/node_modules ./node_modules
COPY --from=builder /app/template-service/package.json ./package.json

# Start the service
CMD ["node", "dist/main"]




