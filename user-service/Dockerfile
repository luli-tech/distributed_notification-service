# ------------------------
#  Builder Stage
# ------------------------
FROM node:20-alpine AS builder
WORKDIR /app/user-service

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy root pnpm lockfile
COPY ../pnpm-lock.yaml ./pnpm-lock.yaml

# Copy service package.json
COPY package.json ./package.json

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy service source code
COPY . . 

# Build the service
RUN pnpm run build

# ------------------------
#  Production Stage
# ------------------------
FROM node:20-alpine AS production
WORKDIR /app/user-service

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy built files & dependencies
COPY --from=builder /app/user-service/dist ./dist
COPY --from=builder /app/user-service/node_modules ./node_modules
COPY --from=builder /app/user-service/package.json ./package.json

CMD ["node", "dist/main.js"]
