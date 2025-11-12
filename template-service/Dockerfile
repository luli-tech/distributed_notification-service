# ------------------------
# 🧱 Builder Stage
# ------------------------
FROM node:20-alpine AS builder

WORKDIR /app/template-service

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (dev + prod)
RUN pnpm install --frozen-lockfile

# Fix for pnpm global installs in Docker
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Install Nest CLI globally
RUN pnpm add -g @nestjs/cli@11.0.10

# Ensure RabbitMQ dependencies are installed
RUN pnpm add amqplib amqp-connection-manager

# Copy all source files
COPY . .

# Build NestJS project
RUN pnpm run build

# ------------------------
# 🚀 Production Stage
# ------------------------
FROM node:20-alpine AS production

WORKDIR /app/template-service

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency files
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy build output from builder
COPY --from=builder /app/template-service/dist ./dist

# Start the app
CMD ["node", "dist/main"]
