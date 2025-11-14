# Gateway

Gateway is the HTTP API entry point for the distributed notification system. It exposes REST endpoints for creating and managing notifications and user-facing operations, and forwards messages to the queue when needed.

This service is implemented with NestJS and is intended to run as the public-facing API (or behind a load balancer / API gateway in production).

Key files

- Source: `src/`
- Config: `src/config/` (see `app.config.ts` and `rabbitmq.config.ts`)
- Dockerfile: `Dockerfile`

Prerequisites

- Node.js 16+ (or as defined in the service package.json)
- pnpm (recommended) or npm/yarn
- RabbitMQ when running the full system

Quick start (local - development)

```bash
cd gateway
pnpm install
# start in watch mode
pnpm run start:dev
```

Quick start (Docker Compose - full stack)

From repository root (uses `infra/docker-compose.yml`):

```bash
cd infra
docker compose up --build
```

Available npm scripts

- `pnpm run start` - start application
- `pnpm run start:dev` - start in watch mode (recommended for development)
- `pnpm run start:prod` - start compiled production bundle
- `pnpm run build` - compile TypeScript
- `pnpm run lint` - run ESLint
- `pnpm run test` / `pnpm run test:e2e` - run unit/e2e tests

Configuration and environment

- Port: defaults to `3000` (controlled by `process.env.PORT` in `src/main.ts`).
- RabbitMQ connection: set `RABBITMQ_URL` (or use the value in `src/config/rabbitmq.config.ts`).
- Inspect `src/config` for other environment values used by the gateway.

Docker

- Build: `docker build -t gateway ./gateway`
- The repository includes a `Dockerfile` for containerized runs; the `infra/` compose file demonstrates composing this service with the rest of the stack.

Testing

- Unit tests and e2e tests are available. Run locally per scripts:

```bash
pnpm run test
pnpm run test:e2e
```

Troubleshooting

- If the service cannot reach RabbitMQ, ensure `RABBITMQ_URL` matches the broker address and credentials.
- Use `docker compose logs -f` (from `infra/`) to inspect container logs when running the full stack.

Notes

- This README provides a quick developer guide — check per-service configuration files for advanced settings and environment variables.
