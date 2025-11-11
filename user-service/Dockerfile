# ------------------------
# 🧱 Development Stage
# ------------------------
FROM node:18-alpine AS development

# Enable pnpm using Corepack (included with Node 16+)
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app/user-service

# Copy dependency manifests
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

# Enable pnpm in production image too
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app/user-service

# Copy dependency manifests
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy source and compiled output from the previous stage
COPY . .
COPY --from=development /app/user-service/dist ./dist

# Default command to run the app
CMD ["node", "dist/main"]
