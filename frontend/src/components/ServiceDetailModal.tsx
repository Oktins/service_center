import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ServiceCatalog } from '../types';

interface ServiceDetailModalProps {
  service: ServiceCatalog;
  onClose: () => void;
}

export default function ServiceDetailModal({ service, onClose }: ServiceDetailModalProps) {
  const navigate = useNavigate();

  const handleCreateRequest = () => {
    navigate('/dashboard/new-request', {
      state: {
        selectedServiceId: service.id,
        selectedServiceName: service.name,
      },
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl dark:bg-gray-800"
        onClick={(event) => event.stopPropagation()}
      >
        {service.imageUrl && (
          <img
            src={service.imageUrl}
            alt={service.name}
            className="h-64 w-full object-cover"
          />
        )}
        <div className="p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <span className="mb-2 inline-flex rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-900/20 dark:text-primary-300">
                {service.category.name}
              </span>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{service.name}</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
              aria-label="Закрыть"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="whitespace-pre-line text-sm leading-6 text-gray-600 dark:text-gray-300">
            {service.description}
          </p>

          <div className="mt-6 flex flex-col gap-4 border-t border-gray-100 pt-5 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs font-medium uppercase text-gray-500">Стоимость</div>
              <div className="text-2xl font-bold text-primary-600">
                от {service.basePrice.toLocaleString('ru-RU')} ₽
              </div>
            </div>
            <button type="button" onClick={handleCreateRequest} className="btn-primary">
              Оформить заявку
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
