import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { servicesApi } from '../api/services';
import ServiceCard from '../components/ServiceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { ServiceCategory, CATEGORY_LABELS } from '../types';

export default function ServicesPage() {
  const [category, setCategory] = useState<ServiceCategory | 'ALL'>('ALL');

  const { data: allServices, isLoading, error, refetch } = useQuery({
    queryKey: ['services'],
    queryFn: servicesApi.getAll,
  });

  const filtered =
    category === 'ALL'
      ? allServices
      : allServices?.filter((s) => s.category === category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="section-title">Каталог услуг</h1>
      <p className="section-subtitle mb-8">Выберите категорию для фильтрации</p>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setCategory('ALL')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            category === 'ALL'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Все
        </button>
        {Object.values(ServiceCategory).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              category === cat
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message="Не удалось загрузить услуги" onRetry={() => refetch()} />}
      {filtered && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
      {filtered && filtered.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 py-12">
          В этой категории пока нет услуг
        </p>
      )}
    </div>
  );
}
