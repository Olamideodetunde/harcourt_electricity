import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../lib/auth';
import { LogOut } from 'lucide-react';

const MainLayout = () => {
  const { user, logout, isAdmin } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <header className="bg-brand-dark shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <img src="/logo.png" alt="PHEDC Logo" className="h-12 w-auto object-contain" />
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-300 hover:text-primary-light transition-colors font-medium">Home</Link>
              {user && !isAdmin() && (
                <>
                  <Link to="/customer/dashboard" className="text-gray-300 hover:text-primary-light transition-colors font-medium">Dashboard</Link>
                  <Link to="/customer/purchase" className="text-gray-300 hover:text-primary-light transition-colors font-medium">Buy Electricity</Link>
                </>
              )}
              {user && isAdmin() && (
                <>
                  <Link to="/admin/dashboard" className="text-gray-300 hover:text-primary-light transition-colors font-medium">Admin Dashboard</Link>
                  <Link to="/admin/customers" className="text-gray-300 hover:text-primary-light transition-colors font-medium">Customers</Link>
                </>
              )}
            </nav>

            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-bold text-white">{user.fullName}</span>
                    <span className="text-xs text-gray-400 capitalize">{user.role}</span>
                  </div>
                  <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-400 transition-colors bg-gray-800 hover:bg-gray-700 rounded-full">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link to="/login" className="px-4 py-2 text-white font-medium hover:bg-gray-800 rounded-lg transition-colors">Log In</Link>
                  <Link to="/register" className="px-4 py-2 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-lg shadow-sm hover:shadow transition-all border border-white/10">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">© 2026 Port Harcourt Electricity Distribution Company. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/admin/login" className="text-gray-400 hover:text-primary text-sm">Staff Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
