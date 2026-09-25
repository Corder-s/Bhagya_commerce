# Bhagya Commerce — Analytics & Event Intelligence Definitions

## 1. Primary Principle
Analytics in Bhagya Commerce must always reflect verified business events and authoritative data from PostgreSQL. We do not extrapolate or display ungrounded estimates as verified financial truth.

---

## 2. Core Financial Metric Formulas

| Metric | Business Definition | Mathematical Formula | Authoritative Source |
| :--- | :--- | :--- | :--- |
| **Gross Sales** | Total subtotal value of non-cancelled orders before discounts or adjustments. | Sum(Subtotal) for all orders where Status != CANCELLED | `orders.subtotal_inr` |
| **Discounts** | Total promotional and coupon reductions applied across orders in the period. | Sum(Discount) for non-cancelled orders | `orders.discount_inr` |
| **Refunds** | Total value refunded on returned or cancelled orders with approved refunds. | Sum(Total) for orders where PaymentStatus = REFUNDED | `orders.total_inr`, `payments` |
| **Net Sales** | Authoritative revenue retained by the store. | Gross Sales - Discounts - Refunds | Calculated Server-Side |
| **Average Order Value (AOV)** | Average revenue generated per verified paid order. | Net Sales / Paid & Completed Orders Count | Calculated Server-Side |

---

## 3. Order & Fulfillment Metrics

- **Total Orders**: All placed orders recorded in the period.
- **Confirmed Orders**: Orders acknowledged and verified.
- **Processing Orders**: Orders currently packed/produced by artisans.
- **Shipped / In Transit**: Dispatched with courier AWB tracking.
- **Delivered Orders**: Successfully handed over to the customer.
- **Cancellation Rate**: `(Cancelled Orders / Total Orders) * 100`
- **Refund Rate**: `(Refunded Orders / Total Orders) * 100`

---

## 4. Conversion Funnel Definitions

The standard 5-step e-commerce conversion funnel:
1. **Product Viewed** (`PRODUCT_VIEWED`): Unique visits to PDPs.
2. **Added to Cart** (`PRODUCT_ADDED_TO_CART`): Line items placed in the active cart.
3. **Checkout Started** (`CHECKOUT_STARTED`): Customer begins the delivery and billing steps.
4. **Payment Started** (`PAYMENT_STARTED`): Gateway intent or UPI flow opened.
5. **Order Completed** (`ORDER_CREATED` / `PAYMENT_COMPLETED`): Order placed in database.

- **Step Conversion Rate**: `(Count(Step_n) / Count(Step_n-1)) * 100`
- **Overall Conversion Rate**: `(Orders Completed / Product Views) * 100`

---

## 5. Customer Intelligence & Retention

- **New Customers**: Customers whose first recorded completed order occurred within the selected date range.
- **Returning Customers**: Customers who have at least one completed order prior to the window or multiple orders within the window.
- **Repeat Customer Rate**: `(Returning Customers / Total Active Customers in Window) * 100`
- **Average Customer Value (ACV)**: `Net Sales in Window / Total Active Customers in Window`

---

## 6. Event Taxonomy Reference

### Customer Events
- `SESSION_STARTED`, `PRODUCT_VIEWED`, `SEARCH_PERFORMED`, `CATEGORY_VIEWED`, `COLLECTION_VIEWED`, `PRODUCT_ADDED_TO_CART`, `PRODUCT_REMOVED_FROM_CART`, `WISHLIST_ADDED`, `WISHLIST_REMOVED`, `CHECKOUT_STARTED`, `ADDRESS_SELECTED`, `DELIVERY_SELECTED`, `PAYMENT_STARTED`, `PAYMENT_COMPLETED`, `PAYMENT_FAILED`, `ORDER_CREATED`, `ORDER_DELIVERED`, `PRODUCT_REVIEWED`.

### Merchant Events
- `MERCHANT_LOGIN`, `STORE_VIEWED`, `PRODUCT_CREATED`, `PRODUCT_UPDATED`, `PRODUCT_ARCHIVED`, `INVENTORY_UPDATED`, `ORDER_VIEWED`, `ORDER_UPDATED`, `STORE_UPDATED`, `CAMPAIGN_CREATED`.

### Platform Events
- `USER_REGISTERED`, `STORE_CREATED`, `SUBSCRIPTION_CREATED`, `SUBSCRIPTION_CHANGED`, `SUPPORT_TICKET_CREATED`.

---

## 7. Data Privacy, Minimization & Retention

- **PII Scrubbing**: Passwords, tokens, CVV, UPI PINs, raw secrets, and sensitive billing details are strictly prohibited from `analytics_events.metadata`.
- **Anonymized Sessions**: Client tracking utilizes session UUIDs rather than intrusive device fingerprinting.
- **Retention Strategy**:
  - Raw behavioral client events (`PRODUCT_VIEWED`, `SEARCH_PERFORMED`): Retained for **90 days**, then aggregated or pruned.
  - Authoritative commerce records (`orders`, `payments`, `audit_logs`): Governed by financial compliance rules (**7 years**).
- **PostgreSQL Partitioning Roadmap**:
  - Future scale will partition `analytics_events` by range on `occurred_at` (`PARTITION BY RANGE (occurred_at)`) on monthly intervals.
