import type { ServiceCatalog } from '../types';
import { Settings } from 'lucide-react';

interface ServiceCardProps {
  service: ServiceCatalog;
  onClick?: () => void;
}

export default function ServiceCard({ service, onClick }: ServiceCardProps) {
  return (
    <div
      onClick={onClick}
      className={`card overflow-hidden flex flex-col transition-all ${
        onClick 
          ? 'cursor-pointer hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-lg dark:hover:border-primary-700' 
          : ''
      }`}
    >
      {service.imageUrl && (
        <img src={service.imageUrl} alt={service.name} className="h-40 w-full object-cover" />
      )}

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center text-primary-600">
            <Settings className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
            {service.category.name}
          </span>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {service.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {service.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <span className="text-lg font-bold text-primary-600">
            от {service.basePrice.toLocaleString('ru-RU')} ₽
          </span>
          {onClick && (
            <button type="button" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              Подробнее
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
