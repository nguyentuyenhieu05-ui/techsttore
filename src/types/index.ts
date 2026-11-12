export type Category = 'all' | 'phone' | 'laptop' | 'audio' | 'watch' | 'accessories';

export interface Product {
  id: string;
  name: string;
  category: Category;
  categoryName: string;
  price: number;
  originalPrice?: number;
  stock: number;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  specs: Record<string, string>;
  isFeatured?: boolean;
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  orderCode: string;
  customerName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  shippingMethod: 'standard' | 'express';
  paymentMethod: 'cod' | 'bank' | 'card';
  status: OrderStatus;
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  minOrder: number;
  description: string;
  isExpired?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface NotificationToast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
