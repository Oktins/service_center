import { useQuery } from '@tanstack/react-query';
import { statisticsApi } from '../../api/statistics';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Activity, CheckCircle, Package, Users, AlertCircle, TrendingUp } from 'lucide-react';

export default function AdminStatisticsPage() {
  const { data: stats, isLoading, error, refetch } = useQuery({
    queryKey: ['statistics'],
    queryFn: statisticsApi.get,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Ошибка загрузки статистики" onRetry={() => refetch()} />;
  if (!stats) return null;

  const pieData = [
    { name: 'Новые', value: stats.newRequests, color: '#3b82f6' }, // blue-500
    { name: 'Назначены', value: stats.assignedRequests, color: '#eab308' }, // yellow-500
    { name: 'В работе', value: stats.inProgressRequests, color: '#a855f7' }, // purple-500
    { name: 'Завершены', value: stats.completedRequests, color: '#22c55e' }, // green-500
    { name: 'Отменены', value: stats.cancelledRequests, color: '#ef4444' }, // red-500
  ].filter(d => d.value > 0);

  const barData = [
    { name: 'Новые', count: stats.newRequests },
    { name: 'Назначены', count: stats.assignedRequests },
    { name: 'В работе', count: stats.inProgressRequests },
    { name: 'Завершены', count: stats.completedRequests },
    { name: 'Отменены', count: stats.cancelledRequests },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 text-primary-600 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-5 h-5" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Статистика и отчеты</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 flex items-center gap-4 border-l-4 border-l-primary-500">
          <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/10 rounded-full flex items-center justify-center text-primary-600">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Всего заявок</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalRequests}</p>
          </div>
        </div>

        <div className="card p-6 flex items-center gap-4 border-l-4 border-l-green-500">
          <div className="w-12 h-12 bg-green-50 dark:bg-green-900/10 rounded-full flex items-center justify-center text-green-600">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Выполнено</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedRequests}</p>
          </div>
        </div>

        <div className="card p-6 flex items-center gap-4 border-l-4 border-l-purple-500">
          <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/10 rounded-full flex items-center justify-center text-purple-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Мастеров доступно</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.availableMasters}</p>
          </div>
        </div>

        <div className="card p-6 flex items-center gap-4 border-l-4 border-l-blue-500">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/10 rounded-full flex items-center justify-center text-blue-600">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Видов запчастей</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSpareParts}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Воронка заявок</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Распределение статусов</h2>
          {pieData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex flex-col items-center justify-center text-gray-500">
              <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
              <p>Нет данных для отображения</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
