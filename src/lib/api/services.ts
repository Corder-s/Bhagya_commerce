import { apiClient, ApiResponse } from './client';

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

export const aiApiService = {
  chat: (message: string, contextMode?: string, conversationId?: string) =>
    apiClient.post<unknown>('/api/v1/ai/chat', { message, contextMode, conversationId }),
  getConversations: () => apiClient.get<unknown[]>('/api/v1/ai/conversations'),
  createConversation: (title?: string, mode?: string) =>
    apiClient.post<unknown>('/api/v1/ai/conversations', { title, mode }),
};
