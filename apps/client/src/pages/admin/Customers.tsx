import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

const Customers = () => {
  const { data: customers, isLoading } = useQuery({
    queryKey: ['admin', 'customers'],
    queryFn: async () => {
      const { data } = await api.get('/admin/customers');
      return data;
    }
  });

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-500 mt-1">Manage registered customers and their meters</p>
      </div>

      <div className="card-glass overflow-hidden">
        {isLoading ? (
          <div className="p-8 animate-pulse space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">Name</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">Email</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">Phone</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">Meters Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers?.map((customer: any) => (
                  <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-brand-dark">
                      {customer.full_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {customer.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {customer.phone}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      {customer.meters?.length || 0}
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

export default Customers;
