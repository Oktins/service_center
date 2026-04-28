import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mastersApi } from '../../api/masters';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { Star, CheckCircle, XCircle } from 'lucide-react';

export default function ManagerMastersPage() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(0);

  const { data: masters, isLoading, error } = useQuery({
    queryKey: ['masters-admin', currentPage],
    queryFn: () => mastersApi.getAll(currentPage, 10, 'id,asc'),
  });
  const totalPages = masters?.totalPages ?? 1;

  const toggleAvailability = useMutation({
    mutationFn: ({ id, isAvailable }: { id: number, isAvailable: boolean }) => 
      mastersApi.updateAvailability(id, isAvailable),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['masters-admin'] });
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Управление мастерами</h1>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message="Ошибка загрузки списка мастеров" />}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {masters?.content.map((master) => (
          <div key={master.id} className="card p-6 flex flex-col">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center text-primary-600 flex-shrink-0">
                <span className="text-lg font-bold">
                  {master.firstName[0]}{master.lastName[0]}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {master.firstName} {master.lastName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{master.specialization}</p>
                <div className="flex items-center gap-1 mt-1 text-sm text-gray-600 dark:text-gray-300">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  {master.rating?.toFixed(1) || '—'}
                  <span className="mx-2 text-gray-300">|</span>
                  Опыт: {master.experienceYears} лет
                </div>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Статус:</span>
              <button
                onClick={() => toggleAvailability.mutate({ id: master.id, isAvailable: !master.isAvailable })}
                disabled={toggleAvailability.isPending}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  master.isAvailable
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                {master.isAvailable ? (
                  <><CheckCircle className="w-4 h-4" /> Доступен (На работе)</>
                ) : (
                  <><XCircle className="w-4 h-4" /> Недоступен (Отпуск/Болен)</>
                )}
              </button>
            </div>
          </div>
        ))}
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
