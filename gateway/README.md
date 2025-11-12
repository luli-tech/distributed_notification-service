docker compose -f infra/docker-compose.yml build --no-cache gateway

docker compose -f infra/docker-compose.yml up gateway

pnpm add amqplib amqp-connection-manager
