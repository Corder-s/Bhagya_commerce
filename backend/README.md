# Bhagya Commerce — Backend Service (Step 11 Architecture)

Production-grade modular monolith backend for Bhagya Commerce built with **Java 21**, **Spring Boot 3.4.3**, **Spring Security**, **Spring Data JPA**, **Flyway**, **Actuator**, and **OpenAPI (Swagger)**.

---

## 🏛 Architecture Overview

```
Next.js Frontend (Port 3000)
       ↓ (REST JSON + JWT / Bearer + X-Request-Id)
Spring Boot Modular Monolith (Port 8080)
       ├── com.bhagya.commerce.config
       ├── com.bhagya.commerce.common (api, error, security, logging, util)
       ├── com.bhagya.commerce.auth
       ├── com.bhagya.commerce.user
       ├── com.bhagya.commerce.organization
       ├── com.bhagya.commerce.store
       ├── com.bhagya.commerce.catalog (product, category)
       ├── com.bhagya.commerce.inventory
       ├── com.bhagya.commerce.cart
       ├── com.bhagya.commerce.checkout
       ├── com.bhagya.commerce.order
       ├── com.bhagya.commerce.payment
       ├── com.bhagya.commerce.shipping
       ├── com.bhagya.commerce.notification
       ├── com.bhagya.commerce.merchant
       ├── com.bhagya.commerce.ai
       ├── com.bhagya.commerce.admin
       └── com.bhagya.commerce.audit
       ↓
Persistence Abstraction (Step 11 Development Adapters → Step 12 PostgreSQL)
```

---

## 🚀 Quick Start

### Requirements
- **Java 21** or higher (tested with OpenJDK 21 / 25)
- **Maven 3.9+** (or use included wrappers)

### Running Locally
```bash
cd backend
mvn spring-boot:run
```

The server starts on `http://localhost:8080`.

### Running Tests
```bash
cd backend
mvn test
```

---

## 📚 API Endpoints Summary

All public API routes are prefixed with `/api/v1/`:

