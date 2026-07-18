import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { useState } from 'react';

const Tariffs = () => {
  const queryClient = useQueryClient();
  const [editingBand, setEditingBand] = useState<string | null>(null);
  const [editRate, setEditRate] = useState<string>('');

  const { data: tariffs, isLoading } = useQuery({
    queryKey: ['tariffs'],
    queryFn: async () => {
      const { data } = await api.get('/tariffs');
      return data;
    }
  });

  const mutation = useMutation({
    mutationFn: async ({ band, ratePerKwh }: { band: string, ratePerKwh: number }) => {
      await api.put(`/tariffs/${band}`, { ratePerKwh });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tariffs'] });
      setEditingBand(null);
    }
  });

  const handleEdit = (band: string, currentRate: number) => {
    setEditingBand(band);
    setEditRate(currentRate.toString());
  };

  const handleSave = (band: string) => {
    const rate = parseFloat(editRate);
    if (!isNaN(rate) && rate > 0) {
      mutation.mutate({ band, ratePerKwh: rate });
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tariff Management</h1>
        <p className="text-gray-500 mt-1">Configure rate per kWh for different tariff bands</p>
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
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">Band</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">Rate per kWh (NGN)</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tariffs?.map((tariff: any) => (
                  <tr key={tariff.band} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-brand-dark">
                      Band {tariff.band}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {editingBand === tariff.band ? (
                        <input
                          type="number"
                          value={editRate}
                          onChange={(e) => setEditRate(e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 w-24 outline-none focus:border-primary"
                        />
                      ) : (
                        <span className="font-medium text-lg text-primary">{Number(tariff.rate_per_kwh).toFixed(2)}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      {editingBand === tariff.band ? (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleSave(tariff.band)}
                            className="px-3 py-1 bg-primary text-white rounded text-xs font-bold hover:bg-primary-dark"
                            disabled={mutation.isPending}
                          >
                            Save
                          </button>
                          <button 
                            onClick={() => setEditingBand(null)}
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs font-bold hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleEdit(tariff.band, tariff.rate_per_kwh)}
                          className="text-primary hover:text-primary-dark font-medium"
                        >
                          Edit
                        </button>
                      )}
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

export default Tariffs;
