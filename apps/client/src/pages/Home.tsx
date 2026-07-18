import { Zap, ShieldCheck, Clock, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../lib/auth';

const Home = () => {
  const isAuth = useAuthStore((state) => state.isAuthenticated());
  const admin = useAuthStore((state) => state.isAdmin());
  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative mt-8 lg:mt-16 rounded-3xl overflow-hidden bg-brand-dark text-white">
        <div className="absolute inset-0 opacity-30 bg-[url('/power_grid.png')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark to-brand-dark/50" />
        
        <div className="relative z-10 px-8 py-20 lg:py-32 max-w-4xl">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/20 text-primary-light font-bold text-sm tracking-wider mb-6 border border-primary/30">
            OFFICIAL PAYMENT PORTAL
          </span>
          <h1 className="text-5xl md:text-7xl font-bold font-heading leading-tight mb-6">
            Powering Your Life,<br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-accent-light">Without Interruption.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
            Purchase your electricity tokens instantly. Secure, fast, and reliable online payment system for Port Harcourt Electricity Distribution Company.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {!isAuth ? (
              <>
                <Link to="/register" className="btn-primary text-center text-lg">
                  Get Started Now
                </Link>
                <Link to="/login" className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all text-center text-lg backdrop-blur-sm border border-white/20">
                  Customer Login
                </Link>
              </>
            ) : (
              <Link to={admin ? "/admin/dashboard" : "/customer/dashboard"} className="btn-primary text-center text-lg">
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card-glass p-8 group hover:-translate-y-2 transition-transform duration-300">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
            <Zap className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-brand-dark">Instant Tokens</h3>
          <p className="text-gray-500 leading-relaxed">Receive your 20-digit STS meter tokens instantly via email and on your dashboard after successful payment.</p>
        </div>

        <div className="card-glass p-8 group hover:-translate-y-2 transition-transform duration-300">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 group-hover:bg-blue-500 group-hover:text-white transition-colors text-blue-600">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-brand-dark">Secure Payments</h3>
          <p className="text-gray-500 leading-relaxed">Powered by Paystack. Your financial data is encrypted and processed with bank-level security.</p>
        </div>

        <div className="card-glass p-8 group hover:-translate-y-2 transition-transform duration-300">
          <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors text-accent-dark">
            <Clock className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-brand-dark">24/7 Availability</h3>
          <p className="text-gray-500 leading-relaxed">Purchase electricity anytime, anywhere. Our automated system works round the clock to keep your lights on.</p>
        </div>
      </section>

      {/* Image Showcase Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-4 md:px-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-brand-dark mb-6 leading-tight">
            Next-Generation <span className="text-primary">Smart Metering</span>
          </h2>
          <p className="text-lg text-gray-500 mb-8 leading-relaxed">
            Our platform connects directly with PHEDC's latest smart electricity meters. Enjoy real-time tracking, seamless remote top-ups, and uninterrupted power with our instant STS 20-digit token generation system. 
          </p>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-gray-600">
              <Zap className="w-5 h-5 text-accent-dark" /> Real-time balance updates
            </li>
            <li className="flex items-center gap-3 text-gray-600">
              <ShieldCheck className="w-5 h-5 text-accent-dark" /> Encrypted communication
            </li>
            <li className="flex items-center gap-3 text-gray-600">
              <Clock className="w-5 h-5 text-accent-dark" /> Instant activation
            </li>
          </ul>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-3xl transform rotate-3 scale-105" />
          <img 
            src="/smart_meter.png" 
            alt="Smart Electricity Meter" 
            className="relative rounded-3xl shadow-2xl border border-white/50 w-full h-auto object-cover"
          />
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="card-glass p-12 text-center bg-gradient-to-br from-white to-gray-50">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">Ready to recharge?</h2>
        <p className="text-gray-500 mb-8 max-w-2xl mx-auto">Join thousands of customers who enjoy the convenience of buying electricity online without visiting our offices.</p>
        <Link to={isAuth ? (admin ? "/admin/dashboard" : "/customer/purchase") : "/register"} className="btn-primary inline-flex items-center gap-2">
          <CreditCard className="w-5 h-5" /> Pay Now
        </Link>
      </section>
    </div>
  );
};

export default Home;
