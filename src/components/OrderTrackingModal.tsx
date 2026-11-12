import React, { useState } from 'react';
import { X, Package, Search, Ban, Clock, CheckCircle2, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { OrderStatus } from '../types';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose
}) => {
  const { orders, cancelOrder } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [cancelFeedback, setCancelFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const formatPrice = (val: number) => {
    return val.toLocaleString('vi-VN') + ' ₫';
  };

  const filteredOrders = orders.filter((o) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    return (
      o.orderCode.toLowerCase().includes(term) ||
      o.phone.toLowerCase().includes(term) ||
      o.customerName.toLowerCase().includes(term) ||
      o.email.toLowerCase().includes(term)
    );
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            <Clock className="w-3 h-3" />
            <span>Chờ xác nhận</span>
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            <Package className="w-3 h-3" />
            <span>Đang đóng gói</span>
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
            <Truck className="w-3 h-3" />
            <span>Đang giao hàng</span>
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>Đã giao thành công</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
            <Ban className="w-3 h-3" />
            <span>Đã hủy</span>
          </span>
        );
    }
  };

  const handleCancel = async (orderId: string, orderCode: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn hủy đơn hàng ${orderCode}?`)) {
      const res = await cancelOrder(orderId);
      setCancelFeedback(res.message);
      setTimeout(() => setCancelFeedback(null), 4000);
    }
  };

  return (
    <div
      id="modal-order-tracking"
      data-testid="modal-order-tracking"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              Tra Cứu & Quản Lý Đơn Hàng
            </h2>
          </div>
          <button
            id="btn-close-orders"
            data-testid="btn-close-orders"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                id="input-search-order"
                data-testid="input-search-order"
                type="text"
                placeholder="Tìm theo mã đơn (ORD-...), số điện thoại hoặc tên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            {searchTerm && (
              <button
                id="btn-clear-order-search"
                data-testid="btn-clear-order-search"
                onClick={() => setSearchTerm('')}
                className="px-3 py-2 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Xóa tìm kiếm
              </button>
            )}
          </div>

          {/* Feedback banner */}
          {cancelFeedback && (
            <div
              id="cancel-order-feedback"
              data-testid="cancel-order-feedback"
              className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-xs font-medium"
            >
              {cancelFeedback}
            </div>
          )}

          {/* Orders Table */}
          {filteredOrders.length > 0 ? (
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                    <tr>
                      <th className="p-3">Mã đơn</th>
                      <th className="p-3">Khách hàng</th>
                      <th className="p-3">Ngày đặt</th>
                      <th className="p-3">Sản phẩm</th>
                      <th className="p-3">Tổng tiền</th>
                      <th className="p-3">Trạng thái</th>
                      <th className="p-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        id={`order-row-${order.orderCode}`}
                        data-testid="order-row"
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        <td className="p-3 font-mono font-bold text-indigo-600">
                          <span data-testid="order-code">{order.orderCode}</span>
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-slate-900">{order.customerName}</div>
                          <div className="text-slate-500 font-mono text-[11px]">{order.phone}</div>
                        </td>
                        <td className="p-3 text-slate-500 font-mono whitespace-nowrap">
                          {order.createdAt}
                        </td>
                        <td className="p-3">
                          <div className="space-y-1 max-w-[200px]">
                            {order.items.map((it, idx) => (
                              <div key={idx} className="truncate text-slate-700">
                                • {it.productName} <span className="text-slate-400 font-mono">(x{it.quantity})</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                          {formatPrice(order.total)}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <div data-testid="order-status">
                            {getStatusBadge(order.status)}
                          </div>
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          {order.status === 'pending' ? (
                            <button
                              id={`btn-cancel-order-${order.orderCode}`}
                              data-testid="btn-cancel-order"
                              onClick={() => handleCancel(order.id, order.orderCode)}
                              className="px-2.5 py-1 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors cursor-pointer"
                            >
                              Hủy đơn
                            </button>
                          ) : (
                            <span className="text-slate-400 text-xs italic">
                              {order.status === 'cancelled' ? 'Đã hủy' : 'Không thể hủy'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div
              id="empty-orders-view"
              data-testid="empty-orders-view"
              className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200"
            >
              <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800">
                Không tìm thấy đơn hàng nào
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Hãy tiến hành đặt đơn hàng mới để kiểm thử chức năng theo dõi đơn hàng.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
