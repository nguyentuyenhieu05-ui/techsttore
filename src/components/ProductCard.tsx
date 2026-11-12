import React from 'react';
import { Star, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart } = useStore();
  const isOutOfStock = product.stock <= 0;

  const formatPrice = (val: number) => {
    return val.toLocaleString('vi-VN') + ' ₫';
  };

  return (
    <div
      id={`product-card-${product.id}`}
      data-testid={`product-card-${product.id}`}
      className="group bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col hover:border-slate-300 hover:shadow-md transition-all duration-200"
    >
      {/* Product Image Area */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Status Tag */}
        {product.badge && (
          <span
            id={`product-badge-${product.id}`}
            data-testid={`product-badge-${product.id}`}
            className={`absolute top-3 left-3 text-xs font-semibold px-2 py-0.5 rounded shadow-sm ${
              isOutOfStock
                ? 'bg-rose-100 text-rose-700'
                : 'bg-white/90 text-slate-800 backdrop-blur-sm'
            }`}
          >
            {product.badge}
          </span>
        )}

        {/* Quick View Button overlay on hover */}
        <button
          id={`btn-quickview-${product.id}`}
          data-testid={`btn-quickview-${product.id}`}
          onClick={() => onSelect(product)}
          className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-medium backdrop-blur-[2px] cursor-pointer"
        >
          <Eye className="w-4 h-4" />
          <span>Xem chi tiết nhanh</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata line */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span
              id={`product-category-${product.id}`}
              data-testid={`product-category-${product.id}`}
            >
              {product.categoryName}
            </span>
            <div className="flex items-center gap-1 font-mono">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{product.rating}</span>
              <span className="text-slate-400">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3
            id={`product-title-${product.id}`}
            data-testid={`product-title-${product.id}`}
            onClick={() => onSelect(product)}
            className="font-semibold text-slate-900 text-sm line-clamp-2 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            {product.name}
          </h3>

          {/* Stock indicator */}
          <div className="mt-1 text-xs">
            {isOutOfStock ? (
              <span
                id={`product-stock-${product.id}`}
                data-testid={`product-stock-${product.id}`}
                className="text-rose-600 font-medium"
              >
                Tạm hết hàng (0 tồn kho)
              </span>
            ) : (
              <span
                id={`product-stock-${product.id}`}
                data-testid={`product-stock-${product.id}`}
                className="text-slate-500"
              >
                Còn <strong className="font-mono text-slate-700">{product.stock}</strong> sản phẩm
              </span>
            )}
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div
              id={`product-price-${product.id}`}
              data-testid={`product-price-${product.id}`}
              className="text-base font-bold text-slate-900 font-mono tabular-nums"
            >
              {formatPrice(product.price)}
            </div>
            {product.originalPrice && (
              <div className="text-xs text-slate-400 line-through font-mono tabular-nums">
                {formatPrice(product.originalPrice)}
              </div>
            )}
          </div>

          <button
            id={`btn-add-cart-${product.id}`}
            data-testid={`btn-add-cart-${product.id}`}
            disabled={isOutOfStock}
            onClick={() => addToCart(product, 1)}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isOutOfStock ? 'Hết hàng' : 'Thêm giỏ'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
