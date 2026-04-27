import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { servicesApi } from '../../api/services';
import type { ServiceCatalogCreate, Category, ServiceCatalog } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { Plus, Edit, Trash2, X } from 'lucide-react';

export default function ManagerServicesPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [form, setForm] = useState<ServiceCatalogCreate>({
    name: '',
    description: '',
    basePrice: 0,
    categoryId: 0,
    imageUrl: '',
    isActive: true,
  });

  const { data: services, isLoading: servicesLoading, error: servicesError } = useQuery({
    queryKey: ['services'],
    queryFn: servicesApi.getAll,
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: servicesApi.getCategories,
  });

  const createMutation = useMutation({
    mutationFn: servicesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      setIsModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: ServiceCatalogCreate }) => servicesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: servicesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });

  const handleOpenModal = (service?: ServiceCatalog) => {
    if (service) {
      setEditingId(service.id);
      setForm({
        name: service.name,
        description: service.description || '',
        basePrice: service.basePrice,
        categoryId: service.category.id,
        imageUrl: service.imageUrl || '',
        isActive: service.isActive,
      });
    } else {
      setEditingId(null);
      const firstCatId = categories && categories.length > 0 ? categories[0].id : 0;
      setForm({
        name: '',
        description: '',
        basePrice: 0,
        categoryId: firstCatId,
        imageUrl: '',
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Каталог услуг</h1>
        <button 
          onClick={() => handleOpenModal()} 
          disabled={categoriesLoading || !categories?.length}
          className="btn-primary btn-sm"
        >
          <Plus className="w-4 h-4" /> Добавить услугу
        </button>
      </div>

      {(servicesLoading || categoriesLoading) && <LoadingSpinner />}
      {servicesError && <ErrorMessage message="Ошибка загрузки каталога" />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services?.map(service => (
          <div key={service.id} className={`card p-6 flex flex-col ${!service.isActive && 'opacity-60'}`}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-primary-600 uppercase tracking-wide">
                {service.category.name}
              </span>
              <div className="flex gap-2">
                <button onClick={() => handleOpenModal(service)} className="text-gray-400 hover:text-blue-500">
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    if (window.confirm('Удалить эту услугу?')) {
                      deleteMutation.mutate(service.id);
                    }
                  }} 
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{service.name}</h3>
            <p className="text-sm text-gray-500 mb-4 flex-1">{service.description}</p>
            <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4 mt-auto">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {service.basePrice.toLocaleString('ru-RU')} ₽
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${service.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {service.isActive ? 'Активна' : 'Скрыта'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingId ? 'Редактировать услугу' : 'Новая услуга'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Название</label>
                <input type="text" className="input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div>
                <label className="label">Категория</label>
                <select 
                  className="input" 
                  value={form.categoryId} 
                  onChange={e => setForm({...form, categoryId: Number(e.target.value)})}
                  required
                >
                  <option value={0} disabled>Выберите категорию</option>
                  {categories?.map((c: Category) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Базовая цена (₽)</label>
                <input type="number" min="0" className="input" required value={form.basePrice} onChange={e => setForm({...form, basePrice: Number(e.target.value)})} />
              </div>
              <div>
                <label className="label">Описание</label>
                <textarea className="input" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} />
                <label htmlFor="isActive" className="text-sm font-medium">Активна (видна клиентам)</label>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Отмена</button>
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="btn-primary">
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
