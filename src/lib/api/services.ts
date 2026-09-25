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

export const marketingApiService = {
  getOverview: () =>
    apiClient.get<BackendMarketingOverview>('/api/v1/merchant/marketing/analytics'),

  getPromotions: () =>
    apiClient.get<BackendPromotion[]>('/api/v1/merchant/promotions'),

  createPromotion: (data: BackendPromotionCreateRequest) =>
    apiClient.post<BackendPromotion>('/api/v1/merchant/promotions', data),

  pausePromotion: (id: string) =>
    apiClient.post<BackendPromotion>(`/api/v1/merchant/promotions/${id}/pause`),

  activatePromotion: (id: string) =>
    apiClient.post<BackendPromotion>(`/api/v1/merchant/promotions/${id}/activate`),

  getCampaigns: () =>
    apiClient.get<BackendCampaign[]>('/api/v1/merchant/campaigns'),

  createCampaign: (data: BackendCampaignCreateRequest) =>
    apiClient.post<BackendCampaign>('/api/v1/merchant/campaigns', data),

  launchCampaign: (id: string) =>
    apiClient.post<{ campaignId: string; status: string; queuedRecipients: number; message: string }>(
      `/api/v1/merchant/campaigns/${id}/launch`
    ),

  pauseCampaign: (id: string) =>
    apiClient.post<BackendCampaign>(`/api/v1/merchant/campaigns/${id}/pause`),

  cancelCampaign: (id: string) =>
    apiClient.post<BackendCampaign>(`/api/v1/merchant/campaigns/${id}/cancel`),

  getSegments: () =>
    apiClient.get<BackendCustomerSegment[]>('/api/v1/merchant/segments'),

  generateAICopy: (data: {
    purpose: string;
    channel: string;
    productName?: string;
    discountDetails?: string;
    tone?: string;
  }) => apiClient.post<BackendAICopyResponse>('/api/v1/merchant/marketing/ai-copy', data),
};


