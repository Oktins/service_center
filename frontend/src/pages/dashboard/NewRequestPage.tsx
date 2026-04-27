import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { requestsApi } from '../../api/requests';
import { servicesApi } from '../../api/services';
import { Priority } from '../../types';
import ErrorMessage from '../../components/ErrorMessage';
import { Send, FileText, MapPin } from 'lucide-react';

export default function NewRequestPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<{
    title: string;
    description: string;
    equipmentTypeId: number;
    address: string;
    priority: Priority;
  }>({
    title: '',
    description: '',
    equipmentTypeId: 1, // По-умолчанию пока 1
    address: '',
    priority: Priority.MEDIUM,
  });

  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: servicesApi.getAll,
  });

  const mutation = useMutation({
    mutationFn: requestsApi.create,
    onSuccess: () => {
      navigate('/dashboard/my-requests');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  const handleSelectService = (_id: number, name: string) => {
    setForm((f) => ({ ...f, title: name }));
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Новая заявка</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="card p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 pb-4">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Детали проблемы</h2>
          </div>

          <div>
            <label className="label">Краткая суть проблемы (или выберите услугу)</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input-field"
              placeholder="Например: Замена экрана"
              required
            />
            {services && services.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {services.slice(0, 8).map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelectService(s.id, s.name)}
                    className="px-3 py-1.5 text-xs rounded-full border border-gray-200 dark:border-gray-700 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 dark:hover:bg-primary-900/20 transition-colors text-gray-600 dark:text-gray-400"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="label">Подробное описание (опционально)</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-field min-h-[120px] resize-y"
              placeholder="Опишите, как проявляется неисправность, после чего она возникла..."
            />
          </div>
        </div>

        <div className="card p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 pb-4">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Адрес и условия</h2>
          </div>

          <div>
            <label className="label">Адрес для выезда мастера</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="input-field"
              placeholder="г. Москва, ул. Ленина, д. 1, кв. 2"
              required
            />
          </div>

          <div>
            <label className="label">Приоритет (влияет на стоимость выезда)</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { val: Priority.LOW, label: 'Низкий' },
                { val: Priority.MEDIUM, label: 'Средний' },
                { val: Priority.HIGH, label: 'Высокий' },
                { val: Priority.URGENT, label: 'Срочный' },
              ].map((p) => (
                <label
                  key={p.val}
                  className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    form.priority === p.val
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary-300'
                  }`}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    checked={form.priority === p.val}
                    onChange={() => setForm({ ...form, priority: p.val })}
                  />
                  <span className="text-sm font-medium">{p.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {mutation.isError && (
          <ErrorMessage message="Не удалось создать заявку. Пожалуйста, проверьте данные." />
        )}

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard/my-requests')}
            className="btn-secondary"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="btn-primary"
          >
            {mutation.isPending ? 'Отправка...' : (
              <>
                <Send className="w-5 h-5" />
                Отправить заявку
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
