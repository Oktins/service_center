import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { newsApi } from '../../api/news';
import type { NewsCreate } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { Plus, Edit, Trash2, X, Megaphone, Newspaper } from 'lucide-react';

export default function ManagerNewsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [form, setForm] = useState<NewsCreate>({
    title: '',
    content: '',
    imageUrl: '',
    isPromotion: false,
    expiresAt: null,
  });

  const { data: news, isLoading, error } = useQuery({
    queryKey: ['news-admin'],
    queryFn: newsApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: newsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news-admin'] });
      setIsModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: NewsCreate }) => newsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news-admin'] });
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: newsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news-admin'] });
    },
  });

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      setForm({
        title: item.title,
        content: item.content,
        imageUrl: item.imageUrl || '',
        isPromotion: item.isPromotion,
        expiresAt: item.expiresAt || null,
      });
    } else {
      setEditingId(null);
      setForm({
        title: '',
        content: '',
        imageUrl: '',
        isPromotion: false,
        expiresAt: null,
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Новости и акции</h1>
        <button onClick={() => handleOpenModal()} className="btn-primary btn-sm">
          <Plus className="w-4 h-4" /> Добавить
        </button>
      </div>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message="Ошибка загрузки новостей" />}

      <div className="space-y-4">
        {news?.map(item => (
          <div key={item.id} className="card p-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {item.isPromotion ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded">
                    <Megaphone className="w-3 h-3" /> Акция
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    <Newspaper className="w-3 h-3" /> Новость
                  </span>
                )}
                <span className="text-xs text-gray-400">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{item.content}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleOpenModal(item)} className="p-2 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-gray-100">
                <Edit className="w-4 h-4" />
              </button>
              <button 
                onClick={() => {
                  if (window.confirm('Удалить запись?')) deleteMutation.mutate(item.id);
                }} 
                className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
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
                {editingId ? 'Редактировать запись' : 'Новая запись'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Заголовок</label>
                <input type="text" className="input-field" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>
              <div>
                <label className="label">Текст</label>
                <textarea className="input-field" rows={5} required value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isPromo" checked={form.isPromotion} onChange={e => setForm({...form, isPromotion: e.target.checked})} />
                <label htmlFor="isPromo" className="text-sm font-medium">Это акция</label>
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
