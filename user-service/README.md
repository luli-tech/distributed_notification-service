# User Service

The user service manages user data used by the notification system. It exposes user-related APIs (when run as an HTTP service) and/or listens for user-related messages over RabbitMQ depending on the service configuration.

Key files

- Source: `src/`
- Prisma: `prisma/` and generated client in `generated/prisma`
- Config: `src/config/rabbitmq.config.ts`
- Dockerfile: `Dockerfile`

Purpose

- Provide CRUD operations and data access for users.
- Integrate with other services via RabbitMQ for user-related events.

Prerequisites

- Node.js 16+ (or as defined in `package.json`)
- pnpm (recommended) or npm/yarn
- RabbitMQ available via `RABBITMQ_URL`
- (Optional) A database for Prisma; check `prisma/schema.prisma` for the provider and migrations.

Quick start (development)

```bash
cd user-service
pnpm install
# if using Prisma and the schema changed:
pnpm exec prisma generate
pnpm run start:dev
```

Quick start (Docker Compose)

From the repository root:

```bash
cd infra
docker compose up --build
```

Important runtime values

- RabbitMQ queue: configured in `src/main.ts` (default `user_queue`)
- RabbitMQ URL: `RABBITMQ_URL`

Available scripts

- `pnpm run start` - start service
- `pnpm run start:dev` - development watch mode
- `pnpm run start:prod` - production run
- `pnpm run build` - compile TypeScript
- `pnpm run test` - run tests

Database / Prisma notes

- This service includes a `prisma/` schema and a generated client under `generated/`.
- If you change the Prisma schema, run `pnpm exec prisma generate` and apply migrations as appropriate.

Docker

- Build: `docker build -t user-service ./user-service`

Troubleshooting

- If the service cannot reach RabbitMQ, confirm `RABBITMQ_URL` and that the broker is reachable.
- If Prisma client errors occur, ensure the generated client is present (`pnpm exec prisma generate`).
