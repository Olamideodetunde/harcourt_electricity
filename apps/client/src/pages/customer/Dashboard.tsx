import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Zap, Activity, Clock, PlusCircle, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const queryClient = useQueryClient();
  const [showAddMeter, setShowAddMeter] = useState(false);
  const [meterNumber, setMeterNumber] = useState('');
  const [tariffBand, setTariffBand] = useState('A');
  const [error, setError] = useState('');
  const { data: meters, isLoading: metersLoading } = useQuery({
    queryKey: ['meters'],
    queryFn: async () => {
      const { data } = await api.get('/me/meters');
      return data;
    }
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions', 'recent'],
    queryFn: async () => {
      const { data } = await api.get('/transactions');
      return data.slice(0, 3); // Just latest 3
    }
  });

  const addMeterMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/meters', {
        meterNumber,
        tariffBand
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meters'] });
      setShowAddMeter(false);
      setMeterNumber('');
      setTariffBand('A');
      setError('');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to add meter');
    }
  });

  const handleAddMeter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meterNumber || !tariffBand) return;
    addMeterMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your meters and view recent activity</p>
        </div>
        <Link to="/customer/purchase" className="btn-primary flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Buy Electricity
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Meters Section */}
        <div className="card-glass p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Activity className="text-primary w-6 h-6" />
              My Meters
            </h2>
            <button 
              onClick={() => setShowAddMeter(true)}
              className="text-sm text-primary font-medium flex items-center gap-1 hover:text-primary-dark transition-colors"
            >
              <PlusCircle className="w-4 h-4" /> Add Meter
            </button>
          </div>

          {metersLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-20 bg-gray-200 rounded-xl w-full"></div>
            </div>
          ) : meters?.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p>No meters registered yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {meters?.map((meter: any) => (
                <div key={meter.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow bg-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">Meter Number</p>
                      <p className="font-bold text-lg text-brand-dark">{meter.meter_number}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Tariff Band</p>
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                        Band {meter.tariff_band}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-end">
                    <div>
                      <p className="text-sm text-gray-500">Units Bought</p>
                      <p className="text-2xl font-bold text-primary">{Number(meter.units_balance).toFixed(2)} <span className="text-sm font-normal text-gray-500">kWh</span></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Transactions Section */}
        <div className="card-glass p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock className="text-accent w-6 h-6" />
              Recent Purchases
            </h2>
            <Link to="/customer/history" className="text-sm text-primary font-medium hover:underline">
              View All
            </Link>
          </div>

          {transactionsLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-16 bg-gray-200 rounded-xl w-full"></div>
              <div className="h-16 bg-gray-200 rounded-xl w-full"></div>
            </div>
          ) : transactions?.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p>No transactions found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions?.map((tx: any) => (
                <div key={tx.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-bold text-brand-dark">NGN {Number(tx.amount).toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{new Date(tx.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                      tx.payment_status === 'successful' ? 'bg-green-100 text-green-700' :
                      tx.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {tx.payment_status}
                    </span>
                    {tx.token && (
                      <p className="text-xs text-gray-600 mt-1 font-mono">{tx.token.token_value.substring(0,9)}...</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Meter Modal */}
      {showAddMeter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Add New Meter</h3>
              <button 
                onClick={() => setShowAddMeter(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddMeter} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meter Number</label>
                <input
                  type="text"
                  required
                  value={meterNumber}
                  onChange={(e) => setMeterNumber(e.target.value)}
                  className="input-field"
                  placeholder="e.g. 04040404040"
                  pattern="[0-9]{10,20}"
                  title="Meter number must be 10-20 digits"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tariff Band</label>
                <select
                  required
                  value={tariffBand}
                  onChange={(e) => setTariffBand(e.target.value)}
                  className="input-field"
                >
                  <option value="A">Band A (₦225/kWh)</option>
                  <option value="B">Band B (₦63/kWh)</option>
                  <option value="C">Band C (₦50/kWh)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddMeter(false)}
                  className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addMeterMutation.isPending}
                  className="btn-primary flex items-center gap-2"
                >
                  {addMeterMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Add Meter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
