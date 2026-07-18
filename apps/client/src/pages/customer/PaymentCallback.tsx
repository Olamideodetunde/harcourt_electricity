import { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { CheckCircle2, XCircle, Loader2, Copy } from 'lucide-react';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [transaction, setTransaction] = useState<any>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!reference || fetchedRef.current) return;
    
    fetchedRef.current = true;
    const verifyPayment = async () => {
      try {
        const response = await api.get(`/transactions/${reference}/verify`);
        setTransaction(response.data);
        setStatus('success');
      } catch (error) {
        setStatus('error');
      }
    };

    verifyPayment();
  }, [reference]);

  if (!reference) return <div className="text-center py-12">Invalid access.</div>;

  const copyToken = () => {
    if (transaction?.token?.token_value) {
      navigator.clipboard.writeText(transaction.token.token_value);
      alert('Token copied!');
    }
  };

  return (
    <div className="max-w-xl mx-auto pt-12">
      <div className="card-glass p-8 text-center">
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
            <h2 className="text-2xl font-bold">Verifying Payment...</h2>
            <p className="text-gray-500 mt-2">Please wait while we confirm your transaction.</p>
          </div>
        )}

        {status === 'success' && transaction && (
          <div className="flex flex-col items-center py-4">
            <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-8">Your electricity token has been generated.</p>
            
            <div className="w-full bg-green-50 border border-green-200 rounded-xl p-6 mb-8 relative">
              <p className="text-sm font-semibold text-green-800 uppercase tracking-wider mb-2">Your Token</p>
              <div className="flex items-center justify-center gap-3">
                <p className="text-3xl font-bold text-brand-dark tracking-widest font-mono">
                  {transaction.token?.token_value || 'Generating...'}
                </p>
                <button onClick={copyToken} className="p-2 text-gray-500 hover:text-primary transition-colors bg-white rounded-md shadow-sm">
                  <Copy className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-green-700 mt-3 font-medium">{Number(transaction.token?.units || 0).toFixed(2)} kWh</p>
            </div>

            <Link to="/customer/dashboard" className="btn-primary w-full">
              Return to Dashboard
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center py-8">
            <XCircle className="w-20 h-20 text-red-500 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Verification Failed</h2>
            <p className="text-gray-600 mb-8">We could not verify your payment. If you were debited, please contact support.</p>
            
            <Link to="/customer/purchase" className="btn-primary w-full">
              Try Again
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentCallback;
