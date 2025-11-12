# Distributed Notification Service

A microservices example built with NestJS that demonstrates a distributed notification system using a message queue (RabbitMQ). This repository contains several small services that cooperate to provide a notification pipeline (gateway, queue worker, email, template, and user services).

This README gives an overview of the project, how the services are organized, and recommended ways to run and develop the system locally (including a docker-compose option in `infra/`).

## Project structure

Top-level folders of interest:

- `gateway/` - API gateway and HTTP entry point for clients. Routes notifications and user requests to the appropriate services.
- `queue_service/` - Producer/consumer and scheduler jobs; responsible for scheduling and dispatching messages to the queue.
- `email-service/` - Responsible for sending emails (consumes notification messages, sends email via configured provider).
- `template-service/` - Provides message templates and rendering for notifications.
- `user-service/` - Manages user data used by notifications (simple user API and storage).
- `infra/` - Infrastructure helpers including `docker-compose.yml` to run the system locally with Docker (RabbitMQ, and all services as configured).

Each service is a separate NestJS project with its own `package.json`, `tsconfig`, and `src/` folder. Service-specific README files (if present) contain more details for that service.

## Key concepts

- RabbitMQ is used as the message broker between services. The codebase contains RabbitMQ configuration files under `*/config/rabbitmq.config.ts` for each service.
- The services are designed to be run independently (useful for local development) or together via Docker Compose (recommended for a quick end-to-end run).

## Prerequisites

- Node.js (recommended 16+ or 18+)
- pnpm (recommended) or npm/yarn — project uses pnpm in many service packages
- Docker and Docker Compose (to run the full stack quickly)

Note: Check each service `package.json` for exact required Node engine and available npm scripts.

## Quickstart (recommended): Docker Compose

The `infra/docker-compose.yml` is provided to start core infrastructure and services together (including RabbitMQ). From the repository root run:

```bash
cd infra
docker compose up --build
```

This will build and start the containers defined in `infra/docker-compose.yml`. Allow a minute for services to become healthy. Logs can be inspected with:

```bash
docker compose logs -f
```

When finished, stop and remove containers with:

```bash
docker compose down
```

## Run services locally (development)

To work on or run a single service locally (without Docker), open a terminal and:

```bash
cd <service-folder>
pnpm install
# start the service in watch mode (script name may vary; common: start:dev)
pnpm run start:dev
```

Replace `<service-folder>` with `gateway`, `queue_service`, `email-service`, `template-service`, or `user-service`. If your package manager is `npm` or `yarn`, use the equivalent commands. Check the service's `package.json` for exact script names.

## Tests

Each service may contain unit and e2e tests. Run tests for a service by changing into its directory and running the test script:

```bash
cd gateway
pnpm test
```

Adjust the command per service and package manager.

## Configuration

- Environment and connection settings (RabbitMQ URL, credentials, ports) are configured inside each service's `src/config` (see files `app.config.ts` and `rabbitmq.config.ts`).
- For Docker Compose, environment variables used by containers are defined directly in `infra/docker-compose.yml` or `.env` files if present—inspect the infra folder before running.

## Contributing

If you'd like to contribute:

1. Open an issue describing the change or feature.
2. Create a branch, implement tests for new behavior where appropriate, and submit a pull request.

Coding style follows the NestJS conventions used in the repository. Keep changes small and well-documented.

## Troubleshooting

- If services fail to connect to RabbitMQ, ensure RabbitMQ is reachable and credentials/URLs match the configuration in each service (`config/rabbitmq.config.ts`).
- If ports conflict on your machine, adjust the ports in `infra/docker-compose.yml` or the service configs.

## License

This repository is licensed under the terms in the `LICENSE` file at the repository root.

---

If you'd like, I can also:

- Add per-service quick start commands (I can scan `package.json` files and populate exact start/test scripts), or
- Add a short architecture diagram (ASCII or image) and environment variable reference for each service.

Tell me if you'd like those additions and I'll add them.
