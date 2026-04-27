import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestsApi } from '../../api/requests';
import { sparePartsApi, sparePartUsageApi } from '../../api/spareParts';
import { useAuthStore } from '../../store/authStore';
import { RequestStatus, PRIORITY_LABELS } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import StatusBadge from '../../components/StatusBadge';
import { CheckCircle2, Play, PackagePlus, X } from 'lucide-react';

export default function MasterActivePage() {
  const user = useAuthStore(s => s.user);
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState<number | null>(null);

  const { data: requests, isLoading: reqLoading, error: reqError, refetch } = useQuery({
    queryKey: ['my-active-requests', user?.id],
    queryFn: () => requestsApi.getByMaster(user!.id, 0, 100),
    enabled: !!user,
  });

  const { data: spareParts } = useQuery({
    queryKey: ['spare-parts'],
    queryFn: () => sparePartsApi.getAll(0, 1000),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number, status: RequestStatus }) => 
      requestsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-active-requests', user?.id] });
    },
  });

  const usageMutation = useMutation({
    mutationFn: ({ reqId, partId, qty }: { reqId: number, partId: number, qty: number }) =>
      sparePartUsageApi.useForRequest(reqId, { sparePartId: partId, quantity: qty }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spare-parts'] });
      alert('Запчасть успешно добавлена к заявке!');
      setSelectedRequest(null);
    },
    onError: () => {
      alert('Ошибка при списании запчасти (возможно, недостаточно на складе)');
    }
  });

  const activeReqs = requests?.content.filter(r => r.status === RequestStatus.ASSIGNED || r.status === RequestStatus.IN_PROGRESS);

  const AddPartModal = ({ reqId }: { reqId: number }) => {
    const [partId, setPartId] = useState<number>(0);
    const [qty, setQty] = useState(1);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (partId && qty > 0) {
        usageMutation.mutate({ reqId, partId, qty });
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 animate-slide-up">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Добавить запчасть</h3>
            <button onClick={() => setSelectedRequest(null)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Выберите запчасть</label>
              <select
                className="input-field"
                value={partId}
                onChange={e => setPartId(Number(e.target.value))}
                required
              >
                <option value={0} disabled>-- Выберите из списка --</option>
                {spareParts?.content.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Остаток: {p.quantity} {p.unit}) - {p.price} ₽
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="label">Количество</label>
              <input
                type="number"
                min="1"
                className="input-field"
                value={qty}
                onChange={e => setQty(Number(e.target.value))}
                required
              />
            </div>

            <button type="submit" disabled={usageMutation.isPending} className="btn-primary w-full mt-4">
              {usageMutation.isPending ? 'Добавление...' : 'Списать со склада'}
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Активные заявки</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Заявки, над которыми вы сейчас работаете</p>

      {reqLoading && <LoadingSpinner />}
      {reqError && <ErrorMessage message="Ошибка загрузки" onRetry={() => refetch()} />}

      {activeReqs && activeReqs.length === 0 && (
        <div className="card p-12 text-center text-gray-500">
          У вас сейчас нет активных заявок. Загляните в Пул заявок!
        </div>
      )}

      <div className="space-y-6">
        {activeReqs?.map(req => (
          <div key={req.id} className="card p-6 border-l-4 border-l-primary-500">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{req.title}</h3>
                  <StatusBadge status={req.status} />
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{req.description}</p>
                <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                  <p><span className="font-medium">Адрес:</span> {req.address}</p>
                  <p><span className="font-medium">Клиент:</span> {req.clientName}</p>
                  <p><span className="font-medium">Приоритет:</span> {PRIORITY_LABELS[req.priority]}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 min-w-[200px]">
                {req.status === RequestStatus.ASSIGNED && (
                  <button
                    onClick={() => statusMutation.mutate({ id: req.id, status: RequestStatus.IN_PROGRESS })}
                    disabled={statusMutation.isPending}
                    className="btn-primary"
                  >
                    <Play className="w-4 h-4" /> Начать работу
                  </button>
                )}

                {req.status === RequestStatus.IN_PROGRESS && (
                  <>
                    <button
                      onClick={() => setSelectedRequest(req.id)}
                      className="btn-secondary"
                    >
                      <PackagePlus className="w-4 h-4" /> Добавить запчасти
                    </button>
                    <button
                      onClick={() => statusMutation.mutate({ id: req.id, status: RequestStatus.COMPLETED })}
                      disabled={statusMutation.isPending}
                      className="btn-primary bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Завершить работу
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedRequest && <AddPartModal reqId={selectedRequest} />}
    </div>
  );
}
