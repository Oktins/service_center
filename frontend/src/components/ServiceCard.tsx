import { ServiceCategory, CATEGORY_LABELS } from '../types';
import type { ServiceCatalog } from '../types';
import { Smartphone, Watch, Laptop, Tablet, HelpCircle } from 'lucide-react';

interface ServiceCardProps {
  service: ServiceCatalog;
  onClick?: () => void;
}

const CATEGORY_ICONS: Record<ServiceCategory, React.ReactNode> = {
  [ServiceCategory.SMARTPHONE]: <Smartphone className="w-6 h-6" />,
  [ServiceCategory.WATCH]: <Watch className="w-6 h-6" />,
  [ServiceCategory.LAPTOP]: <Laptop className="w-6 h-6" />,
  [ServiceCategory.TABLET]: <Tablet className="w-6 h-6" />,
  [ServiceCategory.OTHER]: <HelpCircle className="w-6 h-6" />,
};

export default function ServiceCard({ service, onClick }: ServiceCardProps) {
  return (
    <div
      onClick={onClick}
      className={`card p-6 flex flex-col gap-4 ${onClick ? 'cursor-pointer hover:border-primary-300 dark:hover:border-primary-700' : ''}`}
    >
      <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center text-primary-600">
        {CATEGORY_ICONS[service.category]}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {service.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
          {service.description}
        </p>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
        <span className="text-xs text-gray-400 uppercase tracking-wider">
          {CATEGORY_LABELS[service.category]}
        </span>
        <span className="text-lg font-bold text-primary-600">
          от {service.basePrice.toLocaleString('ru-RU')} ₽
        </span>
      </div>
    </div>
  );
}
