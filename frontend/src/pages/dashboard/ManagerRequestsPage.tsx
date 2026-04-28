import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestsApi } from '../../api/requests';
import { mastersApi } from '../../api/masters';
import { RequestStatus, PRIORITY_LABELS } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import StatusBadge from '../../components/StatusBadge';
import { Filter } from 'lucide-react';

export default function ManagerRequestsPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(0);

  const { data: requests, isLoading, error, refetch } = useQuery({
    queryKey: ['manager-requests', currentPage],
    queryFn: () => requestsApi.getAll(currentPage, 10, 'id,asc'),
  });

  const { data: masters } = useQuery({
    queryKey: ['available-masters'],
    queryFn: () => mastersApi.getAvailable(0, 100),
  });

  const assignMutation = useMutation({
    mutationFn: ({ reqId, masterId }: { reqId: number; masterId: number }) =>
      requestsApi.assignMaster(reqId, masterId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manager-requests'] });
    },
  });

  const filtered =
    statusFilter === 'ALL'
      ? requests?.content
      : requests?.content.filter((r) => r.status === statusFilter);
  const totalPages = requests?.totalPages ?? 1;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Все заявки</h1>

      {/* Filter */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
        {['ALL', ...Object.values(RequestStatus)].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s as RequestStatus | 'ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              statusFilter === s
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {s === 'ALL' ? 'Все' : ({
              NEW: 'Новые', ASSIGNED: 'Назначены', IN_PROGRESS: 'В работе',
              COMPLETED: 'Завершены', CANCELLED: 'Отменены',
            } as Record<string, string>)[s]}
          </button>
        ))}
      </div>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message="Не удалось загрузить заявки" onRetry={() => refetch()} />}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">ID / Клиент</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Проблема</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Статус</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Приоритет</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Мастер</th>
            </tr>
          </thead>
          <tbody>
            {filtered?.map((req) => (
              <tr key={req.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-900 dark:text-white">#{req.id}</div>
                  <div className="text-xs text-gray-500">{req.clientName}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-900 dark:text-white line-clamp-1">{req.title}</div>
                  <div className="text-xs text-gray-500 truncate max-w-xs">{req.address}</div>
                </td>
                <td className="py-3 px-4">
                  <StatusBadge status={req.status} />
                </td>
                <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                  {PRIORITY_LABELS[req.priority]}
                </td>
                <td className="py-3 px-4">
                  {req.masterName ? (
                    <span className="text-sm font-medium">{req.masterName}</span>
                  ) : req.status === RequestStatus.NEW ? (
                    <select
                      className="text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 p-1"
                      onChange={(e) => {
                        if (e.target.value) {
                          assignMutation.mutate({ reqId: req.id, masterId: Number(e.target.value) });
                        }
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>Назначить...</option>
                      {masters?.content.map(m => (
                        <option key={m.id} value={m.id}>{m.firstName} {m.lastName}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-gray-400 text-sm">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered && filtered.length === 0 && (
          <div className="text-center py-8 text-gray-500">Заявок не найдено</div>
        )}
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '16px', alignItems: 'center' }}>
          <button
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            style={{ padding: '6px 14px', cursor: currentPage === 0 ? 'not-allowed' : 'pointer' }}
          >
            ← Назад
          </button>
          <span>Страница {currentPage + 1} из {totalPages}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
            style={{ padding: '6px 14px', cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer' }}
          >
            Вперёд →
          </button>
        </div>
      )}
    </div>
  );
}
