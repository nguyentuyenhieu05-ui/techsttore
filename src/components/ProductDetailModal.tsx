import React, { useState } from 'react';
import { X, Star, ShoppingBag, ShieldCheck, Zap, Minus, Plus } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onBuyNow: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onBuyNow
}) => {
  const { addToCart, reviews, addReview } = useStore();
  const [quantity, setQuantity] = useState<number>(1);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  if (!product) return null;

  const isOutOfStock = product.stock <= 0;
  const productReviews = reviews.filter((r) => r.productId === product.id);

  const formatPrice = (val: number) => {
    return val.toLocaleString('vi-VN') + ' ₫';
  };

  const handleDecreaseQty = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleIncreaseQty = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      if (val < 1) setQuantity(1);
      else if (val > product.stock) setQuantity(product.stock);
      else setQuantity(val);
    }
  };

  const handleAddToCart = () => {
    const success = addToCart(product, quantity);
    if (success) {
      onClose();
    }
  };

  const handleBuyNowClick = () => {
    onBuyNow(product, quantity);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setIsSubmittingReview(true);
    await addReview(product.id, reviewAuthor, reviewRating, reviewComment);
    setReviewComment('');
    setReviewAuthor('');
    setIsSubmittingReview(false);
  };

  return (
    <div
      id="modal-product-detail"
      data-testid="modal-product-detail"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header bar */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>{product.categoryName}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-slate-700">Mã: {product.id}</span>
          </div>

          <button
            id="btn-close-detail"
            data-testid="btn-close-detail"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-6 space-y-8 flex-1">
          {/* Top Split: Image & Contiguous Purchase Module */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Gallery / Image */}
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-[4/3] relative">
              <img
                id="detail-product-image"
                data-testid="detail-product-image"
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 bg-white/90 text-slate-800 text-xs font-semibold px-2.5 py-1 rounded shadow-sm">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Purchase Module */}
            <div className="space-y-4">
              <h1
                id="detail-product-name"
                data-testid="detail-product-name"
                className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug"
              >
                {product.name}
              </h1>

              {/* Rating and Reviews Counter */}
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-1 text-amber-500 font-mono font-semibold">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span id="detail-product-rating" data-testid="detail-product-rating">{product.rating}</span>
                </div>
                <span>·</span>
                <span>{product.reviewCount} lượt đánh giá từ khách hàng</span>
              </div>

              {/* Price display */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-500 mb-0.5">Giá bán niêm yết:</div>
                <div className="flex items-baseline gap-3">
                  <span
                    id="detail-product-price"
                    data-testid="detail-product-price"
                    className="text-2xl sm:text-3xl font-extrabold text-indigo-600 font-mono tabular-nums"
                  >
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-slate-400 line-through font-mono tabular-nums">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Stock Status */}
              <div className="text-xs">
                {isOutOfStock ? (
                  <div
                    id="detail-stock-status"
                    data-testid="detail-stock-status"
                    className="p-2.5 bg-rose-50 text-rose-700 rounded-lg font-medium border border-rose-200"
                  >
                    Tình trạng: Tạm thời hết hàng trong kho. Không thể đặt mua.
                  </div>
                ) : (
                  <div
                    id="detail-stock-status"
                    data-testid="detail-stock-status"
                    className="text-slate-600 flex items-center gap-1.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Tình trạng: Còn <strong id="detail-stock-qty" data-testid="detail-stock-qty" className="font-mono text-slate-900">{product.stock}</strong> sản phẩm trong kho</span>
                  </div>
                )}
              </div>

              {/* Quantity Stepper */}
              {!isOutOfStock && (
                <div className="space-y-1.5 pt-2">
                  <label htmlFor="input-qty" className="text-xs font-semibold text-slate-700">
                    Số lượng mua:
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                      <button
                        id="btn-qty-minus"
                        data-testid="btn-qty-minus"
                        type="button"
                        onClick={handleDecreaseQty}
                        disabled={quantity <= 1}
                        className="p-2 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 transition-colors cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        id="input-qty"
                        data-testid="input-qty"
                        type="number"
                        min="1"
                        max={product.stock}
                        value={quantity}
                        onChange={handleQtyChange}
                        className="w-14 text-center font-mono text-sm font-semibold text-slate-900 border-x border-slate-200 py-1.5 focus:outline-none"
                      />
                      <button
                        id="btn-qty-plus"
                        data-testid="btn-qty-plus"
                        type="button"
                        onClick={handleIncreaseQty}
                        disabled={quantity >= product.stock}
                        className="p-2 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-xs text-slate-400">
                      (Tối đa: {product.stock})
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 grid grid-cols-2 gap-3">
                <button
                  id="btn-detail-add-cart"
                  data-testid="btn-detail-add-cart"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Thêm vào giỏ</span>
                </button>

                <button
                  id="btn-detail-buy-now"
                  data-testid="btn-detail-buy-now"
                  disabled={isOutOfStock}
                  onClick={handleBuyNowClick}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                >
                  <Zap className="w-4 h-4" />
                  <span>Mua ngay</span>
                </button>
              </div>

              {/* Guarantee markers */}
              <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  Bảo hành 12 tháng chính hãng
                </span>
                <span>·</span>
                <span>Đổi trả 1-1 trong 30 ngày</span>
              </div>
            </div>
          </div>

          {/* Description & Technical Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4 border-t border-slate-200">
            {/* Description */}
            <div className="md:col-span-7 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Mô tả sản phẩm
              </h3>
              <p
                id="detail-product-description"
                data-testid="detail-product-description"
                className="text-sm text-slate-600 leading-relaxed"
              >
                {product.description}
              </p>
            </div>

            {/* Technical Specifications Table */}
            <div className="md:col-span-5 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Thông số kỹ thuật
              </h3>
              <div
                id="detail-specs-table"
                data-testid="detail-specs-table"
                className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs"
              >
                <dl className="divide-y divide-slate-200">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="py-2 flex justify-between gap-4">
                      <dt className="text-slate-500 font-medium shrink-0">{key}</dt>
                      <dd className="text-slate-900 text-right font-medium">{val}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>

          {/* Customer Reviews & Feedback Form */}
          <div className="pt-6 border-t border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Đánh giá từ khách hàng ({productReviews.length})
              </h3>
            </div>

            {/* Add Review Form */}
            <form
              id="form-add-review"
              data-testid="form-add-review"
              onSubmit={handleReviewSubmit}
              className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3"
            >
              <div className="text-xs font-semibold text-slate-800">
                Gửi nhận xét của bạn về sản phẩm này:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="review-author-input" className="block text-xs font-medium text-slate-600 mb-1">
                    Tên của bạn:
                  </label>
                  <input
                    id="review-author-input"
                    data-testid="review-author-input"
                    type="text"
                    placeholder="VD: Nguyễn Văn A"
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="review-rating-select" className="block text-xs font-medium text-slate-600 mb-1">
                    Đánh giá sao:
                  </label>
                  <select
                    id="review-rating-select"
                    data-testid="review-rating-select"
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 sao - Tuyệt vời)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 sao - Rất tốt)</option>
                    <option value={3}>⭐⭐⭐ (3 sao - Bình thường)</option>
                    <option value={2}>⭐⭐ (2 sao - Tạm được)</option>
                    <option value={1}>⭐ (1 sao - Kém)</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="review-comment-input" className="block text-xs font-medium text-slate-600 mb-1">
                  Nội dung đánh giá:
                </label>
                <textarea
                  id="review-comment-input"
                  data-testid="review-comment-input"
                  rows={2}
                  placeholder="Chia sẻ cảm nhận về hiệu năng, thiết kế hoặc độ bền của sản phẩm..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  id="btn-submit-review"
                  data-testid="btn-submit-review"
                  type="submit"
                  disabled={isSubmittingReview || !reviewComment.trim()}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingReview ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
              </div>
            </form>

            {/* Reviews List */}
            <div id="reviews-container" data-testid="reviews-container" className="space-y-3">
              {productReviews.length > 0 ? (
                productReviews.map((rev) => (
                  <div
                    key={rev.id}
                    id={`review-item-${rev.id}`}
                    data-testid="review-item"
                    className="p-3 bg-white border border-slate-200 rounded-lg space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{rev.author}</span>
                      <span className="text-slate-400">{rev.date}</span>
                    </div>
                    <div className="flex items-center text-amber-500 text-xs">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-500" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 italic py-2">
                  Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên đánh giá!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
