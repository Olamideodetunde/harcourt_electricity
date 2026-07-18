import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { CreditCard, Loader2 } from 'lucide-react';

const Purchase = () => {
  const [meterId, setMeterId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { data: meters, isLoading } = useQuery({
    queryKey: ['meters'],
    queryFn: async () => {
      const { data } = await api.get('/me/meters');
      return data;
    }
  });

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meterId || !amount) return;
    
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/transactions', {
        meterId,
        amount: Number(amount)
      });
      
      // Redirect to Paystack checkout
      window.location.href = response.data.authorizationUrl;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to initiate transaction.');
      setLoading(false);
    }
  };

  if (isLoading) return <div className="animate-pulse h-64 bg-gray-100 rounded-xl"></div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Buy Electricity</h1>
        <p className="text-gray-500 mt-2">Purchase token for your registered meters securely.</p>
      </div>

      <div className="card-glass p-8">
        <form onSubmit={handlePurchase} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Meter</label>
            {meters?.length === 0 ? (
              <p className="text-sm text-red-500">No meters registered. Please add a meter first.</p>
            ) : (
              <select 
                required
                value={meterId}
                onChange={(e) => setMeterId(e.target.value)}
                className="input-field"
              >
                <option value="" disabled>Select a meter...</option>
                {meters?.map((meter: any) => (
                  <option key={meter.id} value={meter.id}>
                    {meter.meter_number} (Band {meter.tariff_band})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (NGN)</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 font-bold text-gray-500">₦</span>
              <input
                type="number"
                required
                min="500"
                step="100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field pl-10"
                placeholder="5000"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Minimum purchase amount is ₦500</p>
          </div>

          <button
            type="submit"
            disabled={loading || meters?.length === 0}
            className="w-full btn-primary flex justify-center items-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CreditCard className="w-5 h-5" /> Proceed to Payment</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Purchase;
