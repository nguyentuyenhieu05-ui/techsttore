import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  User,
  Order,
  Coupon,
  Review,
  OrderStatus,
  NotificationToast
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_USERS,
  INITIAL_COUPONS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS
} from '../data/mockData';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  user: User | null;
  orders: Order[];
  reviews: Review[];
  coupons: Coupon[];
  activeCoupon: Coupon | null;
  networkLatency: number;
  setNetworkLatency: (ms: number) => void;
  toasts: NotificationToast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  addToCart: (product: Product, quantity?: number) => boolean;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  createOrder: (orderData: {
    customerName: string;
    phone: string;
    email: string;
    city: string;
    address: string;
    notes?: string;
    shippingMethod: 'standard' | 'express';
    paymentMethod: 'cod' | 'bank' | 'card';
  }) => Promise<{ success: boolean; order?: Order; message: string }>;
  cancelOrder: (orderId: string) => Promise<{ success: boolean; message: string }>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addReview: (productId: string, author: string, rating: number, comment: string) => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => void;
  deleteProduct: (productId: string) => void;
  updateProductStock: (productId: string, stock: number) => void;
  resetDatabase: () => void;
  cartTotalCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartShippingFee: number;
  cartTotal: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'techstore_products_v1',
  CART: 'techstore_cart_v1',
  USER: 'techstore_user_v1',
  ORDERS: 'techstore_orders_v1',
  REVIEWS: 'techstore_reviews_v1',
  COUPON: 'techstore_active_coupon_v1',
  LATENCY: 'techstore_latency_v1'
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : null;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COUPON);
    return saved ? JSON.parse(saved) : null;
  });

  const [networkLatency, setNetworkLatencyState] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LATENCY);
    return saved ? parseInt(saved, 10) : 0;
  });

  const [toasts, setToasts] = useState<NotificationToast[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    if (activeCoupon) {
      localStorage.setItem(STORAGE_KEYS.COUPON, JSON.stringify(activeCoupon));
    } else {
      localStorage.removeItem(STORAGE_KEYS.COUPON);
    }
  }, [activeCoupon]);

  const setNetworkLatency = (ms: number) => {
    setNetworkLatencyState(ms);
    localStorage.setItem(STORAGE_KEYS.LATENCY, ms.toString());
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // Cart calculations
  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  let cartDiscount = 0;
  if (activeCoupon) {
    if (activeCoupon.discountPercent) {
      cartDiscount = Math.round((cartSubtotal * activeCoupon.discountPercent) / 100);
    } else if (activeCoupon.discountAmount) {
      cartDiscount = Math.min(activeCoupon.discountAmount, cartSubtotal);
    }
  }

  const cartShippingFee = cartSubtotal > 0 ? (activeCoupon?.code === 'FREESHIP' ? 0 : 30000) : 0;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartShippingFee);

  const addToCart = (product: Product, quantity = 1): boolean => {
    if (product.stock <= 0) {
      showToast(`Sản phẩm "${product.name}" hiện đã hết hàng!`, 'error');
      return false;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > product.stock) {
          showToast(`Chỉ còn ${product.stock} sản phẩm trong kho!`, 'error');
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { product, quantity }];
    });

    showToast(`Đã thêm "${product.name}" vào giỏ hàng`, 'success');
    return true;
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const targetProduct = products.find((p) => p.id === productId);
    if (targetProduct && quantity > targetProduct.stock) {
      showToast(`Chỉ còn ${targetProduct.stock} sản phẩm trong kho!`, 'error');
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Đã xóa sản phẩm khỏi giỏ hàng', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setActiveCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: 'Vui lòng nhập mã giảm giá' };
    }

    const found = INITIAL_COUPONS.find((c) => c.code.toUpperCase() === cleanCode);
    if (!found) {
      return { success: false, message: 'Mã giảm giá không tồn tại' };
    }

    if (found.isExpired) {
      return { success: false, message: 'Mã giảm giá đã hết hạn sử dụng' };
    }

    if (cartSubtotal < found.minOrder) {
      return {
        success: false,
        message: `Đơn hàng tối thiểu phải từ ${found.minOrder.toLocaleString('vi-VN')}₫ để dùng mã này`
      };
    }

    setActiveCoupon(found);
    showToast(`Áp dụng mã ${found.code} thành công!`, 'success');
    return { success: true, message: `Áp dụng thành công: ${found.description}` };
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
    showToast('Đã hủy bỏ mã giảm giá', 'info');
  };

  const login = async (email: string, pass: string) => {
    if (networkLatency > 0) await delay(networkLatency);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !pass) {
      return { success: false, message: 'Vui lòng nhập đầy đủ email và mật khẩu' };
    }

    if (cleanEmail === 'khachhang@techstore.vn' && pass === 'Password123!') {
      const u = INITIAL_USERS[0];
      setUser(u);
      showToast(`Đăng nhập thành công! Chào mừng ${u.name}`, 'success');
      return { success: true, message: 'Đăng nhập thành công' };
    }

    if (cleanEmail === 'admin@techstore.vn' && pass === 'AdminPass123!') {
      const u = INITIAL_USERS[1];
      setUser(u);
      showToast(`Đăng nhập thành công! Quyền: Quản trị viên`, 'success');
      return { success: true, message: 'Đăng nhập thành công với quyền Admin' };
    }

    // Check custom registered users
    const registeredUsers = JSON.parse(localStorage.getItem('techstore_registered_users') || '[]');
    const matched = registeredUsers.find((r: any) => r.email === cleanEmail && r.password === pass);
    if (matched) {
      const u: User = {
        id: matched.id,
        name: matched.name,
        email: matched.email,
        phone: matched.phone,
        role: 'customer'
      };
      setUser(u);
      showToast(`Đăng nhập thành công! Chào mừng ${u.name}`, 'success');
      return { success: true, message: 'Đăng nhập thành công' };
    }

    return { success: false, message: 'Email hoặc mật khẩu không chính xác' };
  };

  const register = async (data: { name: string; email: string; password: string; phone?: string }) => {
    if (networkLatency > 0) await delay(networkLatency);

    const cleanEmail = data.email.trim().toLowerCase();
    const cleanName = data.name.trim();

    if (!cleanName || !cleanEmail || !data.password) {
      return { success: false, message: 'Vui lòng điền đầy đủ các thông tin bắt buộc' };
    }

    if (data.password.length < 6) {
      return { success: false, message: 'Mật khẩu phải có độ dài tối thiểu 6 ký tự' };
    }

    // Check duplicate
    if (cleanEmail === 'khachhang@techstore.vn' || cleanEmail === 'admin@techstore.vn') {
      return { success: false, message: 'Email này đã được đăng ký trong hệ thống' };
    }

    const registeredUsers = JSON.parse(localStorage.getItem('techstore_registered_users') || '[]');
    if (registeredUsers.some((u: any) => u.email === cleanEmail)) {
      return { success: false, message: 'Email này đã được đăng ký trong hệ thống' };
    }

    const newUser: User = {
      id: 'usr-' + Date.now(),
      name: cleanName,
      email: cleanEmail,
      phone: data.phone || '',
      role: 'customer'
    };

    registeredUsers.push({
      ...newUser,
      password: data.password
    });
    localStorage.setItem('techstore_registered_users', JSON.stringify(registeredUsers));

    setUser(newUser);
    showToast(`Đăng ký tài khoản thành công! Xin chào ${newUser.name}`, 'success');
    return { success: true, message: 'Đăng ký tài khoản thành công' };
  };

  const logout = () => {
    setUser(null);
    showToast('Đã đăng xuất khỏi tài khoản', 'info');
  };

  const createOrder = async (orderData: {
    customerName: string;
    phone: string;
    email: string;
    city: string;
    address: string;
    notes?: string;
    shippingMethod: 'standard' | 'express';
    paymentMethod: 'cod' | 'bank' | 'card';
  }) => {
    if (networkLatency > 0) await delay(networkLatency);

    if (cart.length === 0) {
      return { success: false, message: 'Giỏ hàng của bạn đang trống' };
    }

    // Generate unique order code
    const orderNum = Math.floor(10000 + Math.random() * 90000);
    const orderCode = `ORD-${orderNum}`;

    const shippingCharge = orderData.shippingMethod === 'express' ? 50000 : (activeCoupon?.code === 'FREESHIP' ? 0 : 30000);
    const finalTotal = Math.max(0, cartSubtotal - cartDiscount + shippingCharge);

    const now = new Date();
    const createdAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderCode,
      customerName: orderData.customerName,
      phone: orderData.phone,
      email: orderData.email,
      city: orderData.city,
      address: orderData.address,
      notes: orderData.notes,
      items: cart.map((c) => ({
        productId: c.product.id,
        productName: c.product.name,
        price: c.product.price,
        quantity: c.quantity,
        image: c.product.image
      })),
      subtotal: cartSubtotal,
      discount: cartDiscount,
      shippingFee: shippingCharge,
      total: finalTotal,
      shippingMethod: orderData.shippingMethod,
      paymentMethod: orderData.paymentMethod,
      status: 'pending',
      createdAt
    };

    // Deduct stock
    setProducts((prev) =>
      prev.map((prod) => {
        const inCart = cart.find((item) => item.product.id === prod.id);
        if (inCart) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - inCart.quantity)
          };
        }
        return prod;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    showToast(`Đặt hàng thành công! Mã đơn hàng: ${orderCode}`, 'success');
    return { success: true, order: newOrder, message: 'Đặt hàng thành công' };
  };

  const cancelOrder = async (orderId: string) => {
    if (networkLatency > 0) await delay(networkLatency);

    const targetOrder = orders.find((o) => o.id === orderId || o.orderCode === orderId);
    if (!targetOrder) {
      return { success: false, message: 'Không tìm thấy đơn hàng' };
    }

    if (targetOrder.status !== 'pending') {
      return {
        success: false,
        message: 'Chỉ có thể hủy đơn hàng khi đang ở trạng thái Chờ xác nhận (pending)'
      };
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === targetOrder.id ? { ...o, status: 'cancelled' } : o
      )
    );

    // Restore stock
    setProducts((prev) =>
      prev.map((p) => {
        const item = targetOrder.items.find((i) => i.productId === p.id);
        if (item) {
          return { ...p, stock: p.stock + item.quantity };
        }
        return p;
      })
    );

    showToast(`Đã hủy đơn hàng ${targetOrder.orderCode}`, 'info');
    return { success: true, message: `Đã hủy đơn hàng ${targetOrder.orderCode} thành công` };
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(`Đã cập nhật trạng thái đơn hàng thành "${status}"`, 'success');
  };

  const addReview = async (productId: string, author: string, rating: number, comment: string) => {
    if (networkLatency > 0) await delay(networkLatency);

    const newRev: Review = {
      id: 'rev-' + Date.now(),
      productId,
      author: author.trim() || 'Người dùng ẩn danh',
      rating,
      comment: comment.trim(),
      date: new Date().toLocaleDateString('vi-VN')
    };

    setReviews((prev) => [newRev, ...prev]);

    // Recalculate product rating
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const prodReviews = [newRev, ...reviews.filter((r) => r.productId === productId)];
          const avgRating = Number(
            (prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length).toFixed(1)
          );
          return {
            ...p,
            rating: avgRating,
            reviewCount: prodReviews.length
          };
        }
        return p;
      })
    );

    showToast('Cảm ơn bạn đã gửi đánh giá sản phẩm!', 'success');
  };

  const addProduct = (newProd: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => {
    const product: Product = {
      ...newProd,
      id: 'prod-' + Date.now(),
      rating: 5.0,
      reviewCount: 0
    };
    setProducts((prev) => [product, ...prev]);
    showToast(`Đã thêm sản phẩm mới "${product.name}"`, 'success');
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Đã xóa sản phẩm khỏi hệ thống', 'info');
  };

  const updateProductStock = (productId: string, stock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: Math.max(0, stock) } : p))
    );
    showToast('Đã cập nhật số lượng tồn kho', 'success');
  };

  const resetDatabase = () => {
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.CART);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    localStorage.removeItem(STORAGE_KEYS.COUPON);
    localStorage.removeItem('techstore_registered_users');

    setProducts(INITIAL_PRODUCTS);
    setCart([]);
    setUser(null);
    setOrders(INITIAL_ORDERS);
    setReviews(INITIAL_REVIEWS);
    setActiveCoupon(null);
    setNetworkLatencyState(0);

    showToast('Đã khôi phục toàn bộ cơ sở dữ liệu mẫu về trạng thái ban đầu!', 'success');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        user,
        orders,
        reviews,
        coupons: INITIAL_COUPONS,
        activeCoupon,
        networkLatency,
        setNetworkLatency,
        toasts,
        showToast,
        removeToast,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        login,
        register,
        logout,
        createOrder,
        cancelOrder,
        updateOrderStatus,
        addReview,
        addProduct,
        deleteProduct,
        updateProductStock,
        resetDatabase,
        cartTotalCount,
        cartSubtotal,
        cartDiscount,
        cartShippingFee,
        cartTotal
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