| Domain | Method & Path | Description | Access |
|---|---|---|---|
| **Auth** | `POST /api/v1/auth/login` | Email/Password login | Public |
| | `POST /api/v1/auth/register` | Customer account registration | Public |
| | `POST /api/v1/auth/otp/send` | Send SMS OTP | Public |
| | `POST /api/v1/auth/otp/verify` | Verify OTP and authenticate | Public |
| **User** | `GET /api/v1/users/me` | Current authenticated user profile | Authenticated |
| | `PATCH /api/v1/users/me` | Update customer profile | Authenticated |
| | `GET /api/v1/users/me/preferences` | User theme & locale preferences | Authenticated |
| **Catalog** | `GET /api/v1/products` | Search & filter products (pagination) | Public |
| | `GET /api/v1/products/{id}` | Product details by ID or slug | Public |
| | `GET /api/v1/categories` | Browse category hierarchy | Public |
| **Cart** | `GET /api/v1/cart` | Active shopping cart for session/user | Public / Auth |
| | `POST /api/v1/cart/items` | Add item to cart | Public / Auth |
| | `PATCH /api/v1/cart/items/{id}`| Update cart item quantity | Public / Auth |
| | `DELETE /api/v1/cart/items/{id}`| Remove cart item | Public / Auth |
| **Checkout** | `POST /api/v1/checkout/validate` | Authoritative cart & pricing validation | Authenticated |
| | `POST /api/v1/checkout/session` | Create checkout session | Authenticated |
| **Orders** | `GET /api/v1/orders` | Customer's order history | Authenticated |
| | `GET /api/v1/orders/{id}` | Single order details (with ownership check)| Authenticated |
| | `POST /api/v1/orders` | Place new order (authoritative ID: `BG-YYYYMMDD-XXXXXX`) | Authenticated |
| | `POST /api/v1/orders/{id}/cancel` | Cancel order | Authenticated |
| **Payments** | `POST /api/v1/payments/session` | Create gateway session (Razorpay/Cashfree) | Authenticated |
| | `POST /api/v1/payments/verify` | Authoritative signature verification | Authenticated |
| | `POST /api/v1/payments/webhook` | Asynchronous gateway webhook listener | Gateway |
| **Shipping** | `GET /api/v1/orders/{id}/tracking` | Real-time tracking timeline | Authenticated |
| | `GET /api/v1/orders/{id}/shipment` | Shipment courier details | Authenticated |
| **Notifications** | `GET /api/v1/notifications` | User alerts & updates | Authenticated |
| | `GET /api/v1/notifications/unread-count` | Notification badge count | Authenticated |
| | `POST /api/v1/notifications/read-all` | Mark all notifications read | Authenticated |
| **Merchant** | `GET /api/v1/merchant/dashboard/overview` | Merchant KPIs & live sales analytics | Merchant / Admin |
| | `GET /api/v1/merchant/orders` | Store orders | Merchant / Admin |
| | `GET /api/v1/merchant/products` | Store products | Merchant / Admin |
| | `GET /api/v1/merchant/inventory`| Inventory stock & low-stock alerts | Merchant / Admin |
| | `GET /api/v1/merchant/store` | Merchant store settings | Merchant / Admin |
| | `POST /api/v1/merchant/onboarding` | Merchant business onboarding & verification | Authenticated |
| **AI** | `POST /api/v1/ai/chat` | Safe natural language assistant & tool runner | Public / Auth |
| | `GET /api/v1/ai/conversations` | Conversation history threads | Authenticated |
| **Actuator** | `GET /actuator/health` | Health & readiness probe | Public |
| | `GET /actuator/info` | Application metadata | Public |
| **OpenAPI** | `GET /v3/api-docs` | OpenAPI 3.0 specification | Public |
| | `GET /swagger-ui.html` | Interactive Swagger documentation | Public |

---

## 🔒 Security & Authorization

- **Stateless JWT**: Standard Bearer token authentication via `JwtAuthenticationFilter`.
- **RBAC & Hierarchy**: Roles include `ROLE_CUSTOMER`, `ROLE_MERCHANT`, `ROLE_ADMIN`.
- **Strict Data Isolation**:
  - Customer A cannot access Customer B's orders or addresses.
  - Merchant Store A cannot view or modify products/orders of Store B.
  - Store identity is verified strictly via `OrganizationMember` context, never from client-supplied `storeId` alone.
- **Request Correlation**: MDC-backed `X-Request-Id` attached to every request and response.

---

## ⚙️ Configuration Profiles

- `application.yml`: Base defaults & actuator configuration.
- `application-dev.yml`: Local development with CORS enabled for `http://localhost:3000`.
- `application-prod.yml`: Strict CORS and production environment variable bindings (`DATABASE_URL`, `JWT_SECRET`, etc.).
- `application-test.yml`: In-memory isolated test configuration.

---

## 📦 What is Implemented in Step 11 vs Step 12

| Feature | Step 11 (This Step) | Step 12 (Next Step) |
|---|---|---|
| **API Architecture** | Complete `/api/v1` REST Monolith | Unchanged |
| **DTO / Domain Layer** | Full Separation & Validations | Unchanged |
| **Persistence** | Flyway V1 DDL + Development Repositories | Live PostgreSQL 16 Instance |
| **Caching / Sessions** | Concurrent In-Memory Stores | Redis Cache & Distributed Lock |
| **Media Assets** | `ObjectStorageService` Abstraction | Cloudflare R2 S3-Compatible Storage |
| **Payment Gateways** | `PaymentProvider` SPI + Session Contract | Live Razorpay / Cashfree SDKs |
| **AI Backend** | Safe Tool Orchestrator & Rule Parser | Google Gemini Pro Live API |
