/**
 * Payment Service wrapper re-exporting the provider-neutral PaymentService.
 * Maintains compatibility across features and services.
 */
export * from "@/features/payment/payment-types";
export { paymentService, createIdempotencyKey } from "@/features/payment/payment.service";
