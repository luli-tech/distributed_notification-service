# Template Service

The template service provides templates and rendering functionality for notification messages. Other services (for example, the gateway or the email service) can request rendered templates to assemble the final message payload.

Key files

- Source: `src/`
- Template module: `src/template/`
- Dockerfile: `Dockerfile`

Prerequisites

- Node.js 16+ (or as defined in `package.json`)
- pnpm (recommended) or npm/yarn

Quick start (development)

```bash
cd template-service
pnpm install
pnpm run start:dev
```

Quick start (Docker Compose)

From the repository root:

```bash
cd infra
docker compose up --build
```

Available scripts

- `pnpm run start` - start the application
- `pnpm run start:dev` - start in watch mode
- `pnpm run start:prod` - run compiled bundle
- `pnpm run build` - compile TypeScript
- `pnpm run test` - run tests

Configuration

- Port: defaults to `3000` (see `src/main.ts`); change `PORT` environment variable to override.

Docker

- Build: `docker build -t template-service ./template-service`

Testing

- Run unit and e2e tests per the scripts in `package.json`.

Troubleshooting

- If template rendering fails, inspect template inputs and check that the template service is reachable (networking/ports).
