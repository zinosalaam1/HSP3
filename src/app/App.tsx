import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from '@/app/components/ui/sonner';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Navbar } from '@/app/components/Navbar';
import { Footer } from '@/app/components/Footer';
import { HomePage } from '@/app/components/HomePage';
import { ShopPage } from '@/app/components/ShopPage';
import { ProductDetailPage } from '@/app/components/ProductDetailPage';
import { CartPage } from '@/app/components/CartPage';
import { CheckoutPage } from '@/app/components/CheckoutPage';
import { AccountPage } from '@/app/components/AccountPage';
import { AdminDashboard } from '@/app/components/AdminDashboard';
import { AdminLoginPage } from '@/app/components/AdminLoginPage';
import { ServicesPage } from '@/app/components/ServicesPage';
import { AboutPage } from '@/app/components/AboutPage';
import { LoginPage } from '@/app/components/LoginPage';
import { RegisterPage } from '@/app/components/RegisterPage';

// ── Loading screen ───────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center">
      <div className="text-center">
        <p className="font-['Playfair_Display'] text-3xl text-[#1C1C1E] mb-4">HSP</p>
        <div className="w-6 h-6 border-2 border-[#C9A45C] border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    </div>
  );
}

// ── Auth guards ──────────────────────────────────────────────
function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

function RequireAdmin({ children }: { children: JSX.Element }) {
  const { isAdmin, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  if (loading) return <LoadingScreen />;
  // Not logged in → admin login page
  if (!isAuthenticated) return <Navigate to="/admin/login" state={{ from: location }} replace />;
  // Logged in but not admin → also admin login page with error context
  if (!isAdmin) return <Navigate to="/admin/login" state={{ from: location, notAdmin: true }} replace />;
  return children;
}

// ── Shell layout ─────────────────────────────────────────────
function Shell({ children, hideFooter = false }: { children: React.ReactNode; hideFooter?: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const noShellPaths = ['/login', '/register', '/admin/login'];
  if (noShellPaths.includes(location.pathname)) return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col">
      <Navbar onNavigate={(page) => navigate(page === 'home' ? '/' : `/${page}`)} />
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
      <Toaster position="bottom-right" />
    </div>
  );
}

// ── Page wrappers ─────────────────────────────────────────────
function HomePageWrapper() {
  const navigate = useNavigate();
  return (
    <Shell>
      <HomePage
        onNavigate={(p) => navigate(p === 'home' ? '/' : `/${p}`)}
        onProductClick={(product) => navigate(`/product/${product.id}`, { state: { product } })}
      />
    </Shell>
  );
}

function ShopPageWrapper() {
  const navigate = useNavigate();
  return (
    <Shell>
      <ShopPage
        onProductClick={(product) => navigate(`/product/${product.id}`, { state: { product } })}
      />
    </Shell>
  );
}

function ProductDetailWrapper() {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;
  if (!product) return <Navigate to="/shop" replace />;
  return (
    <Shell>
      <ProductDetailPage
        product={product}
        onBack={() => navigate('/shop')}
        onProductClick={(p) => navigate(`/product/${p.id}`, { state: { product: p } })}
      />
    </Shell>
  );
}

function CartPageWrapper() {
  const navigate = useNavigate();
  return (
    <Shell>
      <CartPage
        onNavigate={(p) => navigate(`/${p}`)}
        onCheckout={() => navigate('/checkout')}
      />
    </Shell>
  );
}

function CheckoutPageWrapper() {
  const navigate = useNavigate();
  return (
    <Shell hideFooter>
      <CheckoutPage onNavigate={(p) => navigate(p === 'home' ? '/' : `/${p}`)} />
    </Shell>
  );
}

function LoginPageWrapper() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isAdmin } = useAuth();
  const from = (location.state as any)?.from?.pathname || '/';

  // Already logged in → redirect
  if (isAuthenticated) return <Navigate to={isAdmin ? '/admin' : from} replace />;

  return (
    <Shell>
      <LoginPage
        onNavigate={(p) => navigate(p === 'home' ? '/' : `/${p}`)}
        onLoginSuccess={() => navigate(from, { replace: true })}
      />
    </Shell>
  );
}

function RegisterPageWrapper() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return (
    <Shell>
      <RegisterPage onNavigate={(p) => navigate(p === 'home' ? '/' : `/${p}`)} />
    </Shell>
  );
}

function AdminLoginWrapper() {
  const { isAdmin, isAuthenticated } = useAuth();
  // Already admin → go straight to dashboard
  if (isAuthenticated && isAdmin) return <Navigate to="/admin" replace />;
  return <AdminLoginPage />;
}

function AdminWrapper() {
  return (
    <RequireAdmin>
      <Shell>
        <AdminDashboard />
      </Shell>
    </RequireAdmin>
  );
}

function AccountWrapper() {
  return (
    <RequireAuth>
      <Shell>
        <AccountPage />
      </Shell>
    </RequireAuth>
  );
}

// ── Routes ────────────────────────────────────────────────────
function AppRoutes() {
  const { loading } = useAuth();
  if (loading) return <LoadingScreen />;

  return (
    <Routes>
      <Route path="/"              element={<HomePageWrapper />} />
      <Route path="/shop"          element={<ShopPageWrapper />} />
      <Route path="/product/:id"   element={<ProductDetailWrapper />} />
      <Route path="/services"      element={<Shell><ServicesPage /></Shell>} />
      <Route path="/about"         element={<Shell><AboutPage /></Shell>} />
      <Route path="/cart"          element={<CartPageWrapper />} />
      <Route path="/checkout"      element={<CheckoutPageWrapper />} />
      <Route path="/login"         element={<LoginPageWrapper />} />
      <Route path="/register"      element={<RegisterPageWrapper />} />
      <Route path="/account"       element={<AccountWrapper />} />
      <Route path="/admin/login"   element={<AdminLoginWrapper />} />
      <Route path="/admin"         element={<AdminWrapper />} />
      <Route path="*"              element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
          <Toaster position="bottom-right" />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
