import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sparePartsApi } from '../../api/spareParts';
import type { SparePartCreate } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { PackageSearch, Plus, X, AlertTriangle } from 'lucide-react';

export default function AdminSparePartsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'low'>('all');

  const [form, setForm] = useState<SparePartCreate>({
    name: '',
    article: '',
    description: '',
    quantity: 0,
    unit: 'шт',
    price: 0,
    minQuantity: 5,
  });

  const { data: allParts, isLoading: allLoading, error: allError } = useQuery({
    queryKey: ['spare-parts', 'all'],
    queryFn: () => sparePartsApi.getAll(0, 100),
  });

  const { data: lowParts, isLoading: lowLoading } = useQuery({
    queryKey: ['spare-parts', 'low'],
    queryFn: () => sparePartsApi.getLowStock(0, 100),
  });

  const createMutation = useMutation({
    mutationFn: sparePartsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spare-parts'] });
      setIsModalOpen(false);
    },
  });

  const addStockMutation = useMutation({
    mutationFn: ({ id, qty }: { id: number, qty: number }) => sparePartsApi.addStock(id, qty),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spare-parts'] });
    },
  });

  const handleOpenModal = () => {
    setForm({
      name: '',
      article: '',
      description: '',
      quantity: 0,
      unit: 'шт',
      price: 0,
      minQuantity: 5,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(form);
  };

  const currentData = activeTab === 'all' ? allParts : lowParts;
  const isLoading = activeTab === 'all' ? allLoading : lowLoading;

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 text-primary-600 rounded-xl flex items-center justify-center">
            <PackageSearch className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Склад запчастей</h1>
        </div>
        <button onClick={handleOpenModal} className="btn-primary btn-sm">
          <Plus className="w-4 h-4" /> Добавить новую
        </button>
      </div>

      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-3 font-medium text-sm transition-all border-b-2 ${
            activeTab === 'all' 
              ? 'border-primary-600 text-primary-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Все запчасти
        </button>
        <button
          onClick={() => setActiveTab('low')}
          className={`px-4 py-3 font-medium text-sm transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'low' 
              ? 'border-primary-600 text-primary-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Нужно докупить
          {(lowParts?.totalElements ?? 0) > 0 && (
            <span className="bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">
              {lowParts?.totalElements}
            </span>
          )}
        </button>
      </div>

      {isLoading && <LoadingSpinner />}
      {allError && <ErrorMessage message="Ошибка загрузки склада" />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {currentData?.content.map(part => (
          <div key={part.id} className={`card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 ${
            part.quantity <= part.minQuantity ? 'border-l-red-500' : 'border-l-primary-500'
          }`}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-900 dark:text-white">{part.name}</h3>
                {part.quantity <= part.minQuantity && (
                  <span title="Заканчивается"><AlertTriangle className="w-4 h-4 text-red-500" /></span>
                )}
              </div>
              <p className="text-sm text-gray-500">Артикул: {part.article || '—'}</p>
              <div className="mt-2 text-sm">
                <span className="font-semibold text-gray-900 dark:text-white">{part.price} ₽</span> / {part.unit}
              </div>
            </div>

            <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Остаток</div>
                <div className={`font-bold text-lg ${part.quantity <= part.minQuantity ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                  {part.quantity}
                </div>
              </div>
              <div className="w-px h-8 bg-gray-200 dark:bg-gray-600"></div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => {
                    const qty = prompt('Сколько единиц поступило на склад?');
                    if (qty && !isNaN(Number(qty)) && Number(qty) > 0) {
                      addStockMutation.mutate({ id: part.id, qty: Number(qty) });
                    }
                  }}
                  className="text-xs bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 px-3 py-1.5 rounded-md hover:bg-primary-200 transition-colors font-medium"
                >
                  Пополнить (+N)
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {currentData && currentData.content.length === 0 && (
        <div className="text-center py-12 text-gray-500">Список пуст</div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Новая запчасть</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Название *</label>
                  <input type="text" className="input-field" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div>
                  <label className="label">Артикул</label>
                  <input type="text" className="input-field" value={form.article} onChange={e => setForm({...form, article: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="label">Описание</label>
                <textarea className="input-field" rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Цена продажи (₽) *</label>
                  <input type="number" min="0" step="0.01" className="input-field" required value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="label">Ед. измерения</label>
                  <input type="text" className="input-field" required value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} placeholder="шт, м, кг" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Начальный остаток</label>
                  <input type="number" min="0" className="input-field" required value={form.quantity} onChange={e => setForm({...form, quantity: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="label">Мин. остаток (для уведомлений)</label>
                  <input type="number" min="0" className="input-field" required value={form.minQuantity} onChange={e => setForm({...form, minQuantity: Number(e.target.value)})} />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Отмена</button>
                <button type="submit" disabled={createMutation.isPending} className="btn-primary">
                  {createMutation.isPending ? 'Сохранение...' : 'Добавить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
