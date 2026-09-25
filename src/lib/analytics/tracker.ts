'use client';

import { analyticsApiService } from '../api/services';

const SESSION_STORAGE_KEY = 'bhagya_analytics_session_id';

export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'sess_ssr';

  try {
    let sessId = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessId) {
      sessId = 'sess_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
      sessionStorage.setItem(SESSION_STORAGE_KEY, sessId);
    }
    return sessId;
  } catch {
    return 'sess_fallback';
  }
}

export function getUtmParameters(): Record<string, string> {
  if (typeof window === 'undefined') return {};

  try {
    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']) {
      const val = params.get(key);
      if (val) utm[key] = val;
    }
    return utm;
  } catch {
    return {};
  }
}

export async function trackEvent(
  eventType: string,
  options?: {
    storeId?: string;
    entityType?: string;
    entityId?: string;
    properties?: Record<string, unknown>;
  }
): Promise<void> {
  if (typeof window === 'undefined') return;

  // Respect browser Do Not Track preference
  if (navigator.doNotTrack === '1') return;

  try {
    const sessionId = getOrCreateSessionId();
    const utm = getUtmParameters();
    const mergedProps = {
      ...utm,
      ...(options?.properties || {}),
    };

    const eventId = 'evt_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);

    await analyticsApiService.ingestEvent({
      eventId,
      eventType,
      storeId: options?.storeId,
      sessionId,
      entityType: options?.entityType,
      entityId: options?.entityId,
      properties: mergedProps,
    });
  } catch {
    // Non-blocking silent failure for client analytics
  }
}

export const BhagyaTracker = {
  trackProductView: (productId: string, storeId?: string, category?: string, price?: number) => {
    trackEvent('PRODUCT_VIEWED', {
      storeId,
      entityType: 'PRODUCT',
      entityId: productId,
      properties: { category, price },
    });
  },

  trackAddToCart: (productId: string, storeId?: string, quantity: number = 1, price?: number) => {
    trackEvent('PRODUCT_ADDED_TO_CART', {
      storeId,
      entityType: 'PRODUCT',
      entityId: productId,
      properties: { quantity, price },
    });
  },

  trackSearch: (query: string, resultCount: number) => {
    trackEvent('SEARCH_PERFORMED', {
      properties: { query, resultCount },
    });
  },

  trackCheckoutStarted: (cartId: string, total: number, storeId?: string) => {
    trackEvent('CHECKOUT_STARTED', {
      storeId,
      entityType: 'CART',
      entityId: cartId,
      properties: { total },
    });
  },

  trackPaymentStarted: (orderId: string, amount: number, method: string, storeId?: string) => {
    trackEvent('PAYMENT_STARTED', {
      storeId,
      entityType: 'ORDER',
      entityId: orderId,
      properties: { amount, method },
    });
  },
};
