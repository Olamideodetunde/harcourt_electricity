import { Outlet, Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '../lib/auth';

const AuthLayout = () => {
  const { isAuthenticated, isAdmin } = useAuthStore();

  if (isAuthenticated()) {
    return <Navigate to={isAdmin() ? '/admin/dashboard' : '/customer/dashboard'} replace />;
  }

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-3xl" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <Link to="/" className="flex items-center justify-center">
            <img src="/logo.png" alt="PHEDC Logo" className="h-20 w-auto object-contain" />
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-heading font-bold text-white">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="card-glass py-8 px-4 sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
