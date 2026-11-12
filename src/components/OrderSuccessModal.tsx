import React from 'react';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Order } from '../types';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  onViewOrders: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onViewOrders
}) => {
  if (!order) return null;

  const formatPrice = (val: number) => {
    return val.toLocaleString('vi-VN') + ' ₫';
  };

  return (
    <div
      id="modal-order-success"
      data-testid="modal-order-success"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 sm:p-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10" />
        </div>

        {/* Banner text */}
        <div className="space-y-1">
          <h2
            id="order-success-title"
            data-testid="order-success-title"
            className="text-2xl font-bold text-slate-900"
          >
            Đặt hàng thành công!
          </h2>
          <p className="text-xs text-slate-500">
            Cảm ơn bạn đã mua hàng tại TechStore. Kiện hàng đang được chuẩn bị để giao đến bạn.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2.5">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-slate-500">Mã đơn hàng:</span>
            <span
              id="order-code-display"
              data-testid="order-code-display"
              className="font-mono text-sm font-bold text-indigo-600"
            >
              {order.orderCode}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Người nhận:</span>
            <span className="font-semibold text-slate-800">{order.customerName}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Số điện thoại:</span>
            <span className="font-mono text-slate-800">{order.phone}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Địa chỉ giao:</span>
            <span className="text-slate-800 text-right truncate max-w-[240px]">
              {order.address}, {order.city}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Phương thức thanh toán:</span>
            <span className="font-semibold uppercase text-slate-800">
              {order.paymentMethod === 'cod' ? 'Thanh toán COD' : order.paymentMethod === 'bank' ? 'Chuyển khoản QR' : 'Thẻ quốc tế'}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-200">
            <span className="font-semibold text-slate-700">Tổng tiền thanh toán:</span>
            <span
              id="order-success-total"
              data-testid="order-success-total"
              className="font-mono text-base font-bold text-indigo-600"
            >
              {formatPrice(order.total)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            id="btn-view-order-details"
            data-testid="btn-view-order-details"
            onClick={() => {
              onClose();
              onViewOrders();
            }}
            className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Package className="w-4 h-4" />
            <span>Theo dõi đơn hàng này</span>
          </button>

          <button
            id="btn-success-continue-shopping"
            data-testid="btn-success-continue-shopping"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Tiếp tục mua hàng</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
