FROM node:20-alpine AS builder
WORKDIR /app/template-service

# Install bash (optional, helps pnpm scripts) and corepack
RUN apk add --no-cache bash git python3 make g++ \
    && corepack enable && corepack prepare pnpm@latest --activate

# Copy package.json and lockfile
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (dev + prod)
RUN pnpm install --no-frozen-lockfile --ignore-scripts

# Copy the rest of the source code
COPY . .

# Build the project
RUN pnpm run build

# ------------------------
# Production Stage
# ------------------------
FROM node:20-alpine AS production
WORKDIR /app/template-service

# Install runtime dependencies
RUN apk add --no-cache bash git python3 make g++

# Enable Corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package.json and lockfile
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies, ignoring scripts
RUN pnpm install --prod --no-frozen-lockfile --ignore-scripts

# Copy built files from builder stage
COPY --from=builder /app/template-service/dist ./dist

# Expose port and define start command
EXPOSE 3000
CMD ["node", "dist/main.js"]
