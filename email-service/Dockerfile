FROM node:18-alpine AS development
WORKDIR /app/email-service
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM node:18-alpine AS production
WORKDIR /app/email-service
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile
COPY . .
CMD ["node", "dist/main"]