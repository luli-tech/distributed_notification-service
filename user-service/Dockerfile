# ------------------------
# Builder Stage
# ------------------------
FROM node:20-alpine AS builder
WORKDIR /app/user-service

# Enable Corepack and activate pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package.json and lockfile
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (dev + prod) to build
RUN pnpm install --no-frozen-lockfile


# Copy the rest of the source code
COPY . .

# Build the project
RUN pnpm run build

# ------------------------
# Production Stage
# ------------------------
FROM node:20-alpine AS production
WORKDIR /app/user-service

# Enable Corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package.json and lockfile
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --prod --no-frozen-lockfile


# Copy built files from builder stage
COPY --from=builder /app/user-service/dist ./dist
COPY --from=builder /app/user-service/generated ./generated

# Expose port and define start command
EXPOSE 3000
CMD ["node", "dist/main.js"]
