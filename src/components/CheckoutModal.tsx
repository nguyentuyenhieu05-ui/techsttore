import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Truck, CreditCard, Banknote, Building2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess
}) => {
  const { user, cart, cartSubtotal, cartDiscount, activeCoupon, createOrder } = useStore();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [city, setCity] = useState('Hà Nội');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank' | 'card'>('cod');

  // Credit Card fields (when paymentMethod === 'card')
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const formatPrice = (val: number) => {
    return val.toLocaleString('vi-VN') + ' ₫';
  };

  const shippingFee = shippingMethod === 'express' ? 50000 : (activeCoupon?.code === 'FREESHIP' ? 0 : 30000);
  const totalAmount = Math.max(0, cartSubtotal - cartDiscount + shippingFee);

  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!customerName.trim()) {
      errs.customerName = 'Vui lòng nhập họ và tên người nhận';
    }

    const phoneRegex = /^0[0-9]{9}$/;
    if (!phone.trim()) {
      errs.phone = 'Vui lòng nhập số điện thoại';
    } else if (!phoneRegex.test(phone.trim())) {
      errs.phone = 'Số điện thoại không hợp lệ (phải gồm 10 chữ số bắt đầu bằng số 0)';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errs.email = 'Vui lòng nhập địa chỉ email';
    } else if (!emailRegex.test(email.trim())) {
      errs.email = 'Địa chỉ email không đúng định dạng';
    }

    if (!address.trim()) {
      errs.address = 'Vui lòng nhập địa chỉ giao hàng cụ thể';
    }

    if (paymentMethod === 'card') {
      const cleanCard = cardNumber.replace(/\s+/g, '');
      if (!cleanCard || cleanCard.length < 16) {
        errs.cardNumber = 'Số thẻ không hợp lệ (cần 16 chữ số)';
      }
      if (!cardExpiry.trim() || !cardExpiry.includes('/')) {
        errs.cardExpiry = 'Ngày hết hạn không đúng định dạng (MM/YY)';
      }
      if (!cardCvv.trim() || cardCvv.length < 3) {
        errs.cardCvv = 'Mã bảo mật CVV phải có 3-4 chữ số';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    const result = await createOrder({
      customerName,
      phone,
      email,
      city,
      address,
      notes,
      shippingMethod,
      paymentMethod
    });

    setIsSubmitting(false);

    if (result.success && result.order) {
      onOrderSuccess(result.order);
      onClose();
    }
  };

  return (
    <div
      id="modal-checkout-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div
        id="modal-checkout"
        data-testid="modal-checkout"
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Thông Tin Thanh Toán & Giao Hàng
            </h2>
          </div>
          <button
            id="btn-close-checkout"
            data-testid="btn-close-checkout"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleCheckoutSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* General Error Banner */}
          {Object.keys(errors).length > 0 && (
            <div
              id="checkout-error-banner"
              data-testid="checkout-error-banner"
              className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium space-y-1"
            >
              <div className="font-semibold">Vui lòng kiểm tra lại thông tin biểu mẫu:</div>
              <ul className="list-disc list-inside">
                {Object.values(errors).map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Section 1: Customer Contact Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">1</span>
              Thông tin người nhận hàng
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label htmlFor="checkout-name" className="block text-xs font-semibold text-slate-700 mb-1">
                  Họ và tên <span className="text-rose-500">*</span>
                </label>
                <input
                  id="checkout-name"
                  name="fullName"
                  data-testid="checkout-name"
                  type="text"
                  placeholder="VD: Nguyễn Văn An"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:ring-1 ${
                    errors.customerName ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/30' : 'border-slate-200 focus:ring-indigo-500'
                  }`}
                />
                {errors.customerName && (
                  <p id="error-name" data-testid="error-name" className="text-[11px] text-rose-600 mt-1">
                    {errors.customerName}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="checkout-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                  Số điện thoại <span className="text-rose-500">*</span>
                </label>
                <input
                  id="checkout-phone"
                  name="phone"
                  data-testid="checkout-phone"
                  type="tel"
                  placeholder="VD: 0901234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:ring-1 ${
                    errors.phone ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/30' : 'border-slate-200 focus:ring-indigo-500'
                  }`}
                />
                {errors.phone && (
                  <p id="error-phone" data-testid="error-phone" className="text-[11px] text-rose-600 mt-1">
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email */}
              <div>
                <label htmlFor="checkout-email" className="block text-xs font-semibold text-slate-700 mb-1">
                  Email nhận hóa đơn <span className="text-rose-500">*</span>
                </label>
                <input
                  id="checkout-email"
                  name="email"
                  data-testid="checkout-email"
                  type="email"
                  placeholder="VD: an.nguyen@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:ring-1 ${
                    errors.email ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/30' : 'border-slate-200 focus:ring-indigo-500'
                  }`}
                />
                {errors.email && (
                  <p id="error-email" data-testid="error-email" className="text-[11px] text-rose-600 mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* City Selection */}
              <div>
                <label htmlFor="checkout-city" className="block text-xs font-semibold text-slate-700 mb-1">
                  Tỉnh / Thành phố <span className="text-rose-500">*</span>
                </label>
                <select
                  id="checkout-city"
                  name="city"
                  data-testid="checkout-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Hải Phòng">Hải Phòng</option>
                  <option value="Cần Thơ">Cần Thơ</option>
                </select>
              </div>
            </div>

            {/* Street Address */}
            <div>
              <label htmlFor="checkout-address" className="block text-xs font-semibold text-slate-700 mb-1">
                Địa chỉ chi tiết (Số nhà, Tên đường, Phường/Xã) <span className="text-rose-500">*</span>
              </label>
              <input
                id="checkout-address"
                name="address"
                data-testid="checkout-address"
                type="text"
                placeholder="VD: Số 12 Đường Cầu Giấy, Phường Dịch Vọng"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:ring-1 ${
                  errors.address ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/30' : 'border-slate-200 focus:ring-indigo-500'
                }`}
              />
              {errors.address && (
                <p id="error-address" data-testid="error-address" className="text-[11px] text-rose-600 mt-1">
                  {errors.address}
                </p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="checkout-notes" className="block text-xs font-semibold text-slate-700 mb-1">
                Ghi chú đơn hàng (Tùy chọn)
              </label>
              <textarea
                id="checkout-notes"
                name="notes"
                data-testid="checkout-notes"
                rows={2}
                placeholder="VD: Giao vào giờ hành chính, gọi điện trước khi tới..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Section 2: Shipping Method */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">2</span>
              Phương thức giao hàng
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Standard */}
              <label
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  shippingMethod === 'standard'
                    ? 'border-indigo-600 bg-indigo-50/40 text-slate-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  id="shipping-standard"
                  name="shippingMethod"
                  data-testid="shipping-standard"
                  type="radio"
                  value="standard"
                  checked={shippingMethod === 'standard'}
                  onChange={() => setShippingMethod('standard')}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="text-xs font-semibold flex items-center justify-between">
                    <span>Giao hàng tiêu chuẩn</span>
                    <span className="font-mono text-indigo-600 font-bold">
                      {activeCoupon?.code === 'FREESHIP' ? '0 ₫ (Freeship)' : '30.000 ₫'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">2-3 ngày làm việc</div>
                </div>
              </label>

              {/* Express */}
              <label
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  shippingMethod === 'express'
                    ? 'border-indigo-600 bg-indigo-50/40 text-slate-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  id="shipping-express"
                  name="shippingMethod"
                  data-testid="shipping-express"
                  type="radio"
                  value="express"
                  checked={shippingMethod === 'express'}
                  onChange={() => setShippingMethod('express')}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="text-xs font-semibold flex items-center justify-between">
                    <span>Giao hàng hỏa tốc 24h</span>
                    <span className="font-mono text-indigo-600 font-bold">50.000 ₫</span>
                  </div>
                  <div className="text-[11px] text-slate-500">Nhận hàng trong vòng 24 giờ</div>
                </div>
              </label>
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">3</span>
              Phương thức thanh toán
            </h3>

            <div className="space-y-2">
              {/* COD */}
              <label
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-indigo-600 bg-indigo-50/40'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  id="payment-cod"
                  name="paymentMethod"
                  data-testid="payment-cod"
                  type="radio"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="w-4 h-4 text-indigo-600 mt-0.5 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span>Thanh toán khi nhận hàng (COD)</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Thanh toán tiền mặt cho nhân viên giao hàng khi nhận kiện hàng.
                  </div>
                </div>
              </label>

              {/* Bank Transfer */}
              <label
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'bank'
                    ? 'border-indigo-600 bg-indigo-50/40'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  id="payment-bank"
                  name="paymentMethod"
                  data-testid="payment-bank"
                  type="radio"
                  value="bank"
                  checked={paymentMethod === 'bank'}
                  onChange={() => setPaymentMethod('bank')}
                  className="w-4 h-4 text-indigo-600 mt-0.5 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    <span>Chuyển khoản ngân hàng VietQR</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Hệ thống sẽ hiển thị mã QR và số tài khoản ngân hàng để chuyển khoản tức thì.
                  </div>

                  {paymentMethod === 'bank' && (
                    <div id="bank-transfer-details" data-testid="bank-transfer-details" className="mt-2 p-2.5 bg-white border border-slate-200 rounded-lg text-xs space-y-1">
                      <div>Ngân hàng: <strong>Techcombank (TCB)</strong></div>
                      <div>Số tài khoản: <code className="font-mono text-indigo-600 font-bold">190388998899</code></div>
                      <div>Chủ tài khoản: <strong>CÔNG TY TNHH TECHSTORE VIETNAM</strong></div>
                    </div>
                  )}
                </div>
              </label>

              {/* Credit Card */}
              <label
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-indigo-600 bg-indigo-50/40'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  id="payment-card"
                  name="paymentMethod"
                  data-testid="payment-card"
                  type="radio"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="w-4 h-4 text-indigo-600 mt-0.5 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-slate-700" />
                    <span>Thẻ tín dụng / Ghi nợ quốc tế (Visa, Mastercard)</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Thanh toán trực tuyến bảo mật chuẩn quốc tế.
                  </div>

                  {/* Credit Card Details Inputs */}
                  {paymentMethod === 'card' && (
                    <div id="card-fields-container" data-testid="card-fields-container" className="mt-3 p-3 bg-white border border-slate-200 rounded-lg space-y-3">
                      <div>
                        <label htmlFor="input-card-number" className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                          Số thẻ:
                        </label>
                        <input
                          id="input-card-number"
                          name="cardNumber"
                          data-testid="input-card-number"
                          type="text"
                          placeholder="4111 2222 3333 4444"
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        {errors.cardNumber && (
                          <p id="error-card-number" data-testid="error-card-number" className="text-[10px] text-rose-600 mt-0.5">{errors.cardNumber}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label htmlFor="input-card-expiry" className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                            Hạn dùng (MM/YY):
                          </label>
                          <input
                            id="input-card-expiry"
                            name="cardExpiry"
                            data-testid="input-card-expiry"
                            type="text"
                            placeholder="12/28"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                          {errors.cardExpiry && (
                            <p id="error-card-expiry" data-testid="error-card-expiry" className="text-[10px] text-rose-600 mt-0.5">{errors.cardExpiry}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="input-card-cvv" className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                            Mã CVV:
                          </label>
                          <input
                            id="input-card-cvv"
                            name="cardCvv"
                            data-testid="input-card-cvv"
                            type="password"
                            placeholder="•••"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                          {errors.cardCvv && (
                            <p id="error-card-cvv" data-testid="error-card-cvv" className="text-[10px] text-rose-600 mt-0.5">{errors.cardCvv}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Section 4: Items summary and pricing */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="font-semibold text-slate-900 mb-1">
              Sản phẩm thanh toán ({cart.length} mặt hàng):
            </div>
            {cart.map((item) => (
              <div key={item.product.id} className="flex justify-between text-slate-600">
                <span className="truncate max-w-[260px]">
                  {item.product.name} (x{item.quantity})
                </span>
                <span className="font-mono">{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}

            <div className="border-t border-slate-200 pt-2 space-y-1">
              <div className="flex justify-between text-slate-500">
                <span>Tạm tính:</span>
                <span className="font-mono">{formatPrice(cartSubtotal)}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Giảm giá:</span>
                  <span className="font-mono">-{formatPrice(cartDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>Phí vận chuyển ({shippingMethod === 'express' ? 'Hỏa tốc' : 'Tiêu chuẩn'}):</span>
                <span className="font-mono">{formatPrice(shippingFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-200">
                <span>Tổng cộng thanh toán:</span>
                <span id="checkout-total-price" data-testid="checkout-total-price" className="font-mono text-indigo-600 text-base">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              id="btn-place-order"
              data-testid="btn-place-order"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-sm disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Đang xử lý đơn hàng...' : 'Xác nhận đặt hàng ngay'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
