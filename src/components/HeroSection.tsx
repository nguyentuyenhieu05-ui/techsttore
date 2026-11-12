import React from 'react';
import { ArrowRight, Code2, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onOpenCheatSheet: () => void;
  onExploreProducts: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenCheatSheet,
  onExploreProducts
}) => {
  return (
    <section className="relative overflow-hidden bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline and CTAs */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-400">
              <span>Nền Tảng Thương Mại Điện Tử</span>
              <span aria-hidden="true">·</span>
              <span>Sẵn Sàng Cho Kiểm Thử Hộp Đen Selenium E2E</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Hệ thống bán hàng công nghệ cao chuẩn hoá cho Automation Test.
            </h1>

            <p className="text-base text-slate-300 leading-relaxed max-w-xl">
              Đầy đủ các luồng nghiệp vụ thực tế: Đăng nhập, Tìm kiếm, Lọc danh mục, Giỏ hàng, Mã giảm giá, Thanh toán COD/Thẻ, Quản lý đơn hàng và Đánh giá. Mọi phần tử đều có định danh <code className="text-amber-300 font-mono bg-slate-800 px-1.5 py-0.5 rounded text-xs">id</code> và <code className="text-amber-300 font-mono bg-slate-800 px-1.5 py-0.5 rounded text-xs">data-testid</code> chuẩn mực.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id="btn-hero-shop-now"
                data-testid="btn-hero-shop-now"
                onClick={onExploreProducts}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-950 bg-white hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <span>Khám phá sản phẩm</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="btn-hero-view-locators"
                data-testid="btn-hero-view-locators"
                onClick={onOpenCheatSheet}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <Code2 className="w-4 h-4 text-amber-400" />
                <span>Xem mẫu mã Selenium Python</span>
              </button>
            </div>

            {/* Test capabilities trust points */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Kiểm tra biên (Boundary tests)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Xác thực form hợp lệ / không hợp lệ</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Khôi phục dữ liệu ban đầu tức thì</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-fidelity Studio Hero Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-800/40">
              <img
                src="/src/assets/images/hero_ecommerce_store_1793930610600.jpg"
                alt="Showcase sản phẩm công nghệ TechStore"
                className="w-full h-[320px] sm:h-[400px] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-xs text-slate-300">
                  <div className="font-semibold text-white text-sm">TechStore Ecosystem 2026</div>
                  <div>Thiết bị công nghệ nguyên khối chuẩn flagship cao cấp</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
