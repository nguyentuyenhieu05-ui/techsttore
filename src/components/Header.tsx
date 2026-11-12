import React from 'react';
import { ShoppingBag, User as UserIcon, Code2, RefreshCw, Search, ShieldCheck, LogOut } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface HeaderProps {
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onOpenCheatSheet: () => void;
  onOpenOrders: () => void;
  onOpenAdmin: () => void;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCart,
  onOpenAuth,
  onOpenCheatSheet,
  onOpenOrders,
  onOpenAdmin,
  searchQuery,
  setSearchQuery
}) => {
  const { user, logout, cartTotalCount, resetDatabase } = useStore();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productSection = document.getElementById('product-catalog');
    if (productSection) {
      productSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Selenium Automation Quick Helper Bar */}
      <div 
        id="selenium-test-bar" 
        data-testid="selenium-test-bar" 
        className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-emerald-400 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Selenium Test Ready
          </span>
          <span className="text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-400">
            Tài khoản test: <code className="text-amber-300 font-mono">khachhang@techstore.vn</code> / <code className="text-amber-300 font-mono">Password123!</code>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-quick-reset"
            data-testid="btn-quick-reset"
            onClick={resetDatabase}
            title="Khôi phục dữ liệu ban đầu cho các kịch bản test lặp lại"
            className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Data mẫu</span>
          </button>

          <span className="text-slate-600">·</span>

          <button
            id="btn-open-cheatsheet"
            data-testid="btn-open-cheatsheet"
            onClick={onOpenCheatSheet}
            className="flex items-center gap-1 text-amber-300 hover:text-amber-200 font-medium transition-colors cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Bảng Locators & Code Python</span>
          </button>
        </div>
      </div>

      {/* Main Top Bar Contract: Brand — Nav Links — Primary Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-6">
          <a
            href="/"
            id="brand-logo"
            data-testid="brand-logo"
            className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-sm">
              TS
            </span>
            <span>TechStore</span>
          </a>

          {/* Search Bar */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="hidden md:flex items-center relative w-64 lg:w-80"
          >
            <input
              id="search-input"
              name="search"
              data-testid="search-input"
              type="text"
              placeholder="Tìm sản phẩm (laptop, titan...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <button
              id="search-btn"
              data-testid="search-btn"
              type="submit"
              className="sr-only"
            >
              Tìm kiếm
            </button>
          </form>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a
            href="#product-catalog"
            id="nav-products"
            data-testid="nav-products"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Sản phẩm
          </a>
          <button
            onClick={onOpenOrders}
            id="nav-orders"
            data-testid="nav-orders"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Đơn hàng của tôi
          </button>
          {user?.role === 'admin' && (
            <button
              onClick={onOpenAdmin}
              id="nav-admin"
              data-testid="nav-admin"
              className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Quản trị viên</span>
            </button>
          )}
          <button
            onClick={onOpenCheatSheet}
            id="nav-guide"
            data-testid="nav-guide"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer text-slate-600"
          >
            Hướng dẫn Test
          </button>
        </nav>

        {/* Zone 3: Actions (Auth & Cart) */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-2">
              <div 
                id="user-greeting" 
                data-testid="user-greeting" 
                className="text-xs text-right hidden sm:block"
              >
                <div className="font-semibold text-slate-900 truncate max-w-[140px]">{user.name}</div>
                <div className="text-slate-500 capitalize">{user.role}</div>
              </div>
              <button
                id="btn-logout"
                data-testid="btn-logout"
                onClick={logout}
                title="Đăng xuất"
                className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              id="btn-open-login"
              data-testid="btn-open-login"
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Đăng nhập</span>
            </button>
          )}

          {/* Cart Trigger */}
          <button
            id="btn-open-cart"
            data-testid="btn-open-cart"
            onClick={onOpenCart}
            aria-label="Giỏ hàng"
            className="relative p-2.5 text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" />
            <span
              id="cart-badge-count"
              data-testid="cart-badge-count"
              className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-indigo-600 text-white font-mono text-xs font-semibold rounded-full flex items-center justify-center tabular-nums"
            >
              {cartTotalCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
