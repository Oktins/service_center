import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { servicesApi } from '../api/services';
import ServiceCard from '../components/ServiceCard';
import ServiceDetailModal from '../components/ServiceDetailModal';
import CategoryAccordion from '../components/CategoryAccordion';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Search } from 'lucide-react';
import type { ServiceCatalog } from '../types';

export default function ServicesPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<ServiceCatalog | null>(null);

  const { data: services, isLoading: isLoadingServices, error: errorServices, refetch: refetchServices } = useQuery({
    queryKey: ['services'],
    queryFn: servicesApi.getAll,
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: servicesApi.getCategories,
  });

  const filtered = services?.filter((s) => {
    const matchesCategory = selectedCategoryId === 'ALL' || s.category.id === selectedCategoryId;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="section-title">Каталог услуг</h1>
        <p className="section-subtitle">Профессиональный ремонт и обслуживание вашей техники</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Категории</h2>
            {isLoadingCategories ? (
              <div className="animate-pulse space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-10 bg-gray-100 dark:bg-gray-800 rounded-lg" />
                ))}
              </div>
            ) : (
              <CategoryAccordion
                categories={categories || []}
                selectedCategoryId={selectedCategoryId}
                onSelect={setSelectedCategoryId}
              />
            )}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск по названию или описанию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>

          {isLoadingServices && <LoadingSpinner />}
          {errorServices && (
            <ErrorMessage 
              message="Не удалось загрузить услуги" 
              onRetry={() => refetchServices()} 
            />
          )}

          {filtered && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((service) => (
                <ServiceCard key={service.id} service={service} onClick={() => setSelectedService(service)} />
              ))}
            </div>
          )}

          {filtered && filtered.length === 0 && (
            <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl">
              <p className="text-gray-500 dark:text-gray-400">
                По вашему запросу услуг не найдено
              </p>
              <button
                onClick={() => {
                  setSelectedCategoryId('ALL');
                  setSearchQuery('');
                }}
                className="mt-4 text-primary-600 font-medium hover:underline"
              >
                Сбросить фильтры
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedService && (
        <ServiceDetailModal service={selectedService} onClose={() => setSelectedService(null)} />
      )}
    </div>
  );
}
