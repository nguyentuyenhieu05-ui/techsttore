import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, ArrowUpDown, X, Search } from 'lucide-react';
import { Product, Category } from '../types';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'phone', label: 'Điện thoại' },
  { id: 'laptop', label: 'Laptop' },
  { id: 'audio', label: 'Âm thanh' },
  { id: 'watch', label: 'Đồng hồ' },
  { id: 'accessories', label: 'Phụ kiện' }
];

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onSelectProduct,
  searchQuery,
  setSearchQuery
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = p.name.toLowerCase().includes(query);
        const matchDesc = p.description.toLowerCase().includes(query);
        const matchCategory = p.categoryName.toLowerCase().includes(query);
        if (!matchName && !matchDesc && !matchCategory) {
          return false;
        }
      }
      // Min price
      if (minPrice && !isNaN(Number(minPrice)) && p.price < Number(minPrice)) {
        return false;
      }
      // Max price
      if (maxPrice && !isNaN(Number(maxPrice)) && p.price > Number(maxPrice)) {
        return false;
      }
      // In-stock only
      if (inStockOnly && p.stock <= 0) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [products, selectedCategory, searchQuery, minPrice, maxPrice, inStockOnly, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSortBy('default');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setSearchQuery('');
  };

  return (
    <section id="product-catalog" data-testid="product-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Catalog Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Danh Mục Sản Phẩm Công Nghệ
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Lọc sản phẩm theo danh mục, mức giá và thực hiện kiểm thử tự động với Selenium.
          </p>
        </div>

        {/* Counter and Reset Action */}
        <div className="flex items-center gap-3">
          <span
            id="product-count-display"
            data-testid="product-count-display"
            className="text-xs font-mono font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md"
          >
            Hiển thị <strong className="text-slate-900">{filteredProducts.length}</strong> / {products.length} sản phẩm
          </span>

          {(selectedCategory !== 'all' || searchQuery || minPrice || maxPrice || inStockOnly || sortBy !== 'default') && (
            <button
              id="btn-reset-filters"
              data-testid="btn-reset-filters"
              onClick={handleResetFilters}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Xóa bộ lọc</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="space-y-4 mb-8 bg-white p-4 rounded-xl border border-slate-200">
        {/* Category segment tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-sm no-scrollbar">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Danh mục:
          </span>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`filter-category-${cat.id}`}
                data-testid={`filter-category-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Secondary filters row: Price range, in-stock checkbox, and sort dropdown */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
          {/* Price Range Filter Form */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Khoảng giá (₫):</span>
            <input
              id="filter-min-price"
              data-testid="filter-min-price"
              type="number"
              placeholder="Giá từ..."
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-28 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <span className="text-slate-400">-</span>
            <input
              id="filter-max-price"
              data-testid="filter-max-price"
              type="number"
              placeholder="Đến..."
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-28 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />

            {/* In stock only checkbox */}
            <label className="flex items-center gap-1.5 ml-2 cursor-pointer select-none text-slate-700">
              <input
                id="filter-instock-only"
                data-testid="filter-instock-only"
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-3.5 h-3.5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
              />
              <span>Chỉ còn hàng</span>
            </label>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 text-xs">
            <label htmlFor="sort-select" className="text-slate-500 font-medium flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sắp xếp:
            </label>
            <select
              id="sort-select"
              data-testid="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="default">Mặc định</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="rating">Đánh giá cao nhất</option>
            </select>
          </div>
        </div>

        {/* Active search pill reminder */}
        {searchQuery && (
          <div className="text-xs text-slate-600 flex items-center gap-1.5 bg-indigo-50/70 text-indigo-900 px-3 py-1.5 rounded-lg">
            <Search className="w-3.5 h-3.5" />
            <span>Kết quả tìm kiếm cho: <strong>"{searchQuery}"</strong></span>
            <button
              onClick={() => setSearchQuery('')}
              className="ml-auto text-indigo-600 hover:text-indigo-900 font-bold cursor-pointer"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Product Grid or Empty State */}
      {filteredProducts.length > 0 ? (
        <div 
          id="product-grid" 
          data-testid="product-grid" 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      ) : (
        <div
          id="empty-products-msg"
          data-testid="empty-products-msg"
          className="bg-white rounded-xl border border-slate-200 p-12 text-center"
        >
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">
            Không tìm thấy sản phẩm phù hợp
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Không có sản phẩm nào khớp với từ khóa tìm kiếm hoặc bộ lọc hiện tại của bạn.
          </p>
          <button
            id="btn-empty-reset"
            data-testid="btn-empty-reset"
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
          >
            Đặt lại toàn bộ bộ lọc
          </button>
        </div>
      )}
    </section>
  );
};
