import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ProductList } from './components/ProductList';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AuthModal } from './components/AuthModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { SeleniumCheatSheetModal } from './components/SeleniumCheatSheetModal';
import { ToastContainer } from './components/ToastContainer';
import { Footer } from './components/Footer';
import { Product, Order } from './types';

const MainLayout: React.FC = () => {
  const { products, addToCart } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false);

  const handleBuyNow = (product: Product, quantity: number) => {
    addToCart(product, quantity);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleProceedCheckoutFromCart = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    setConfirmedOrder(order);
  };

  const scrollToProducts = () => {
    const el = document.getElementById('product-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navigation */}
      <Header
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCheatSheet={() => setIsCheatSheetOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onSelectCategory={() => {}}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Campaign Hero Showcase */}
        <HeroSection
          onOpenCheatSheet={() => setIsCheatSheetOpen(true)}
          onExploreProducts={scrollToProducts}
        />

        {/* Product Catalog, Search & Filters */}
        <ProductList
          products={products}
          onSelectProduct={(p) => setSelectedProduct(p)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenCheatSheet={() => setIsCheatSheetOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
      />

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onBuyNow={handleBuyNow}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedCheckout={handleProceedCheckoutFromCart}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrderSuccessModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        onViewOrders={() => setIsOrdersOpen(true)}
      />

      <OrderTrackingModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      <SeleniumCheatSheetModal
        isOpen={isCheatSheetOpen}
        onClose={() => setIsCheatSheetOpen(false)}
      />

      {/* Toast Alert Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}
