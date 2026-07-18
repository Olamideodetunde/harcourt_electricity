import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { TrendingUp, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const { data: revenue } = useQuery({
    queryKey: ['admin', 'revenue'],
    queryFn: async () => {
      const { data } = await api.get('/admin/reports/revenue');
      return data;
    }
  });

  const { data: consumption } = useQuery({
    queryKey: ['admin', 'consumption'],
    queryFn: async () => {
      const { data } = await api.get('/admin/reports/consumption');
      return data;
    }
  });

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">System overview and analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card-glass p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-100 rounded-lg text-green-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
              <h3 className="text-2xl font-bold text-brand-dark">
                NGN {Number(revenue?.totalRevenue || 0).toLocaleString()}
              </h3>
            </div>
          </div>
          <p className="text-xs text-gray-500">From {revenue?.count || 0} successful transactions</p>
        </div>

        <div className="card-glass p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Consumption</p>
              <h3 className="text-2xl font-bold text-brand-dark">
                {Number(consumption?.totalUnits || 0).toLocaleString()} kWh
              </h3>
            </div>
          </div>
          <p className="text-xs text-gray-500">From {consumption?.count || 0} generated tokens</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
