import { Product, User, Coupon, Order, Review } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Aura Phone Pro Titanium 256GB',
    category: 'phone',
    categoryName: 'Điện thoại',
    price: 24990000,
    originalPrice: 27990000,
    stock: 15,
    rating: 4.9,
    reviewCount: 38,
    image: '/src/assets/images/product_smartphone_flagship_1793930611791.jpg',
    description: 'Điện thoại thông minh vỏ titan siêu bền, hệ thống 3 camera 48MP bắt nét nhanh, vi xử lý A18 Pro 3nm tiết kiệm pin tối đa cùng màn hình OLED 120Hz siêu sáng.',
    specs: {
      'Màn hình': '6.7 inch Super Retina XDR OLED 120Hz',
      'Vi xử lý': 'Titanium Bionic A18 Hexa-core',
      'RAM / Bộ nhớ': '8GB RAM / 256GB NVMe',
      'Camera': 'Chính 48MP + Góc rộng 12MP + Tele 5x 12MP',
      'Pin': '4.500 mAh, Sạc nhanh 30W'
    },
    isFeatured: true,
    badge: 'Bán chạy'
  },
  {
    id: 'prod-2',
    name: 'AuraBook Ultra 14 Slim M3',
    category: 'laptop',
    categoryName: 'Laptop',
    price: 29990000,
    originalPrice: 32990000,
    stock: 8,
    rating: 4.8,
    reviewCount: 24,
    image: '/src/assets/images/product_ultrabook_laptop_1793930610879.jpg',
    description: 'Laptop mỏng nhẹ nhôm nguyên khối, trọng lượng chỉ 1.2kg, màn hình 2.8K 100% sRGB và thời lượng pin sử dụng liên tục lên đến 18 giờ làm việc.',
    specs: {
      'Màn hình': '14 inch 2.8K Liquid IPS 120Hz',
      'Vi xử lý': 'M3 Octa-Core 3.2GHz',
      'RAM / Bộ nhớ': '16GB LPDDR5X / 512GB PCIe Gen4',
      'Đồ họa': 'Integrated 10-core GPU',
      'Trọng lượng': '1.24 kg, Vỏ kim loại nguyên khối'
    },
    isFeatured: true,
    badge: 'Mới'
  },
  {
    id: 'prod-3',
    name: 'AuraSound Studio Max Wireless ANC',
    category: 'audio',
    categoryName: 'Âm thanh',
    price: 6490000,
    originalPrice: 7990000,
    stock: 22,
    rating: 4.7,
    reviewCount: 52,
    image: '/src/assets/images/product_anc_headphones_1793930611331.jpg',
    description: 'Tai nghe chụp tai chống ồn chủ động Hybrid ANC cao cấp, màng loa 40mm Titanium, âm thanh vòm không gian Spatial Audio và thời lượng pin 40 giờ.',
    specs: {
      'Loại': 'Over-ear Chống ồn chủ động ANC',
      'Kết nối': 'Bluetooth 5.4, AAC, LDAC, Jack 3.5mm',
      'Thời lượng pin': '40 giờ (bật ANC), 60 giờ (tắt ANC)',
      'Sạc': 'USB-C sạc nhanh 10 phút dùng 5 giờ',
      'Trọng lượng': '255g, Đệm da Memory Foam'
    },
    isFeatured: true
  },
  {
    id: 'prod-4',
    name: 'AuraWatch Ultra Sport Titanium',
    category: 'watch',
    categoryName: 'Đồng hồ',
    price: 9990000,
    originalPrice: 11490000,
    stock: 12,
    rating: 4.9,
    reviewCount: 19,
    image: '/src/assets/images/product_smartwatch_sport_1793930611967.jpg',
    description: 'Đồng hồ thông minh thể thao chuyên nghiệp với khung viền Titanium chuẩn quân đội, mặt kính sapphire chống xước, GPS tần số kép và đo điện tâm đồ ECG.',
    specs: {
      'Mặt kính': 'Sapphire Crystal 49mm',
      'Khung viền': 'Titanium hàng không vũ trụ',
      'Kháng nước': '10 ATM (100 mét), Chống bụi IP6X',
      'Cảm biến': 'Nhịp tim quang học, ECG, SpO2, Đo nhiệt độ',
      'Thời lượng pin': 'Đến 72 giờ ở chế độ tiêu chuẩn'
    },
    isFeatured: true,
    badge: 'Đặc sắc'
  },
  {
    id: 'prod-5',
    name: 'Tai nghe True Wireless AuraBuds Pro 2',
    category: 'audio',
    categoryName: 'Âm thanh',
    price: 3290000,
    originalPrice: 3890000,
    stock: 30,
    rating: 4.6,
    reviewCount: 64,
    image: '/src/assets/images/product_anc_headphones_1793930611331.jpg',
    description: 'Tai nghe không dây nhỏ gọn, chống ồn thông minh tự điều chỉnh theo môi trường, kháng nước IPX5 và hộp sạc hỗ trợ chuẩn không dây Qi.',
    specs: {
      'Driver': '11mm High-Excursion Driver',
      'Chống ồn': 'Smart Active Noise Cancelling 42dB',
      'Pin': '7 giờ (tai nghe) + 28 giờ (hộp sạc)',
      'Kháng nước': 'IPX5 chống mồ hôi và nước bắn',
      'Mic đàm thoại': '3 micro ENC chống ồn gió'
    }
  },
  {
    id: 'prod-6',
    name: 'Bàn phím cơ không dây AuraKey K8 Pro',
    category: 'accessories',
    categoryName: 'Phụ kiện',
    price: 1890000,
    originalPrice: 2200000,
    stock: 18,
    rating: 4.8,
    reviewCount: 41,
    image: '/src/assets/images/product_ultrabook_laptop_1793930610879.jpg',
    description: 'Bàn phím cơ layout 75% hot-swap mạch xuôi, switch custom lube sẵn gõ cực êm, kết nối đa thiết bị Bluetooth / 2.4GHz / Type-C.',
    specs: {
      'Layout': '75% (82 phím) có núm xoay kim loại',
      'Switch': 'Linear Cream Yellow Hot-swap',
      'Keycap': 'PBT Double-shot Cherry Profile',
      'Pin': '4.000 mAh dùng đến 200 giờ',
      'Kết nối': '3 Modes: Dây Type-C, Bluetooth 5.1, Wireless 2.4G'
    }
  },
  {
    id: 'prod-7',
    name: 'Củ sạc nhanh GaN AuraCharge 65W 3 Cổng',
    category: 'accessories',
    categoryName: 'Phụ kiện',
    price: 650000,
    originalPrice: 850000,
    stock: 45,
    rating: 4.7,
    reviewCount: 88,
    image: '/src/assets/images/product_smartphone_flagship_1793930611791.jpg',
    description: 'Củ sạc công nghệ GaN thế hệ mới siêu nhỏ gọn, trang bị 2 cổng Type-C và 1 cổng USB-A sạc đồng thời cho cả laptop và điện thoại.',
    specs: {
      'Công suất tối đa': '65W Power Delivery 3.0 / PPS / QC4+',
      'Cổng cắm': '2x USB Type-C, 1x USB-A',
      'Kích thước': '38 x 32 x 65 mm (nhỏ hơn 45%)',
      'Bảo vệ an toàn': 'Quá áp, quá dòng, kiểm soát nhiệt độ thông minh'
    }
  },
  {
    id: 'prod-8',
    name: 'Sản phẩm hết hàng (Dành cho Test Out of Stock)',
    category: 'phone',
    categoryName: 'Điện thoại',
    price: 15990000,
    originalPrice: 18000000,
    stock: 0,
    rating: 4.5,
    reviewCount: 12,
    image: '/src/assets/images/product_smartphone_flagship_1793930611791.jpg',
    description: 'Sản phẩm mẫu này có số lượng tồn kho bằng 0 để các kỹ sư kiểm thử kiểm tra trường hợp nút mua bị vô hiệu hóa (disabled) và thông báo Hết hàng.',
    specs: {
      'Tồn kho': '0 sản phẩm',
      'Trạng thái': 'Tạm hết hàng'
    },
    badge: 'Hết hàng'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-customer',
    name: 'Nguyễn Văn An',
    email: 'khachhang@techstore.vn',
    phone: '0901234567',
    role: 'customer'
  },
  {
    id: 'usr-admin',
    name: 'Quản trị viên Hệ thống',
    email: 'admin@techstore.vn',
    phone: '0988888888',
    role: 'admin'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'GIAM10',
    discountPercent: 10,
    minOrder: 500000,
    description: 'Giảm 10% trên tổng giá trị đơn hàng (áp dụng đơn từ 500.000₫)'
  },
  {
    code: 'FREESHIP',
    discountAmount: 30000,
    minOrder: 0,
    description: 'Miễn phí vận chuyển tiêu chuẩn 30.000₫'
  },
  {
    code: 'TECH500',
    discountAmount: 500000,
    minOrder: 5000000,
    description: 'Giảm ngay 500.000₫ cho đơn hàng công nghệ từ 5.000.000₫'
  },
  {
    code: 'EXPIRED',
    discountPercent: 50,
    minOrder: 100000,
    description: 'Mã giảm giá đã hết hạn sử dụng (dùng kiểm thử mã không hợp lệ)',
    isExpired: true
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderCode: 'ORD-88219',
    customerName: 'Nguyễn Văn An',
    phone: '0901234567',
    email: 'khachhang@techstore.vn',
    city: 'Hà Nội',
    address: 'Số 18 Phố Nguyễn Trãi, Thanh Xuân',
    notes: 'Giao hàng vào giờ hành chính giúp tôi',
    items: [
      {
        productId: 'prod-3',
        productName: 'AuraSound Studio Max Wireless ANC',
        price: 6490000,
        quantity: 1,
        image: '/src/assets/images/product_anc_headphones_1793930611331.jpg'
      }
    ],
    subtotal: 6490000,
    discount: 649000,
    shippingFee: 0,
    total: 5841000,
    shippingMethod: 'standard',
    paymentMethod: 'cod',
    status: 'delivered',
    createdAt: '2026-11-01 10:15:00'
  },
  {
    id: 'ord-1002',
    orderCode: 'ORD-91045',
    customerName: 'Nguyễn Văn An',
    phone: '0901234567',
    email: 'khachhang@techstore.vn',
    city: 'TP. Hồ Chí Minh',
    address: '45 Lê Duẩn, Bến Nghé, Quận 1',
    items: [
      {
        productId: 'prod-4',
        productName: 'AuraWatch Ultra Sport Titanium',
        price: 9990000,
        quantity: 1,
        image: '/src/assets/images/product_smartwatch_sport_1793930611967.jpg'
      }
    ],
    subtotal: 9990000,
    discount: 0,
    shippingFee: 30000,
    total: 10020000,
    shippingMethod: 'standard',
    paymentMethod: 'bank',
    status: 'pending',
    createdAt: '2026-11-04 16:45:00'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    author: 'Trần Minh Đức',
    rating: 5,
    comment: 'Điện thoại viền titan cầm rất nhẹ tay, camera chụp đêm xuất sắc. Giao hàng nhanh!',
    date: '02/11/2026'
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    author: 'Lê Hoàng Yến',
    rating: 5,
    comment: 'Màn hình 120Hz mượt mà, màu sắc hiển thị rất tự nhiên. Pin dùng trọn ngày thoải mái.',
    date: '03/11/2026'
  },
  {
    id: 'rev-3',
    productId: 'prod-2',
    author: 'Nguyễn Quang Tuấn',
    rating: 5,
    comment: 'Máy nhẹ, mang đi công tác rất tiện. Màn hình 2.8K sắc nét xem code và tài liệu cực kỳ thích.',
    date: '04/11/2026'
  },
  {
    id: 'rev-4',
    productId: 'prod-3',
    author: 'Phạm Thanh Bình',
    rating: 4,
    comment: 'Chống ồn tốt ở môi trường quán cà phê, âm bass chắc và dày. Đệm tai êm ái.',
    date: '04/11/2026'
  }
];
