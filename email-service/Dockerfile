# ------------------------
# 🧱 Builder Stage
# ------------------------
FROM node:18-alpine AS builder

WORKDIR /app/email-service

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./

# Install all dependencies (dev + prod)
RUN pnpm install --frozen-lockfile

COPY . .

# Build NestJS project (will use tsconfig.build.json automatically)
RUN pnpm dlx @nestjs/cli@11.0.10 build

# ------------------------
# 🚀 Production Stage
# ------------------------
FROM node:18-alpine AS production

WORKDIR /app/email-service

RUN corepack enable && corepack prepare pnpm@latest --activate

# Install only production dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Copy build output from builder
COPY --from=builder /app/email-service/dist ./dist

CMD ["node", "dist/main"]
