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

# Fix for pnpm global installs in Docker
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Install Nest CLI globally
RUN pnpm add -g @nestjs/cli@11.0.10

# Copy all source files
COPY . .

# Build NestJS project (uses tsconfig.build.json)
RUN pnpm run build

# ------------------------
# 🚀 Production Stage
# ------------------------
FROM node:18-alpine AS production

WORKDIR /app/email-service

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy build output from builder
COPY --from=builder /app/email-service/dist ./dist

# Start the service
CMD ["node", "dist/main"]
