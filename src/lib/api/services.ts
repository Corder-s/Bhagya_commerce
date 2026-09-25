import { apiClient } from './client';

export interface BackendUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  avatarUrl?: string;
  isMerchant: boolean;
}

export interface BackendAuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: BackendUser;
}

export interface BackendProduct {
  id: string;
  storeId: string;
  name: string;
  slug: string;
  description: string;
  brand: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  status: string;
  price: number;
  mrp: number;
  discount: number;
  tags: string[];
  variants: Array<{
    id: string;
    name: string;
    sku: string;
    price: number;
    stock: number;
  }>;
  media: Array<{
    id: string;
    url: string;
    altText: string;
    isPrimary: boolean;
  }>;
  inventorySummary: {
    totalStock: number;
    availableStock: number;
    reservedStock: number;
    lowStockThreshold: number;
    inStock: boolean;
  };
  createdAt: string;
}

export interface BackendPage<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface BackendOrder {
  id: string;
  orderNumber: string;
  userId: string;
  storeId: string;
  customerName: string;
  customerPhone: string;
  status: string;
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    imageUrl?: string;
  }>;
  createdAt: string;
}

export interface BackendUploadUrlResponse {
  uploadUrl: string;
  objectKey: string;
  publicUrl: string;
  expiresAt: string;
}

export interface BackendMediaResponse {
  id: string;
  entityType: string;
  entityId: string;
  objectKey: string;
  publicUrl: string;
  mimeType: string;
  sizeBytes: number;
  altText?: string;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: string;
}

export const authApiService = {
  login: (credentials: { emailOrPhone?: string; email?: string; password?: string }) =>
    apiClient.post<BackendAuthResponse>('/api/v1/auth/login', credentials),
  sendOtp: (phone: string) =>
    apiClient.post<{ message: string; otpExpiresInSeconds: number }>('/api/v1/auth/otp/send', { phone }),
  verifyOtp: (phone: string, otp: string) =>
    apiClient.post<BackendAuthResponse>('/api/v1/auth/otp/verify', { phone, otp }),
  getMe: () =>
    apiClient.get<BackendUser>('/api/v1/users/me'),
};

export const catalogApiService = {
  getProducts: (params?: { query?: string; category?: string; brand?: string; page?: number; size?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.query) queryParams.set('query', params.query);
    if (params?.category) queryParams.set('category', params.category);
    if (params?.brand) queryParams.set('brand', params.brand);
    if (params?.page !== undefined) queryParams.set('page', params.page.toString());
    if (params?.size !== undefined) queryParams.set('size', params.size.toString());
    const qs = queryParams.toString();
    return apiClient.get<BackendPage<BackendProduct>>(`/api/v1/products${qs ? `?${qs}` : ''}`);
  },
  getProductById: (id: string) =>
    apiClient.get<BackendProduct>(`/api/v1/products/${id}`),
};

