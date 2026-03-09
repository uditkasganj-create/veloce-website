const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

function getAuthToken(): string | null {
  return localStorage.getItem('veloce_token');
}

function setAuthToken(token: string): void {
  localStorage.setItem('veloce_token', token);
}

function removeAuthToken(): void {
  localStorage.removeItem('veloce_token');
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options;

  let url = `${API_BASE_URL}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.error?.message || errorData.message || 'Request failed',
      response.status,
      errorData
    );
  }

  if (response.status === 204) {
    return {} as T;
  }

  const data = await response.json();
  return data.data || data;
}

export const api = {
  get: <T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>) =>
    request<T>(endpoint, { method: 'GET', params }),

  post: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),

  put: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),

  delete: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, { 
      method: 'DELETE', 
      body: body ? JSON.stringify(body) : undefined 
    }),
};

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ user: any; token: string }>('/auth/login', { email, password }),

  register: (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) =>
    api.post<{ user: any; token: string }>('/auth/register', data),

  getMe: () => api.get<{ user: any }>('/auth/me'),

  logout: () => api.post<void>('/auth/logout'),
};

export const productApi = {
  getAll: (params?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sort?: string;
    order?: string;
    page?: number;
    limit?: number;
    featured?: boolean;
    newArrival?: boolean;
  }) => api.get<{ products: any[]; pagination: any }>('/products', params),

  getFeatured: () => api.get<any[]>('/products/featured'),

  getNewArrivals: () => api.get<any[]>('/products/new-arrivals'),

  getCategories: () => api.get<string[]>('/products/categories'),

  getBySlug: (slug: string) => api.get<{ product: any; relatedProducts: any[] }>(`/products/${slug}`),
};

export const cartApi = {
  get: () => api.get<any[]>('/cart'),

  add: (productId: string, quantity: number = 1, size: string) =>
    api.post<any[]>('/cart', { productId, quantity, size }),

  update: (productId: string, quantity: number, size: string) =>
    api.put<any[]>(`/cart/${productId}`, { quantity, size }),

  remove: (productId: string, size: string) =>
    api.delete<any[]>(`/cart/${productId}`, { size }),

  clear: () => api.delete<void>('/cart'),
};

export const orderApi = {
  getAll: () => api.get<any[]>('/orders'),

  getById: (orderNumber: string) => api.get<any>(`/orders/${orderNumber}`),

  create: (data: {
    items: any[];
    shippingAddress: any;
    billingAddress?: any;
    paymentMethod?: string;
    notes?: string;
    couponCode?: string;
  }) => api.post<any>('/orders', data),

  pay: (orderId: string, paymentId: string) =>
    api.post<any>(`/orders/${orderId}/pay`, { paymentId }),

  cancel: (orderId: string) => api.post<any>(`/orders/${orderId}/cancel`),
};

export const couponApi = {
  validate: (code: string, subtotal: number) =>
    api.get<{ code: string; type: string; value: number; discount: number; message: string }>(
      `/coupons/validate/${code}`,
      { subtotal }
    ),
};

export const contactApi = {
  submit: (data: { name: string; email: string; phone?: string; message: string; type?: string }) =>
    api.post<{ id: string }>('/contact', data),
};

export const newsletterApi = {
  subscribe: (email: string) =>
    api.post<{ message: string }>('/newsletter/subscribe', { email }),

  unsubscribe: (email: string) =>
    api.post<{ message: string }>('/newsletter/unsubscribe', { email }),
};

export const analyticsApi = {
  getStats: () => api.get<any>('/analytics/stats'),
};

export { getAuthToken, setAuthToken, removeAuthToken, ApiError };
