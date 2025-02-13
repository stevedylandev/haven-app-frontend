# Backend Structure Documentation

## Overview

This document details the architectural design and structure for the backend services of the project. The backend is built using NestJS with a microservices approach, leveraging NATS for inter-service communication.

## Technology Stack

- **Framework**: NestJS
- **Communication**: NATS message broker
- **Architecture**: Microservices based
- **Database**: PostgreSQL (for user data and transactions)
- **Blockchain Integration**: Solana for wallet and transaction management

## Architectural Overview

- **API Gateway**: Central entry point for client requests.
- **Microservices**:
  - User Management Service
  - Video Processing Service
  - Bet Settlement Service
  - Notification Service
- **Event Bus**: NATS is used for reliable, low-latency message delivery between services.

## Directory Structure

Example directory structure for the backend:

```
nest-backend/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── common/
│   │   └── filters, interceptors, pipes, etc.
│   ├── services/
│   │   ├── user/
│   │   │   ├── user.module.ts
│   │   │   ├── user.controller.ts
│   │   │   └── user.service.ts
│   │   ├── video/
│   │   │   ├── video.module.ts
│   │   │   ├── video.controller.ts
│   │   │   └── video.service.ts
│   │   ├── bet/
│   │   │   ├── bet.module.ts
│   │   │   ├── bet.controller.ts
│   │   │   └── bet.service.ts
│   │   └── notification/
│   │       ├── notification.module.ts
│   │       ├── notification.controller.ts
│   │       └── notification.service.ts
│   └── microservices/
│       ├── nats-client.ts
│       └── microservice.options.ts
└── package.json
```

## Microservices Communication with NATS

- Each service registers with the NATS server to publish and subscribe to events.
- Services communicate via events and RPC-style messages.
- NATS ensures reliable, low-latency delivery.
- **Example Events**:
  - `user.created`
  - `video.processed`
  - `bet.settled`

## Service Modules

### User Management Service

- **Responsibilities**:
  - Handle user registration, authentication, and profile management.
  - Integrate with Solana wallets for user identification and transaction signing.

### Video Processing Service

- **Responsibilities**:
  - Manage video uploads, clip segmentation, and metadata extraction.
  - Interface with IPFS for video storage and retrieval.

### Bet Settlement Service

- **Responsibilities**:
  - Process and settle bets based on user predictions.
  - Validate transactions using Solana wallet signatures.

### Notification Service

- **Responsibilities**:
  - Send real-time notifications for bet settlements and wallet actions.
  - Integrate with frontend for immediate user feedback.

## API Gateway

- Acts as the single entry point for client HTTP requests.
- Routes requests to appropriate microservices.
- Handles request validation, authentication, and rate limiting.

## Security and Scalability

- End-to-end encryption for all data in transit.
- Secure storage and management for sensitive keys and credentials.
- Horizontal scalability achieved through microservices architecture.
- Services can be independently scaled based on load.

## Conclusion

The backend leverages NestJS and NATS to build a scalable, maintainable, and efficient system. Each microservice is designed to handle specific domains of the application, ensuring clear separation of concerns and robust communication via the event bus.
