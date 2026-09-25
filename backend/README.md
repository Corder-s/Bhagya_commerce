# Bhagya Commerce — Backend Infrastructure & API (Step 12)

Production-grade modular monolith backend for Bhagya Commerce built with **Java 21**, **Spring Boot 3.4.3**, **PostgreSQL 16**, **Redis 7**, and **Cloudflare R2** (S3-Compatible API).

---

## 🏛 The Golden Architectural Rule

| Layer | Responsibility | Technology | Storage Type |
|---|---|---|---|
| **Business Truth** | Permanent, transactional, ACID-compliant business data (Orders, Users, Stores, Products, Inventory, Payments) | **PostgreSQL 16** (Spring Data JPA + Hibernate) | Relational Database |
| **Cache & Temporary** | Fast read cache, background job queue, sliding-window rate limiting, and idempotency deduplication | **Redis 7** (Lettuce + Jackson JSON) | In-Memory Key-Value Store |
| **Media & Files** | Product photos, artisan videos, store branding logos, banners, invoices, and documents | **Cloudflare R2** (S3-Compatible API) | Distributed Object Storage |

> [!IMPORTANT]
> - **PostgreSQL** is the sole source of truth. Redis is NOT the source of truth for business data.
> - **Cloudflare R2** stores binary objects directly via browser presigned URLs; PostgreSQL stores object metadata (`object_key`, `mime_type`, `size_bytes`, `public_url`).
> - **No Bytea**: Image binaries are never stored in PostgreSQL.

---

## 🚀 Quick Start (Local Development)

### 1. Requirements
- **Java 21** or higher
- **Docker** and **Docker Compose**
- **Maven 3.9+**

### 2. Start PostgreSQL & Redis via Docker
```bash
cd backend
docker compose -f docker-compose.dev.yml up -d
```
This provisions:
- **PostgreSQL 16** on `localhost:5432` (`db: bhagya_commerce`, `user: bhagya_user`)
- **Redis 7** on `localhost:6379` (protected with password)

### 3. Configure Environment
Copy `.env.example` to `.env` or set environment variables:
```bash
DATABASE_URL=jdbc:postgresql://localhost:5432/bhagya_commerce
DATABASE_USERNAME=bhagya_user
DATABASE_PASSWORD=bhagya_secret_pass_2026

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=bhagya_redis_pass_2026

R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET=bhagya-commerce-media
R2_PUBLIC_BASE_URL=https://media.bhagya.commerce
```

### 4. Run Spring Boot Backend
```bash
cd backend
mvn spring-boot:run
```
Flyway automatically executes all ordered migrations:
- `V1__init_schema.sql` (Core Users, Stores, Products, Orders, Payments, Notifications)
- `V2__complete_step12_schema.sql` (Variants, R2 Media Metadata, Collections, Inventory `@Version`, Coupons, Reviews, Subscriptions, Audit Logs)

---

## 📦 Cloudflare R2 Presigned Upload Flow

```
Browser (Next.js)
   │
   │  1. POST /api/v1/media/upload-url (filename, contentType, sizeBytes, entityType, entityId)
   ▼
Spring Boot API (R2StorageService)
   │
   │  2. Validates merchant authorization & MIME/size constraints
   │  3. Generates presigned PUT URL with 15-minute expiration
   │
   ▼  Returns { uploadUrl, objectKey, publicUrl }
Browser (Next.js)
   │
   │  4. Direct PUT binary payload to Cloudflare R2 uploadUrl
   ▼
Cloudflare R2 Object Storage
   │
   │  5. Browser notifies API: POST /api/v1/media/complete
   ▼
Spring Boot API → Saves metadata in PostgreSQL (product_media / store_media)
```

### Object Key Structure
- Products: `stores/{storeId}/products/{productId}/original/{uuid}-{filename}`
- Store Logo: `stores/{storeId}/branding/logo/{uuid}-{filename}`
- Store Banner: `stores/{storeId}/branding/banner/{uuid}-{filename}`
- Documents: `stores/{storeId}/documents/{uuid}-{filename}`

---

## ⚡ Redis Caching & Queue Specifications

1. **CacheService**:
   - `product:{idOrSlug}` (TTL: 24h)
   - `store:{storeId}` (TTL: 12h)
   - `category:{slug}` (TTL: 24h)
   - `catalog:search:*` (TTL: 15m)
   - Automatic prefix invalidation on product/store updates (`deleteByPrefix("catalog:search")`).
2. **JobQueue**:
   - Asynchronous background job queue (`bhagya:job_queue`) supporting retries and execution metadata for notifications, image optimization, reports, and AI tasks.
3. **IdempotencyService**:
   - Stores request fingerprints and results for payment session creation, order placement, and webhook handlers (`idempotency:{key}`).
4. **RateLimitService**:
   - Sliding-window Redis counters for authentication, OTP generation, AI chats, and public searches.

---

## 🔒 Inventory Concurrency & Anti-Overselling

- `inventory` table uses `@Version private Long version;` for optimistic locking.
- Stock reservation (`reserveInventory`), commit (`commitInventory`), and release (`releaseInventory`) are executed within database transactions.
- Zero overselling under simultaneous checkouts.

---

## 🧪 Test Suite

Run unit and integration tests:
```bash
cd backend
mvn test
```

Includes:
- `CacheServiceTest`: Caching, TTLs, and prefix invalidation.
- `JobQueueTest`: Enqueueing, dequeueing, and retry attempt tracking.
- `R2StorageServiceTest`: Presigned PUT URL generation and MIME/size validation.
- `InventoryConcurrencyTest`: Stock availability, reservation, and oversell prevention.
- `IdempotencyServiceTest`: Deduplication and result replay.
- `OrderOwnershipTest`: Order authorization isolation.
- `MerchantAuthorizationTest`: Store membership checks.
- `AuthenticationTest`: JWT issuance and OTP validation.