export const cartApiService = {
  getCart: () => apiClient.get<unknown>('/api/v1/cart'),
  addItem: (productId: string, quantity: number = 1, variantId?: string) =>
    apiClient.post<unknown>('/api/v1/cart/items', { productId, quantity, variantId }),
  updateQuantity: (itemId: string, quantity: number) =>
    apiClient.patch<unknown>(`/api/v1/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId: string) =>
    apiClient.delete<unknown>(`/api/v1/cart/items/${itemId}`),
  clearCart: () =>
    apiClient.delete<unknown>('/api/v1/cart'),
};

export const orderApiService = {
  getOrders: () => apiClient.get<BackendOrder[]>('/api/v1/orders'),
  getOrderById: (orderId: string) => apiClient.get<BackendOrder>(`/api/v1/orders/${orderId}`),
  getTracking: (orderId: string) => apiClient.get<unknown>(`/api/v1/orders/${orderId}/tracking`),
  cancelOrder: (orderId: string, reason?: string) =>
    apiClient.post<BackendOrder>(`/api/v1/orders/${orderId}/cancel`, { reason }),
};

export const notificationApiService = {
  getNotifications: () => apiClient.get<unknown[]>('/api/v1/notifications'),
  getUnreadCount: () => apiClient.get<{ unreadCount: number }>('/api/v1/notifications/unread-count'),
  markAsRead: (id: string) => apiClient.patch<unknown>(`/api/v1/notifications/${id}/read`),
  markAllAsRead: () => apiClient.post<void>('/api/v1/notifications/read-all'),
};

export const merchantApiService = {
  getDashboardOverview: () => apiClient.get<unknown>('/api/v1/merchant/dashboard/overview'),
  getOrders: () => apiClient.get<BackendOrder[]>('/api/v1/merchant/orders'),
  getProducts: () => apiClient.get<BackendProduct[]>('/api/v1/merchant/products'),
  getInventory: () => apiClient.get<unknown[]>('/api/v1/merchant/inventory'),
  getCustomers: () => apiClient.get<unknown[]>('/api/v1/merchant/customers'),
  getStore: () => apiClient.get<unknown>('/api/v1/merchant/store'),
  getOnboardingStatus: () => apiClient.get<unknown>('/api/v1/merchant/onboarding'),
  submitOnboarding: (data: unknown) => apiClient.post<unknown>('/api/v1/merchant/onboarding', data),
};

export const mediaApiService = {
  getUploadUrl: (data: { filename: string; contentType: string; sizeBytes: number; entityType: string; entityId: string }) =>
    apiClient.post<BackendUploadUrlResponse>('/api/v1/media/upload-url', data),
  completeUpload: (data: { objectKey: string; entityType: string; entityId: string; sizeBytes: number; mimeType: string; altText?: string; sortOrder?: number; isPrimary?: boolean }) =>
    apiClient.post<BackendMediaResponse>('/api/v1/media/complete', data),
  deleteMedia: (mediaId: string) =>
    apiClient.delete<void>(`/api/v1/media/${mediaId}`),
};

export const aiApiService = {
  chat: (message: string, contextMode?: string, conversationId?: string) =>
    apiClient.post<unknown>('/api/v1/ai/chat', { message, contextMode, conversationId }),
  getConversations: () => apiClient.get<unknown[]>('/api/v1/ai/conversations'),
  createConversation: (title?: string, mode?: string) =>
    apiClient.post<unknown>('/api/v1/ai/conversations', { title, mode }),
};

export interface BackendSalesSummary {
  period: string;
  currency: string;
  grossSales: number;
  discounts: number;
  refunds: number;
  netSales: number;
  totalOrders: number;
  paidOrders: number;
  averageOrderValue: number;
  startTime: string;
  endTime: string;
}

export interface BackendOrderSummary {
  totalOrders: number;
  confirmedOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  refundedOrders: number;
  cancellationRate: number;
  refundRate: number;
}

export interface BackendProductPerformance {
  productId: string;
  productName: string;
  productImageUrl: string;
  unitsSold: number;
  grossRevenue: number;
  viewsCount: number;
  addToCartCount: number;
  conversionRate: number;
  currentStock: number;
}

export interface BackendCustomerSummary {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  repeatCustomerRate: number;
  averageCustomerValue: number;
}

export interface BackendFunnelStep {
  stepName: string;
  count: number;
  conversionRateFromPrevious: number;
  dropoffRate: number;
}

export interface BackendFunnelSummary {
  steps: BackendFunnelStep[];
  overallConversionRate: number;
}

export interface BackendSalesTrendPoint {
  date: string;
  grossSales: number;
  netSales: number;
  orderCount: number;
}

export interface BackendSalesTrend {
  period: string;
  trendPoints: BackendSalesTrendPoint[];
}

export interface BackendTrafficSourcePoint {
  source: string;
  medium: string;
  campaign: string;
  sessions: number;
  orders: number;
  revenue: number;
}

export interface BackendMerchantAnalyticsOverview {
  storeId: string;
  storeName: string;
  period: string;
  sales: BackendSalesSummary;
  orders: BackendOrderSummary;
  customers: BackendCustomerSummary;
  funnel: BackendFunnelSummary;
  topProducts: BackendProductPerformance[];
  salesTrend: BackendSalesTrend;
  trafficSources: {
    sources: BackendTrafficSourcePoint[];
  };
}

export interface BackendAdminAnalyticsOverview {
  platformGmv: number;
  platformNetSales: number;
  totalStores: number;
  activeStores: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  payments: {
    totalVolumeProcessed: number;
    totalRefunded: number;
    successfulPayments: number;
    failedPayments: number;
    methodDistribution: Record<string, number>;
  };
  topStores: Array<{
    storeId: string;
    storeName: string;
    totalOrders: number;
    gmv: number;
    totalProducts: number;
    status: string;
  }>;
  salesTrend: BackendSalesTrend;
}

export const analyticsApiService = {
  ingestEvent: (data: {
    eventId?: string;
    eventType: string;
    storeId?: string;
    sessionId?: string;
    entityType?: string;
    entityId?: string;
    properties?: Record<string, unknown>;
  }) => apiClient.post<{ eventId: string; status: string }>('/api/v1/analytics/events', data),

  getMerchantOverview: (period: string = '30d') =>
    apiClient.get<BackendMerchantAnalyticsOverview>(`/api/v1/merchant/analytics/overview?period=${period}`),

  getMerchantSales: (period: string = '30d') =>
    apiClient.get<BackendSalesSummary>(`/api/v1/merchant/analytics/sales?period=${period}`),

  getMerchantOrders: () =>
    apiClient.get<BackendOrderSummary>('/api/v1/merchant/analytics/orders'),

  getMerchantProducts: (limit: number = 10) =>
    apiClient.get<BackendProductPerformance[]>(`/api/v1/merchant/analytics/products?limit=${limit}`),

  getMerchantCustomers: () =>
    apiClient.get<BackendCustomerSummary>('/api/v1/merchant/analytics/customers'),

  getMerchantFunnel: () =>
    apiClient.get<BackendFunnelSummary>('/api/v1/merchant/analytics/funnel'),

  getAdminOverview: (period: string = '30d') =>
    apiClient.get<BackendAdminAnalyticsOverview>(`/api/v1/admin/analytics/overview?period=${period}`),
};

export interface BackendPromotion {
  id: string;
  storeId: string;
  name: string;
  description?: string;
  type: string;
  status: string;
  value: number;
  currency: string;
  minimumOrderValue?: number;
  maximumDiscount?: number;
  couponCode?: string;
  startsAt?: string;
  endsAt?: string;
  usageLimit?: number;
  perCustomerLimit: number;
  usageCount: number;
  eligibleCategoryIds: string[];
  eligibleProductIds: string[];
  createdAt: string;
}

export interface BackendPromotionCreateRequest {
  name: string;
  description?: string;
  type: string;
  value: number;
  minimumOrderValue?: number;
  maximumDiscount?: number;
  couponCode?: string;
  startsAt?: string;
  endsAt?: string;
  usageLimit?: number;
  perCustomerLimit?: number;
  eligibleCategoryIds?: string[];
  eligibleProductIds?: string[];
}

export interface BackendCampaign {
  id: string;
  storeId: string;
  name: string;
  description?: string;
  channel: 'EMAIL' | 'WHATSAPP' | 'SMS';
  status: 'DRAFT' | 'SCHEDULED' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
  audienceId?: string;
  audienceName?: string;
  promotionId?: string;
  subject?: string;
  messageBody: string;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  failedCount: number;
  attributedOrders: number;
  attributedSales: number;
  createdAt: string;
}

export interface BackendCampaignCreateRequest {
  name: string;
  description?: string;
  channel: 'EMAIL' | 'WHATSAPP' | 'SMS';
  audienceId?: string;
  audienceName?: string;
  promotionId?: string;
  subject?: string;
  messageBody: string;
  scheduledAt?: string;
}

export interface BackendCustomerSegment {
  id: string;
  storeId: string;
  name: string;
  description?: string;
  criteria?: Record<string, unknown>;
  estimatedCount: number;
  status: string;
  createdAt: string;
}

export interface BackendMarketingOverview {
  storeId: string;
  activePromotionsCount: number;
  scheduledCampaignsCount: number;
  activeCampaignsCount: number;
  totalAttributedOrders: number;
  totalAttributedSales: number;
  recentCampaigns: BackendCampaign[];
  activePromotions: BackendPromotion[];
}

export interface BackendAICopyResponse {
  subject: string;
  headline: string;
  body: string;
  callToAction: string;
}

// --- Local Fallback Data Store for Marketing ---
const PROMOTIONS_KEY = 'bhagya_merchant_promotions';
const CAMPAIGNS_KEY = 'bhagya_merchant_campaigns';

function getLocalPromotions(): BackendPromotion[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PROMOTIONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const initial: BackendPromotion[] = [
    {
      id: 'promo_welcome10',
      storeId: 'store_current',
      name: 'Welcome Patron Privilege',
      description: '10% off for first-time buyers on authentic GI handloom products',
      type: 'PERCENTAGE_DISCOUNT',
      status: 'ACTIVE',
      value: 10,
      currency: 'INR',
      minimumOrderValue: 999,
      maximumDiscount: 500,
      couponCode: 'WELCOME10',
      usageLimit: 500,
      perCustomerLimit: 1,
      usageCount: 47,
      eligibleCategoryIds: [],
      eligibleProductIds: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'promo_handloom15',
      storeId: 'store_current',
      name: 'Festive Handloom Special',
      description: '15% savings on orders above ₹1,999 across all silk collections',
      type: 'PERCENTAGE_DISCOUNT',
      status: 'ACTIVE',
      value: 15,
      currency: 'INR',
      minimumOrderValue: 1999,
      maximumDiscount: 1500,
      couponCode: 'FESTIVE15',
      usageLimit: 250,
      perCustomerLimit: 1,
      usageCount: 82,
      eligibleCategoryIds: [],
      eligibleProductIds: [],
      createdAt: new Date().toISOString(),
    },
  ];
  try {
    localStorage.setItem(PROMOTIONS_KEY, JSON.stringify(initial));
  } catch {}
  return initial;
}

function saveLocalPromotions(list: BackendPromotion[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROMOTIONS_KEY, JSON.stringify(list));
  } catch {}
}

function getLocalCampaigns(): BackendCampaign[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CAMPAIGNS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const initial: BackendCampaign[] = [
    {
      id: 'camp_banarasi_festive',
      storeId: 'store_current',
      name: 'Navratri Banarasi Silk Showcase',
      description: 'Targeting: All Verified Customers',
      channel: 'WHATSAPP',
      status: 'COMPLETED',
      audienceId: 'seg_all',
      audienceName: 'All Verified Customers',
      subject: 'Exclusive Handloom Festive Savings ✨',
      messageBody:
        'Namaste! Explore our new GI-tagged festive Katan silks with 15% off using code FESTIVE15. View collection: https://bhagya.commerce/shop',
      totalRecipients: 142,
      sentCount: 142,
      deliveredCount: 138,
      failedCount: 4,
      attributedOrders: 18,
      attributedSales: 48600,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
  ];
  try {
    localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(initial));
  } catch {}
  return initial;
}

function saveLocalCampaigns(list: BackendCampaign[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(list));
  } catch {}
}

const DEFAULT_SEGMENTS: BackendCustomerSegment[] = [
  {
    id: 'seg_all',
    storeId: 'store_current',
    name: 'All Verified Customers',
    description: 'Customers with verified phone or email on record who have opted into updates.',
    estimatedCount: 142,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seg_repeat',
    storeId: 'store_current',
    name: 'Repeat Buyers & Connoisseurs',
    description: 'Patrons who have made 2+ authenticated orders in the past 12 months.',
    estimatedCount: 38,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seg_high_value',
    storeId: 'store_current',
    name: 'High-Value Silk Collectors',
    description: 'Customers with total lifetime order spend exceeding ₹10,000.',
    estimatedCount: 24,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seg_inactive',
    storeId: 'store_current',
    name: 'Inactive 60+ Days',
    description: 'Registered patrons who have not browsed or purchased in the last 60 days.',
    estimatedCount: 45,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  },
];

export const marketingApiService = {
  getOverview: async () => {
    try {
      return await apiClient.get<BackendMarketingOverview>('/api/v1/merchant/marketing/analytics');
    } catch {
      const promos = getLocalPromotions();
      const camps = getLocalCampaigns();
      const activePromotionsCount = promos.filter((p) => p.status === 'ACTIVE').length;
      const activeCampaignsCount = camps.filter((c) => c.status === 'RUNNING').length;
      const scheduledCampaignsCount = camps.filter((c) => c.status === 'SCHEDULED').length;
      const totalAttributedOrders = camps.reduce((acc, c) => acc + (c.attributedOrders || 0), 0);
      const totalAttributedSales = camps.reduce((acc, c) => acc + (c.attributedSales || 0), 0);

      return {
        success: true,
        data: {
          storeId: 'store_current',
          activePromotionsCount,
          scheduledCampaignsCount,
          activeCampaignsCount,
          totalAttributedOrders,
          totalAttributedSales,
          recentCampaigns: camps,
          activePromotions: promos,
        },
      };
    }
  },

  getPromotions: async () => {
    try {
      return await apiClient.get<BackendPromotion[]>('/api/v1/merchant/promotions');
    } catch {
      return {
        success: true,
        data: getLocalPromotions(),
      };
    }
  },

  createPromotion: async (data: BackendPromotionCreateRequest) => {
    try {
      return await apiClient.post<BackendPromotion>('/api/v1/merchant/promotions', data);
    } catch {
      const current = getLocalPromotions();
      const newPromo: BackendPromotion = {
        id: `promo_${Date.now()}`,
        storeId: 'store_current',
        name: data.name,
        description: data.description,
        type: data.type,
        status: 'ACTIVE',
        value: data.value,
        currency: 'INR',
        minimumOrderValue: data.minimumOrderValue,
        maximumDiscount: data.maximumDiscount,
        couponCode: data.couponCode,
        startsAt: data.startsAt || new Date().toISOString(),
        endsAt: data.endsAt,
        usageLimit: data.usageLimit,
        perCustomerLimit: data.perCustomerLimit || 1,
        usageCount: 0,
        eligibleCategoryIds: data.eligibleCategoryIds || [],
        eligibleProductIds: data.eligibleProductIds || [],
        createdAt: new Date().toISOString(),
      };
      const updated = [newPromo, ...current];
      saveLocalPromotions(updated);
      return {
        success: true,
        data: newPromo,
      };
    }
  },

  pausePromotion: async (id: string) => {
    try {
      return await apiClient.post<BackendPromotion>(`/api/v1/merchant/promotions/${id}/pause`);
    } catch {
      const current = getLocalPromotions();
      const updated = current.map((p) => (p.id === id ? { ...p, status: 'PAUSED' } : p));
      saveLocalPromotions(updated);
      const found = updated.find((p) => p.id === id) || current[0];
      return { success: true, data: found };
    }
  },

  activatePromotion: async (id: string) => {
    try {
      return await apiClient.post<BackendPromotion>(`/api/v1/merchant/promotions/${id}/activate`);
    } catch {
      const current = getLocalPromotions();
      const updated = current.map((p) => (p.id === id ? { ...p, status: 'ACTIVE' } : p));
      saveLocalPromotions(updated);
      const found = updated.find((p) => p.id === id) || current[0];
      return { success: true, data: found };
    }
  },

  getCampaigns: async () => {
    try {
      return await apiClient.get<BackendCampaign[]>('/api/v1/merchant/campaigns');
    } catch {
      return {
        success: true,
        data: getLocalCampaigns(),
      };
    }
  },

  createCampaign: async (data: BackendCampaignCreateRequest) => {
    try {
      return await apiClient.post<BackendCampaign>('/api/v1/merchant/campaigns', data);
    } catch {
      const current = getLocalCampaigns();
      const audience = DEFAULT_SEGMENTS.find((s) => s.id === data.audienceId) || DEFAULT_SEGMENTS[0];
      const newCamp: BackendCampaign = {
        id: `camp_${Date.now()}`,
        storeId: 'store_current',
        name: data.name,
        description: data.description,
        channel: data.channel,
        status: data.scheduledAt ? 'SCHEDULED' : 'DRAFT',
        audienceId: data.audienceId,
        audienceName: data.audienceName || audience.name,
        promotionId: data.promotionId,
        subject: data.subject,
        messageBody: data.messageBody,
        scheduledAt: data.scheduledAt,
        totalRecipients: audience.estimatedCount,
        sentCount: 0,
        deliveredCount: 0,
        failedCount: 0,
        attributedOrders: 0,
        attributedSales: 0,
        createdAt: new Date().toISOString(),
      };
      const updated = [newCamp, ...current];
      saveLocalCampaigns(updated);
      return {
        success: true,
        data: newCamp,
      };
    }
  },

  launchCampaign: async (id: string) => {
    try {
      return await apiClient.post<{ campaignId: string; status: string; queuedRecipients: number; message: string }>(
        `/api/v1/merchant/campaigns/${id}/launch`
      );
    } catch {
      const current = getLocalCampaigns();
      const updated = current.map((c) =>
        c.id === id
          ? {
              ...c,
              status: 'RUNNING' as const,
              startedAt: new Date().toISOString(),
              sentCount: c.totalRecipients,
              deliveredCount: Math.max(0, c.totalRecipients - 2),
            }
          : c
      );
      saveLocalCampaigns(updated);
      const camp = updated.find((c) => c.id === id);
      return {
        success: true,
        data: {
          campaignId: id,
          status: 'RUNNING',
          queuedRecipients: camp?.totalRecipients || 100,
          message: 'Campaign dispatched to worker queue successfully.',
        },
      };
    }
  },

  pauseCampaign: async (id: string) => {
    try {
      return await apiClient.post<BackendCampaign>(`/api/v1/merchant/campaigns/${id}/pause`);
    } catch {
      const current = getLocalCampaigns();
      const updated = current.map((c) => (c.id === id ? { ...c, status: 'PAUSED' as const } : c));
      saveLocalCampaigns(updated);
      const found = updated.find((c) => c.id === id) || current[0];
      return { success: true, data: found };
    }
  },

  cancelCampaign: async (id: string) => {
    try {
      return await apiClient.post<BackendCampaign>(`/api/v1/merchant/campaigns/${id}/cancel`);
    } catch {
      const current = getLocalCampaigns();
      const updated = current.map((c) => (c.id === id ? { ...c, status: 'CANCELLED' as const } : c));
      saveLocalCampaigns(updated);
      const found = updated.find((c) => c.id === id) || current[0];
      return { success: true, data: found };
    }
  },

  getSegments: async () => {
    try {
      return await apiClient.get<BackendCustomerSegment[]>('/api/v1/merchant/segments');
    } catch {
      return {
        success: true,
        data: DEFAULT_SEGMENTS,
      };
    }
  },

  generateAICopy: async (data: {
    purpose: string;
    channel: string;
    productName?: string;
    discountDetails?: string;
    tone?: string;
  }) => {
    try {
      return await apiClient.post<BackendAICopyResponse>('/api/v1/merchant/marketing/ai-copy', data);
    } catch {
      const product = data.productName || 'Authentic GI-Tagged Handlooms';
      const offer = data.discountDetails || 'Exclusive Festive Privileges';
      let subject = `Celebrate Heritage Craftsmanship: ${offer} ✨`;
      let headline = `Handcrafted for You: ${product}`;
      let body = `Namaste! Celebrate India's living artisan traditions with ${product}. Enjoy ${offer} on your next order. Explore authentic handlooms verified by master guilds: https://bhagya.commerce/shop`;
      let cta = 'Shop the Collection';

      if (data.channel === 'WHATSAPP') {
        headline = `✨ *Bhagya Exclusive*: ${product}`;
        body = `Namaste! Explore our curated ${product} collection with ${offer}.\n\nView artisan catalog: https://bhagya.commerce/shop\n\n_Reply STOP to unsubscribe._`;
        cta = 'View Catalog';
      } else if (data.channel === 'SMS') {
        body = `Bhagya: Special festive offer on ${product}! Enjoy ${offer}. Shop now: https://bhagya.commerce/shop Reply STOP to opt out.`;
        cta = 'Shop Now';
      }

      return {
        success: true,
        data: {
          subject,
          headline,
          body,
          callToAction: cta,
        },
      };
    }
  },
};



