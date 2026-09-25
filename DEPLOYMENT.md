# Bhagya Commerce — Production Deployment & Operations Guide

Production architecture, CI/CD, SSL/TLS, Cloudflare CDN/WAF, PostgreSQL backups, Redis, Cloudflare R2, and release workflows.

---

## 🏛 1. Production Architecture Overview

```
                                  INTERNET
                                     │
                             CLOUDFLARE EDGE
                     (DNS / CDN / WAF / TLS / DDoS)
                      ┌──────────────┴──────────────┐
                      ▼                             ▼
              Next.js Frontend              Spring Boot 3 API
         (https://bhagya.commerce)     (https://api.bhagya.commerce)
                      │                             │
                      │                   ┌─────────┼─────────┐
                      │                   ▼         ▼         ▼
                      │              PostgreSQL   Redis      R2
                      │                (ACID)    (Cache)  (Objects)
                      │                             │
                      │                           Worker
                      │                             │
                      │                      Multi-Channel
                      │                  Email / WhatsApp / SMS
                      │
                      └─────── Public HTTPS / Browser Direct ──────┘
```

---

## 🌐 2. Domain & Routing Topology

| Subdomain / Host | Service | Routing / Target | CDN Caching Policy |
|---|---|---|---|
| `bhagya.commerce` / `www` | Next.js Frontend | Edge / Vercel Serverless | Static assets & SSG pages cached; Dynamic user pages `no-store` |
| `api.bhagya.commerce` | Spring Boot REST API | Docker / Managed Container (Port 8080) | `Cache-Control: no-store, private` (Zero edge caching of private API endpoints) |
| `media.bhagya.commerce` | Cloudflare R2 | Custom Domain on Cloudflare R2 Bucket | Public images/media cached at edge with long TTLs (`max-age=31536000`) |

---

## 🔒 3. SSL, Security Headers & WAF Configuration

### Cloudflare WAF & Security Rules
- **SSL/TLS Mode**: Full (Strict) — Origin server presents verified TLS certificate.
- **Minimum TLS Version**: TLS 1.3 (TLS 1.2 minimum fallback).
- **HSTS**: Enabled with `max-age=63072000`, `includeSubDomains`, and `preload`.
- **Bot Management / Rate Limiting**:
  - `POST /api/v1/auth/*`: 10 requests / minute per IP
  - `POST /api/v1/payments/session`: 20 requests / minute per IP
  - `POST /api/v1/ai/chat`: 30 requests / minute per IP
  - `POST /api/v1/media/upload-url`: 30 requests / minute per IP

### HTTP Security Headers (Enforced via `next.config.ts` & Spring Security)
```http
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(self), payment=(self)
```

---

## 🚀 4. Deployment Instructions

### Prerequisites
- **PostgreSQL 16** with SSL enabled
- **Redis 7** (password protected, persistence enabled)
- **Cloudflare R2** bucket (`bhagya-commerce-media-prod`)
- **Docker 24+** & **Docker Compose**

### Production Environment Variables (`.env`)
```bash
# PostgreSQL
DATABASE_URL=jdbc:postgresql://db-host.internal:5432/bhagya_commerce?sslmode=require
DATABASE_USERNAME=bhagya_app_user
DATABASE_PASSWORD=your_secure_db_password

# Redis
REDIS_HOST=redis.internal
REDIS_PORT=6379
REDIS_PASSWORD=your_secure_redis_password

# Cloudflare R2
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET=bhagya-commerce-media-prod
R2_PUBLIC_BASE_URL=https://media.bhagya.commerce

# Security & JWT
JWT_SECRET=your_production_256_bit_jwt_secret_key!
FRONTEND_URL=https://bhagya.commerce

# Real External Providers
PAYMENT_PROVIDER=razorpay
PAYMENT_KEY_ID=rzp_live_your_live_key
PAYMENT_KEY_SECRET=your_live_razorpay_secret
PAYMENT_WEBHOOK_SECRET=your_live_webhook_secret

EMAIL_PROVIDER=resend
EMAIL_API_KEY=re_your_live_api_key

WHATSAPP_PROVIDER=meta_whatsapp
WHATSAPP_API_KEY=your_meta_system_user_token
WHATSAPP_PHONE_NUMBER_ID=your_live_wa_phone_id

SMS_PROVIDER=twilio
SMS_API_KEY=your_sms_api_key
```

### Launching Services via Docker Compose
```bash
docker compose -f docker-compose.prod.yml up -d
```

---

## 🗄 5. Database Migrations & Zero-Downtime Rollouts

1. **Schema Evolution**: Flyway automatically validates and applies migration scripts (`V1__init_schema.sql`, `V2__complete_step12_schema.sql`, `V3__payment_webhooks_and_notifications.sql`) upon Spring Boot startup.
2. **Zero-Downtime Rule**:
   - All migrations must be **additive** (e.g. add nullable columns, add new tables, add indexes concurrently).
   - Old application instances and new instances can coexist safely during rolling container updates.
3. **Hibernate Setting**: `spring.jpa.hibernate.ddl-auto=validate` prevents Hibernate from altering tables at runtime.

---

## 💾 6. Backup & Disaster Recovery Strategy

### PostgreSQL Automated Backups
- **Daily Snapshots**: Automated full backup executed daily at 02:00 UTC with 30-day retention.
- **WAL Archiving**: Continuous WAL (Write-Ahead Logging) archiving to Cloudflare R2 / S3 for Point-in-Time Recovery (PITR) up to 7 days.
- **Restore Verification**: Monthly automated restore rehearsal to verify backup integrity.

### Cloudflare R2 Object Storage Resilience
- Cloudflare R2 provides 99.999999999% (11 9's) durability with multi-zone geographic replication.
- Object versioning enabled on `bhagya-commerce-media-prod` bucket to prevent accidental file deletion.

---

## 🔄 7. Rollback Procedures

### Frontend Rollback
- In Vercel / Next.js hosting, promote the previous successful deployment hash via Instant Rollback (takes < 5 seconds).

### Backend Rollback
- Roll back container image tag in deployment manifest:
  ```bash
  docker compose -f docker-compose.prod.yml up -d --no-deps api
  ```
- Because database migrations are strictly non-destructive and backward-compatible, previous backend releases can safely communicate with the database schema.

---

## 📋 8. Post-Deployment Smoke Test Checklist

- [x] **Storefront**: Browse homepage, categories, PDPs, and craft brand rails on `https://bhagya.commerce`.
- [x] **Cart & Checkout**: Add items, apply addresses, select delivery method, and advance to payment stepper.
- [x] **Payment Session**: Initialize payment session with authoritative server-side amount calculation.
- [x] **Webhook Verification**: Deliver test webhook payload and verify HMAC-SHA256 signature validation.
- [x] **Order Fulfillment**: Check order creation, order number generation (`BG-YYYYMMDD-XXXXXX`), and Delhivery shipment timeline.
- [x] **Multi-Channel Alerts**: Verify in-app notifications and async worker execution for Email, WhatsApp, and SMS.
- [x] **Merchant Workspace**: Authenticate as merchant, view dashboard analytics, manage products, and inspect inventory levels.
- [x] **Bhagya AI**: Execute natural language product discovery and safe tool calls.
- [x] **Security Validation**: Confirm unauthenticated calls return 401, unauthorized calls return 403, and zero secrets appear in logs or client bundles.
