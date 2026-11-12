import React, { useState } from 'react';
import { X, Trash2, ArrowRight, Minus, Plus, ShoppingBag, Tag, Check, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedCheckout
}) => {
  const {
    cart,
    cartTotalCount,
    cartSubtotal,
    cartDiscount,
    cartShippingFee,
    cartTotal,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    activeCoupon,
    applyCoupon,
    removeCoupon
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isOpen) return null;

  const formatPrice = (val: number) => {
    return val.toLocaleString('vi-VN') + ' ₫';
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const res = applyCoupon(couponCode);
    if (res.success) {
      setCouponSuccess(res.message);
      setCouponCode('');
    } else {
      setCouponError(res.message);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponSuccess('');
    setCouponError('');
  };

  return (
    <div
      id="cart-drawer-overlay"
      className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end"
    >
      <div
        id="cart-drawer"
        data-testid="cart-drawer"
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-200"
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              Giỏ hàng của bạn
            </h2>
            <span
              id="drawer-item-count"
              data-testid="drawer-item-count"
              className="text-xs font-mono font-semibold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full"
            >
              {cartTotalCount}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                id="btn-clear-cart"
                data-testid="btn-clear-cart"
                onClick={clearCart}
                className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 rounded hover:bg-rose-50 transition-colors cursor-pointer"
              >
                Xóa tất cả
              </button>
            )}
            <button
              id="btn-close-cart"
              data-testid="btn-close-cart"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Items List or Empty State */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div
              id="cart-empty-message"
              data-testid="cart-empty-message"
              className="h-full flex flex-col items-center justify-center text-center py-12"
            >
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-base font-semibold text-slate-900">
                Giỏ hàng của bạn đang trống
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Hãy lựa chọn các thiết bị công nghệ hấp dẫn và thêm vào giỏ để tiến hành kiểm thử.
              </p>
              <button
                id="btn-cart-shop-now"
                data-testid="btn-cart-shop-now"
                onClick={onClose}
                className="mt-6 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            <div id="cart-items-list" data-testid="cart-items-list" className="space-y-3">
              {cart.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  id={`cart-item-${product.id}`}
                  data-testid={`cart-item-${product.id}`}
                  className="flex gap-3 p-3 bg-slate-50/70 border border-slate-200 rounded-xl"
                >
                  {/* Thumbnail */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg bg-white border border-slate-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  {/* Info & Stepper */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          id={`cart-item-title-${product.id}`}
                          data-testid={`cart-item-title-${product.id}`}
                          className="text-xs font-semibold text-slate-900 truncate"
                        >
                          {product.name}
                        </h4>
                        <button
                          id={`btn-cart-remove-${product.id}`}
                          data-testid={`btn-cart-remove-${product.id}`}
                          onClick={() => removeFromCart(product.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div
                        id={`cart-item-price-${product.id}`}
                        data-testid={`cart-item-price-${product.id}`}
                        className="text-xs font-mono font-bold text-slate-700 mt-0.5"
                      >
                        {formatPrice(product.price)}
                      </div>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-slate-300 rounded bg-white">
                        <button
                          id={`btn-cart-minus-${product.id}`}
                          data-testid={`btn-cart-minus-${product.id}`}
                          onClick={() => updateCartQuantity(product.id, quantity - 1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span
                          id={`input-cart-qty-${product.id}`}
                          data-testid={`input-cart-qty-${product.id}`}
                          className="w-8 text-center text-xs font-mono font-bold text-slate-900"
                        >
                          {quantity}
                        </span>
                        <button
                          id={`btn-cart-plus-${product.id}`}
                          data-testid={`btn-cart-plus-${product.id}`}
                          onClick={() => updateCartQuantity(product.id, quantity + 1)}
                          disabled={quantity >= product.stock}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div
                        id={`cart-item-subtotal-${product.id}`}
                        data-testid={`cart-item-subtotal-${product.id}`}
                        className="text-xs font-mono font-semibold text-indigo-600"
                      >
                        {formatPrice(product.price * quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer: Coupon code & Checkout summary */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-slate-200 bg-white space-y-4 shadow-lg">
            {/* Promo Code Form */}
            <div className="space-y-1.5">
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    id="input-coupon"
                    name="coupon"
                    data-testid="input-coupon"
                    type="text"
                    placeholder="Nhập mã (GIAM10, FREESHIP...)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs font-mono uppercase bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
                <button
                  id="btn-apply-coupon"
                  data-testid="btn-apply-coupon"
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Áp dụng
                </button>
              </form>

              {/* Coupon alerts */}
              {couponError && (
                <div
                  id="coupon-feedback"
                  data-testid="coupon-feedback"
                  className="text-xs text-rose-600 flex items-center gap-1 font-medium"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{couponError}</span>
                </div>
              )}

              {couponSuccess && (
                <div
                  id="coupon-feedback"
                  data-testid="coupon-feedback"
                  className="text-xs text-emerald-600 flex items-center gap-1 font-medium"
                >
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>{couponSuccess}</span>
                </div>
              )}

              {/* Active coupon tag */}
              {activeCoupon && (
                <div
                  id="active-coupon-badge"
                  data-testid="active-coupon-badge"
                  className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md"
                >
                  <span className="font-mono font-semibold">Mã: {activeCoupon.code}</span>
                  <button
                    id="btn-remove-coupon"
                    data-testid="btn-remove-coupon"
                    onClick={handleRemoveCoupon}
                    className="text-emerald-700 hover:text-emerald-900 font-bold ml-2 cursor-pointer"
                  >
                    × Gỡ
                  </button>
                </div>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs border-t border-slate-100 pt-3">
              <div className="flex justify-between text-slate-500">
                <span>Tạm tính hàng:</span>
                <span id="cart-subtotal" data-testid="cart-subtotal" className="font-mono text-slate-800">
                  {formatPrice(cartSubtotal)}
                </span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Giảm giá khuyến mãi:</span>
                  <span id="cart-discount" data-testid="cart-discount" className="font-mono font-medium">
                    -{formatPrice(cartDiscount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-slate-500">
                <span>Phí giao hàng:</span>
                <span id="cart-shipping" data-testid="cart-shipping" className="font-mono text-slate-800">
                  {cartShippingFee === 0 ? 'Miễn phí' : formatPrice(cartShippingFee)}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Tổng thanh toán:</span>
                <span id="cart-total" data-testid="cart-total" className="font-mono text-indigo-600 tabular-nums">
                  {formatPrice(cartTotal)}
                </span>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <button
              id="btn-proceed-checkout"
              data-testid="btn-proceed-checkout"
              onClick={onProceedCheckout}
              className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              <span>Tiến hành đặt hàng</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
