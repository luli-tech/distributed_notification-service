distributed-notification-service/
│
├── infra/ # infrastructure layer (docker, scripts, etc.)
│ ├── docker-compose.yml
│ ├── env/
│ │ ├── gateway.env
│ │ ├── email-service.env
│ │ └── ...
│ └── README.md
│
├── gateway/ # main API Gateway
│ ├── src/
│ │ ├── main.ts
│ │ ├── app.module.ts
│ │ ├── modules/
│ │ │ ├── user/
│ │ │ │ ├── user.controller.ts
│ │ │ │ ├── user.service.ts
│ │ │ │ ├── dto/
│ │ │ │ ├── interfaces/
│ │ │ │ └── user.module.ts
│ │ │ └── notifications/
│ │ │ ├── notification.controller.ts
│ │ │ ├── notification.service.ts
│ │ │ └── notification.module.ts
│ │ ├── common/
│ │ │ ├── filters/
│ │ │ ├── interceptors/
│ │ │ ├── decorators/
│ │ │ └── constants/
│ │ ├── config/
│ │ │ ├── rabbitmq.config.ts
│ │ │ └── app.config.ts
│ │ └── utils/
│ ├── test/
│ ├── Dockerfile
│ ├── package.json
│ └── tsconfig.json
│
├── user-service/
│ ├── src/
│ │ ├── main.ts
│ │ ├── app.module.ts
│ │ ├── modules/
│ │ │ └── user/
│ │ │ ├── user.controller.ts
│ │ │ ├── user.service.ts
│ │ │ ├── schemas/
│ │ │ │ └── user.schema.ts
│ │ │ ├── dto/
│ │ │ ├── interfaces/
│ │ │ └── user.module.ts
│ │ ├── config/
│ │ │ ├── rabbitmq.config.ts
│ │ │ └── mongo.config.ts
│ │ ├── common/
│ │ └── utils/
│ ├── test/
│ ├── Dockerfile
│ ├── package.json
│ └── tsconfig.json
│
├── email-service/
│ ├── src/
│ │ ├── main.ts
│ │ ├── app.module.ts
│ │ ├── modules/
│ │ │ └── email/
│ │ │ ├── email.controller.ts
│ │ │ ├── email.service.ts
│ │ │ ├── dto/
│ │ │ ├── templates/
│ │ │ └── email.module.ts
│ │ ├── config/
│ │ ├── common/
│ │ └── utils/
│ ├── Dockerfile
│ └── package.json
│
├── push-service/
│ ├── src/
│ │ ├── main.ts
│ │ ├── app.module.ts
│ │ └── modules/
│ │ └── push/
│ │ ├── push.controller.ts
│ │ ├── push.service.ts
│ │ └── push.module.ts
│ ├── Dockerfile
│ └── package.json
│
├── template-service/
│ ├── src/
│ │ ├── main.ts
│ │ ├── app.module.ts
│ │ └── modules/
│ │ └── template/
│ │ ├── template.controller.ts
│ │ ├── template.service.ts
│ │ ├── schemas/
│ │ └── template.module.ts
│ ├── Dockerfile
│ └── package.json
│
├── queue-service/ # optional message queue handler or scheduler
│ ├── src/
│ │ ├── main.ts
│ │ ├── app.module.ts
│ │ └── jobs/
│ │ ├── consumer.ts
│ │ ├── producer.ts
│ │ └── scheduler.ts
│ ├── Dockerfile
│ └── package.json
│
└── README.md
