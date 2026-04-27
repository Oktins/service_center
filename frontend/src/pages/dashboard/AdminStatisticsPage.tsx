import { useQuery } from '@tanstack/react-query';
import { statisticsApi } from '../../api/statistics';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import StatCards from '../../components/statistics/StatCards';
import RequestsStatusChart from '../../components/statistics/RequestsStatusChart';
import CategoryPopularityChart from '../../components/statistics/CategoryPopularityChart';
import { TrendingUp, RefreshCcw } from 'lucide-react';

export default function AdminStatisticsPage() {
  const { data: stats, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['statistics'],
    queryFn: statisticsApi.get,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Ошибка загрузки статистики" onRetry={() => refetch()} />;
  if (!stats) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center shadow-sm">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Админ-панель</h1>
            <p className="text-gray-500 mt-1">Визуальный анализ и ключевые показатели сервисного центра</p>
          </div>
        </div>
        
        <button 
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
        >
          <RefreshCcw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          Обновить данные
        </button>
      </div>

      <StatCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RequestsStatusChart stats={stats} />
        <CategoryPopularityChart stats={stats} />
      </div>

      <div className="mt-8 bg-primary-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Генерация отчетов</h2>
          <p className="text-primary-100 mb-6 max-w-md">Выгрузите подробную статистику за любой период в формате PDF или Excel для детального анализа.</p>
          <button className="px-6 py-3 bg-white text-primary-600 font-bold rounded-xl hover:bg-primary-50 transition-colors shadow-lg">
            Скачать полный отчет
          </button>
        </div>
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-primary-700 rounded-full opacity-20 blur-2xl"></div>
      </div>
    </div>
  );
}
