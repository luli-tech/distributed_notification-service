# ------------------------
# 🧱 Development Stage
# ------------------------
FROM node:18-alpine AS development

# Enable pnpm using Corepack (built into Node 16+)
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app/queue-service

# Copy dependency files first for caching
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including dev)
RUN pnpm install --frozen-lockfile

# Copy the rest of the service files
COPY . .

# Build the application
RUN pnpm run build

# ------------------------
# 🚀 Production Stage
# ------------------------
FROM node:18-alpine AS production

# Enable pnpm in the production image too
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app/queue-service

# Copy dependency manifests
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy full source (needed for assets/configs)
COPY . .

# Copy compiled output from the build stage
COPY --from=development /app/queue-service/dist ./dist

# Start the service
CMD ["node", "dist/main"]
