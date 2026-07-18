import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Receipt } from 'lucide-react';

const History = () => {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data } = await api.get('/transactions');
      return data;
    }
  });

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Purchase History</h1>
        <p className="text-gray-500 mt-1">View all your past electricity purchases</p>
      </div>

      <div className="card-glass overflow-hidden">
        {isLoading ? (
          <div className="p-8 animate-pulse space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>)}
          </div>
        ) : transactions?.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Receipt className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-lg">No transactions found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">Meter No</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">Amount</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">Units</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">Token</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions?.map((tx: any) => (
                  <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(tx.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-brand-dark">
                      {tx.meter?.meter_number}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-brand-dark">
                      NGN {Number(tx.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      {tx.token?.units ? `${Number(tx.token.units).toFixed(2)} kWh` : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        tx.payment_status === 'successful' ? 'bg-green-100 text-green-700' :
                        tx.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {tx.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-700">
                      {tx.token?.token_value || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
