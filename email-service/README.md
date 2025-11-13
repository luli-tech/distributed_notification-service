# Email Service

The email service consumes notification messages from RabbitMQ and is responsible for sending emails (using whatever provider/config is wired into the service). It is implemented as a NestJS microservice that listens on a dedicated queue.

Key files

- Source: `src/`
- Config: `src/config/rabbitmq.config.ts`
- Dockerfile: `Dockerfile`

Purpose

- Receive notification messages and send emails according to templates and payload content.

Prerequisites

- Node.js 16+ (or as defined in `package.json`)
- pnpm (recommended) or npm/yarn
- RabbitMQ available and reachable via `RABBITMQ_URL`

Quick start (development)

```bash
cd email-service
pnpm install
pnpm run start:dev
```

Quick start (Docker Compose)

From the repository root:

```bash
cd infra
docker compose up --build
```

Important runtime values

- The service listens on the `email_queue` (see `src/main.ts` and `src/config/rabbitmq.config.ts`).
- RabbitMQ URL: set `RABBITMQ_URL` in the environment.

Available scripts

- `pnpm run start` - start compiled service
- `pnpm run start:dev` - start in watch mode
- `pnpm run build` - compile TypeScript
- `pnpm run lint` - run linter

Notes about email delivery

- This repository does not include a specific third-party email provider configuration by default. Inspect `src/modules/email/email.service.ts` (or environment-config) to wire a provider (SMTP, SendGrid, etc.).
- For local testing you can use tools like MailHog or a test SMTP service.

Troubleshooting

- If messages are not being received, verify the queue name and that producers publish to the same RabbitMQ exchange/queue.
- Check RabbitMQ connectivity and credentials.
