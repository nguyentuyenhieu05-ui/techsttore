import React, { useState } from 'react';
import { X, ShieldCheck, Plus, Trash2, Package, Layers } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Category, OrderStatus } from '../types';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({ isOpen, onClose }) => {
  const { products, orders, addProduct, deleteProduct, updateProductStock, updateOrderStatus } = useStore();
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

  // New product form state
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('10');
  const [newCategory, setNewCategory] = useState<Category>('phone');
  const [newDesc, setNewDesc] = useState('');

  if (!isOpen) return null;

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPrice) return;

    const categoryNames: Record<Category, string> = {
      all: 'Tất cả',
      phone: 'Điện thoại',
      laptop: 'Laptop',
      audio: 'Âm thanh',
      watch: 'Đồng hồ',
      accessories: 'Phụ kiện'
    };

    addProduct({
      name: newName.trim(),
      category: newCategory,
      categoryName: categoryNames[newCategory] || 'Phụ kiện',
      price: Number(newPrice),
      stock: Number(newStock) || 0,
      image: '/src/assets/images/product_smartphone_flagship_1793930611791.jpg',
      description: newDesc.trim() || 'Sản phẩm công nghệ mới thêm từ giao diện Quản trị viên.',
      specs: {
        'Bảo hành': '12 tháng chính hãng',
        'Tình trạng': 'Mới 100% nguyên hộp'
      }
    });

    setNewName('');
    setNewPrice('');
    setNewStock('10');
    setNewDesc('');
  };

  const formatPrice = (val: number) => {
    return val.toLocaleString('vi-VN') + ' ₫';
  };

  return (
    <div
      id="modal-admin-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div
        id="modal-admin-panel"
        data-testid="modal-admin-panel"
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold">
              Bảng Quản Trị Hệ Thống (Admin Console)
            </h2>
          </div>
          <button
            id="btn-close-admin"
            data-testid="btn-close-admin"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="px-6 py-3 border-b border-slate-200 bg-slate-50 flex gap-2 text-xs font-semibold">
          <button
            id="admin-tab-products"
            data-testid="admin-tab-products"
            onClick={() => setActiveTab('products')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'products'
                ? 'bg-white text-indigo-600 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Kho sản phẩm & Tồn kho ({products.length})</span>
          </button>

          <button
            id="admin-tab-orders"
            data-testid="admin-tab-orders"
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-white text-indigo-600 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Xử lý đơn hàng ({orders.length})</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'products' ? (
            <div className="space-y-6">
              {/* Add Product Form */}
              <form
                id="form-admin-add-product"
                data-testid="form-admin-add-product"
                onSubmit={handleAddProductSubmit}
                className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3"
              >
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-indigo-600" />
                  <span>Thêm sản phẩm mới vào danh mục:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                  <div className="sm:col-span-5">
                    <label className="block text-slate-600 font-medium mb-1">Tên sản phẩm (*):</label>
                    <input
                      id="admin-product-name"
                      data-testid="admin-product-name"
                      type="text"
                      placeholder="VD: Cáp sạc nhanh 100W"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-slate-600 font-medium mb-1">Giá bán (₫) (*):</label>
                    <input
                      id="admin-product-price"
                      data-testid="admin-product-price"
                      type="number"
                      placeholder="350000"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 font-medium mb-1">Tồn kho:</label>
                    <input
                      id="admin-product-stock"
                      data-testid="admin-product-stock"
                      type="number"
                      placeholder="10"
                      value={newStock}
                      onChange={(e) => setNewStock(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 font-medium mb-1">Danh mục:</label>
                    <select
                      id="admin-product-category"
                      data-testid="admin-product-category"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as Category)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="phone">Điện thoại</option>
                      <option value="laptop">Laptop</option>
                      <option value="audio">Âm thanh</option>
                      <option value="watch">Đồng hồ</option>
                      <option value="accessories">Phụ kiện</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    id="btn-admin-add-product"
                    data-testid="btn-admin-add-product"
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Lưu sản phẩm mới
                  </button>
                </div>
              </form>

              {/* Products Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                    <tr>
                      <th className="p-3">Sản phẩm</th>
                      <th className="p-3">Danh mục</th>
                      <th className="p-3">Giá bán</th>
                      <th className="p-3">Tồn kho</th>
                      <th className="p-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {products.map((p) => (
                      <tr key={p.id} id={`admin-prod-row-${p.id}`} className="hover:bg-slate-50">
                        <td className="p-3">
                          <div className="font-semibold text-slate-900">{p.name}</div>
                          <div className="text-slate-400 font-mono text-[11px]">{p.id}</div>
                        </td>
                        <td className="p-3 text-slate-600">{p.categoryName}</td>
                        <td className="p-3 font-mono font-bold text-slate-800">{formatPrice(p.price)}</td>
                        <td className="p-3">
                          <input
                            id={`input-stock-${p.id}`}
                            data-testid={`input-stock-${p.id}`}
                            type="number"
                            min="0"
                            value={p.stock}
                            onChange={(e) => updateProductStock(p.id, Number(e.target.value))}
                            className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded font-mono text-center"
                          />
                        </td>
                        <td className="p-3 text-right">
                          <button
                            id={`btn-delete-prod-${p.id}`}
                            data-testid={`btn-delete-prod-${p.id}`}
                            onClick={() => deleteProduct(p.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            title="Xóa sản phẩm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Orders Admin View */
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                  <tr>
                    <th className="p-3">Mã đơn</th>
                    <th className="p-3">Khách hàng</th>
                    <th className="p-3">Tổng tiền</th>
                    <th className="p-3">Trạng thái hiện tại</th>
                    <th className="p-3">Cập nhật trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-indigo-600">{o.orderCode}</td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-900">{o.customerName}</div>
                        <div className="text-slate-400 text-[11px] font-mono">{o.phone}</div>
                      </td>
                      <td className="p-3 font-mono font-semibold text-slate-900">{formatPrice(o.total)}</td>
                      <td className="p-3 font-medium capitalize">{o.status}</td>
                      <td className="p-3">
                        <select
                          id={`select-status-${o.orderCode}`}
                          data-testid={`select-status-${o.orderCode}`}
                          value={o.status}
                          onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                          className="px-2.5 py-1 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                        >
                          <option value="pending">Chờ xác nhận (pending)</option>
                          <option value="processing">Đang đóng gói (processing)</option>
                          <option value="shipped">Đang giao hàng (shipped)</option>
                          <option value="delivered">Đã giao hàng (delivered)</option>
                          <option value="cancelled">Đã hủy (cancelled)</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
