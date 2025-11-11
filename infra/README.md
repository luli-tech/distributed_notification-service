# Distributed Notification Service

A modular microservice-based notification system built with NestJS, Prisma, PostgreSQL, RabbitMQ, and Docker — designed to handle multi-channel messaging (Email, Push, Template, and User management) efficiently and at scale.

---

## Project Structure

```bash
distributed-notification-service/
│
├── infra/                      # Infrastructure layer (Docker, envs, etc.)
│   ├── docker-compose.yml       # Runs Postgres, RabbitMQ, pgAdmin (optional)
│   ├── env/                     # Environment variables for each service
│   │   ├── gateway.env
│   │   ├── email-service.env
│   │   └── ...
│   └── README.md
│
├── gateway/                    # API Gateway (entry point for external clients)
│   ├── src/
│   │   ├── modules/
│   │   │   ├── user/
│   │   │   └── notifications/
│   │   ├── config/
│   │   ├── common/
│   │   └── utils/
│   ├── Dockerfile
│   └── package.json
│
├── user-service/               # Handles user management & persistence
│   ├── src/
│   │   ├── modules/user/
│   │   ├── config/
│   │   └── common/
│   ├── prisma/                 # Prisma schema and migrations
│   │   └── schema.prisma
│   ├── Dockerfile
│   └── package.json
│
├── email-service/              # Responsible for sending email notifications
├── push-service/               # Handles push notifications (FCM, OneSignal, etc.)
├── template-service/           # Manages notification templates
├── queue-service/              # RabbitMQ consumers / schedulers
└── README.md
```

---

## Core Technologies

| Layer              | Technology                                | Purpose                                  |
| ------------------ | ----------------------------------------- | ---------------------------------------- |
| Backend Framework  | [NestJS](https://nestjs.com/)             | Modular microservice architecture        |
| Database           | [PostgreSQL](https://www.postgresql.org/) | Relational database                      |
| ORM                | [Prisma](https://www.prisma.io/)          | Type-safe database client                |
| Message Queue      | [RabbitMQ](https://www.rabbitmq.com/)     | Async message passing between services   |
| Containerization   | [Docker](https://www.docker.com/)         | Environment consistency and deployment   |
| Package Manager    | [PNPM](https://pnpm.io/)                  | Fast, efficient dependency management    |
| Optional Admin GUI | [pgAdmin](https://www.pgadmin.org/)       | PostgreSQL database management interface |

---

## Getting Started

### Prerequisites

Make sure you have:

- Docker and Docker Compose
- PNPM (`npm install -g pnpm`)
- Node.js ≥ 18
- (Optional) pgAdmin, DBeaver, or TablePlus if you prefer a DB GUI.

---

### Environment Setup

Each service has its own `.env` file under `infra/env/`.  
Example for `user-service`:

```env
# infra/env/user-service.env
DATABASE_URL=postgresql://postgres:password@postgres:5432/notifications
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
PORT=3001
```

---

### Docker Compose

File: `infra/docker-compose.yml`

```bash
# Run PostgreSQL, RabbitMQ, and optionally pgAdmin
cd infra
docker-compose up --build
```

Example minimal compose file:

```yaml
version: "3.9"
services:
  postgres:
    image: postgres:16
    container_name: postgres
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: notifications
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  rabbitmq:
    image: rabbitmq:3-management
    container_name: rabbitmq
    ports:
      - "5672:5672"
      - "15672:15672"

  # Optional pgAdmin GUI
  pgadmin:
    image: dpage/pgadmin4
    container_name: pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@example.com
      PGADMIN_DEFAULT_PASSWORD: secret
    ports:
      - "5050:80"
    depends_on:
      - postgres

volumes:
  postgres_data:
```

---

### Install Dependencies

```bash
pnpm install
```

PNPM workspaces handle sub-service dependencies automatically.

---

### Initialize Database (Prisma + PostgreSQL)

```bash
cd user-service
pnpm prisma migrate dev
pnpm prisma studio  # optional GUI
```

---

### Run the Entire Stack

```bash
cd infra
docker-compose up --build
```

Access points:

- Gateway API → `http://localhost:3000`
- pgAdmin → `http://localhost:5050`
- RabbitMQ Dashboard → `http://localhost:15672` (guest / guest)

---

## Microservice Overview

| Service          | Description                          | Port |
| ---------------- | ------------------------------------ | ---- |
| Gateway          | Entry point API Gateway              | 3000 |
| User Service     | Handles user data and authentication | 3001 |
| Email Service    | Sends email notifications            | 3002 |
| Push Service     | Manages push notifications           | 3003 |
| Template Service | Manages templates                    | 3004 |
| Queue Service    | Handles background jobs via RabbitMQ | 3005 |

---

## Development Workflow

```bash
# Run a specific service in development
cd gateway
pnpm start:dev

# Apply Prisma migrations
cd user-service
pnpm prisma migrate deploy

# Lint and format
pnpm lint
pnpm format
```

---

## Testing

```bash
pnpm test
```

---

## Common Docker Commands

| Command                   | Description                        |
| ------------------------- | ---------------------------------- |
| `docker-compose up -d`    | Run containers in the background   |
| `docker-compose down`     | Stop and remove containers         |
| `docker ps`               | List running containers            |
| `docker logs <container>` | View logs for a specific container |

---

## Monitoring and Management

- RabbitMQ UI: `http://localhost:15672` (guest / guest)
- pgAdmin UI (optional): `http://localhost:5050` (admin@example.com / secret)

---

## Future Improvements

- Redis caching for sessions / rate limits
- WebSocket live notifications
- Grafana + Prometheus monitoring stack
- GitHub Actions CI/CD
- Automated integration testing

---

## License

MIT © 2025 Distributed Notification Service Team
