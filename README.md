# 🎯 InternBridge - Internship Recruitment Platform

InternBridge is a microservices-based platform that connects students with businesses for internship opportunities.

---

## 🧱 System Architecture

![SystemArchitechtureDesign](https://github.com/user-attachments/assets/8dad0c6c-a9cd-43bc-bf7d-7e0dd0d48551)


### 🧩 Microservices Overview

| Service               | Description                                             |
|----------------------|---------------------------------------------------------|
| Identity Service      | Handles authentication (JWT, Google OAuth), user roles |
| Profile Service       | Manages student & business profiles                     |
| Recruitment Service   | Manages job postings, applications, interviews         |
| Notification Service  | Sends real-time notifications (email, in-app, etc.)    |
| API Gateway           | Entry point for all client requests                     |
| Eureka Server         | Service discovery for microservices                    |

---

## ⚙️ Tech Stack

- **Frontend**: ReactJS, TypeScript
- **Backend**: Spring Boot (Java)
- **Service Communication**: REST + RabbitMQ (async events)
- **Databases**:
  - MariaDB (Profile, Identity, Recruitment)
  - MongoDB (Notification)
  - Redis (Access token blacklist)
- **Others**: Eureka, Spring Cloud Gateway, Docker, RabbitMQ

---

## 🚀 Getting Started

### 🐳 Run with Docker Compose

```bash
docker-compose up --build
