# Queue Service

The queue service is responsible for producing and consuming scheduled tasks and coordinating dispatch of messages into RabbitMQ queues. It contains producers, consumers, and scheduled jobs that operate on the queue layer of the distributed notification system.

Key files

- Source: `src/`
- Jobs: `src/jobs/` (producer, consumer, scheduler)
- Config: `src/config/rabbitmq.config.ts`
- Dockerfile: `Dockerfile`

Purpose

- Schedule notification jobs and publish messages to RabbitMQ.
- Consume messages when configured to run consumers (can be split into separate containers for scaling).

Prerequisites

- Node.js 16+ (or as defined in `package.json`)
- pnpm (recommended) or npm/yarn
- RabbitMQ accessible via `RABBITMQ_URL`

Quick start (development)

```bash
cd queue_service
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

- RabbitMQ URL: `RABBITMQ_URL` (default `amqp://localhost:5672` in code if not provided)
- Queue name: configured in `src/main.ts` (default `queue_service_queue`)

Available scripts

- `pnpm run start` - start the service
- `pnpm run start:dev` - watch mode
- `pnpm run start:prod` - run compiled bundle
- `pnpm run build` - compile TypeScript
- `pnpm run test` - run tests

Docker

- Build image: `docker build -t queue_service ./queue_service`

Testing

- Unit/e2e tests (if present) can be executed with the `test` scripts. See `package.json` for details.

Troubleshooting

- If the service fails to connect to RabbitMQ, confirm `RABBITMQ_URL` is correct and the broker is reachable.
- If scheduled jobs are not firing, verify the scheduler module is enabled and the service is running continuously (not just as one-off tasks).

Notes

- This service is designed to be horizontally scalable: you can run multiple consumers or scheduler instances depending on load.
