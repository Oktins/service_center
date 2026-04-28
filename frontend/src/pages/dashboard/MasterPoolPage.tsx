import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestsApi } from '../../api/requests';
import { useAuthStore } from '../../store/authStore';
import { RequestStatus, PRIORITY_LABELS } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import StatusBadge from '../../components/StatusBadge';
import { UserCheck, MapPin, Calendar, Wrench } from 'lucide-react';

export default function MasterPoolPage() {
  const user = useAuthStore(s => s.user);
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['requests-pool'],
    queryFn: () => requestsApi.getByStatus(RequestStatus.NEW, 0, 100),
  });

  const assignMutation = useMutation({
    mutationFn: (requestId: number) => requestsApi.assignMaster(requestId, user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests-pool'] });
      queryClient.invalidateQueries({ queryKey: ['my-active-requests'] });
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Пул заявок</h1>
          <p className="text-gray-500 dark:text-gray-400">Доступные новые заявки, ожидающие мастера</p>
        </div>
      </div>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message="Не удалось загрузить пул заявок" onRetry={() => refetch()} />}

      {data && data.content.length === 0 && (
        <div className="card p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Wrench className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Нет новых заявок</h3>
          <p className="text-gray-500 dark:text-gray-400">Сейчас все заявки распределены. Отдохните!</p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {data?.content.map((req) => (
          <div key={req.id} className="card p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {req.title}
                </h3>
                <StatusBadge status={req.status} />
              </div>
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide
                ${req.priority === 'URGENT' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                  req.priority === 'HIGH' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 
                  'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}
              `}>
                {PRIORITY_LABELS[req.priority]}
              </span>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-1 line-clamp-3">
              {req.description || 'Описание отсутствует'}
            </p>

            <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-6 border-t border-gray-100 dark:border-gray-700 pt-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0 text-primary-500" />
                <span className="truncate" title={req.address}>{req.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 flex-shrink-0 text-primary-500" />
                <span>{new Date(req.createdAt).toLocaleString('ru-BY')}</span>
              </div>
            </div>

            <button
              onClick={() => assignMutation.mutate(req.id)}
              disabled={assignMutation.isPending}
              className="btn-primary w-full"
            >
              <UserCheck className="w-5 h-5" />
              Принять в работу
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
