import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { requestsApi } from '../../api/requests';
import { useAuthStore } from '../../store/authStore';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import StatusBadge from '../../components/StatusBadge';
import RequestTracker from '../../components/RequestTracker';
import { RequestStatus, PRIORITY_LABELS } from '../../types';
import { PlusCircle, Filter, Calendar } from 'lucide-react';

export default function MyRequestsPage() {
  const user = useAuthStore((s) => s.user);
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'ALL'>('ALL');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['my-requests', user?.id],
    queryFn: () => requestsApi.getByClient(user!.id, 0, 100),
    enabled: !!user,
  });

  const filtered =
    statusFilter === 'ALL'
      ? data?.content
      : data?.content.filter((r) => r.status === statusFilter);

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Мои заявки</h1>
        <Link to="/dashboard/new-request" className="btn-primary btn-sm">
          <PlusCircle className="w-4 h-4" />
          Новая заявка
        </Link>
      </div>

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

      {filtered && filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Заявок пока нет</p>
          <Link to="/dashboard/new-request" className="btn-primary btn-sm">
            Создать первую заявку
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {filtered?.map((req) => (
          <div key={req.id} className="card p-6">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {req.title}
                  </h3>
                  <StatusBadge status={req.status} />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                  {req.description}
                </p>
                <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(req.createdAt).toLocaleDateString('ru-RU')}
                  </span>
                  <span>Приоритет: {PRIORITY_LABELS[req.priority]}</span>
                  <span>Оборудование: {req.equipmentTypeName}</span>
                  {req.masterName && <span>Мастер: {req.masterName}</span>}
                  {req.estimatedCost && (
                    <span>Стоимость: {req.estimatedCost.toLocaleString('ru-RU')} ₽</span>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0">
                <RequestTracker status={req.status} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
