import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './lib/auth';

// Layouts
import MainLayout from './components/MainLayout';
import AuthLayout from './components/AuthLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminLogin from './pages/auth/AdminLogin';

// Customer Pages
import Dashboard from './pages/customer/Dashboard';
import Purchase from './pages/customer/Purchase';
import History from './pages/customer/History';
import PaymentCallback from './pages/customer/PaymentCallback';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import Customers from './pages/admin/Customers';
import Tariffs from './pages/admin/Tariffs';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) => {
  const { isAuthenticated, isAdmin } = useAuthStore();
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/customer/dashboard" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
          </Route>
          
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/login" element={<AdminLogin />} />
          </Route>

          {/* Customer Routes */}
          <Route path="/customer" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="purchase" element={<Purchase />} />
            <Route path="history" element={<History />} />
            <Route path="payment-callback" element={<PaymentCallback />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute requireAdmin><MainLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="customers" element={<Customers />} />
            <Route path="tariffs" element={<Tariffs />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
