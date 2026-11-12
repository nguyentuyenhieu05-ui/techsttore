import React from 'react';
import { ShieldCheck, Code2, RefreshCw } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface FooterProps {
  onOpenCheatSheet: () => void;
  onOpenOrders: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCheatSheet, onOpenOrders }) => {
  const { resetDatabase } = useStore();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <span className="w-6 h-6 rounded bg-indigo-600 text-white flex items-center justify-center font-black text-xs">
                TS
              </span>
              <span>TechStore</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Môi trường thử nghiệm thương mại điện tử chuyên biệt dành cho các kỹ sư kiểm thử phần mềm (QA/QC/SDET).
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <div className="font-semibold text-white">Chức Năng Chính</div>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <a href="#product-catalog" className="hover:text-white transition-colors">
                  Danh mục sản phẩm
                </a>
              </li>
              <li>
                <button onClick={onOpenOrders} className="hover:text-white transition-colors cursor-pointer">
                  Tra cứu đơn hàng
                </button>
              </li>
              <li>
                <a href="#selenium-test-bar" className="hover:text-white transition-colors">
                  Thanh công cụ test
                </a>
              </li>
            </ul>
          </div>

          {/* Testing info */}
          <div className="space-y-2">
            <div className="font-semibold text-white">Kiểm Thử Hộp Đen</div>
            <ul className="space-y-1.5 text-slate-400">
              <li>• Phân tích giá trị biên (BVA)</li>
              <li>• Phân vùng tương đương (EP)</li>
              <li>• Bảng quyết định (Decision Table)</li>
              <li>• Chuyển trạng thái đơn hàng (State Transition)</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <div className="font-semibold text-white">Công Cụ Selenium</div>
            <div className="space-y-2">
              <button
                id="btn-footer-cheatsheet"
                data-testid="btn-footer-cheatsheet"
                onClick={onOpenCheatSheet}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg transition-colors cursor-pointer"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Xem Cheat Sheet Locators</span>
              </button>

              <button
                id="btn-footer-reset-db"
                data-testid="btn-footer-reset-db"
                onClick={resetDatabase}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Khôi phục Database mẫu</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <div>
            © {new Date().getFullYear()} TechStore Automation Testing Platform. Thiết kế tối ưu cho Selenium WebDriver.
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Đã kiểm định tính tương thích với Selenium 4.x (Python, Java, C#, JS)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
