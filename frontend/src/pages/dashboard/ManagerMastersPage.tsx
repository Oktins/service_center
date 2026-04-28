import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mastersApi } from '../../api/masters';
import { usersApi } from '../../api/users';
import { Role } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { Star, CheckCircle, XCircle, Plus, X } from 'lucide-react';

const SPECIALIZATIONS = [
  'Смартфоны и планшеты',
  'Ноутбуки и ПК',
  'Принтеры и МФУ',
  'Игровые консоли',
  'Бытовая техника',
];

export default function ManagerMastersPage() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: 'master123',
    specialization: SPECIALIZATIONS[0],
    experienceYears: 1,
  });

  const { data: masters, isLoading, error } = useQuery({
    queryKey: ['masters-admin', currentPage],
    queryFn: () => mastersApi.getAll(currentPage, 10, 'id,asc'),
  });
  const totalPages = masters?.totalPages ?? 1;

  const toggleAvailability = useMutation({
    mutationFn: ({ id, isAvailable }: { id: number, isAvailable: boolean }) => 
      mastersApi.updateAvailability(id, isAvailable),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['masters-admin'] });
    },
  });

  const createMasterMutation = useMutation({
    mutationFn: async () => {
      const user = await usersApi.create({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        role: Role.MASTER,
      });

      return mastersApi.createProfile({
        userId: user.id,
        specialization: form.specialization,
        experienceYears: form.experienceYears,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['masters-admin'] });
      setIsModalOpen(false);
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        password: 'master123',
        specialization: SPECIALIZATIONS[0],
        experienceYears: 1,
      });
    },
  });

  const handleCreateMaster = (event: React.FormEvent) => {
    event.preventDefault();
    createMasterMutation.mutate();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Управление мастерами</h1>
        <button type="button" onClick={() => setIsModalOpen(true)} className="btn-primary btn-sm">
          <Plus className="w-4 h-4" /> Добавить мастера
        </button>
      </div>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message="Ошибка загрузки списка мастеров" />}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {masters?.content.map((master) => (
          <div key={master.id} className="card p-6 flex flex-col">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center text-primary-600 flex-shrink-0">
                <span className="text-lg font-bold">
                  {master.firstName[0]}{master.lastName[0]}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {master.firstName} {master.lastName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{master.specialization}</p>
                <div className="flex items-center gap-1 mt-1 text-sm text-gray-600 dark:text-gray-300">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  {master.rating?.toFixed(1) || '—'}
                  <span className="mx-2 text-gray-300">|</span>
                  Опыт: {master.experienceYears} лет
                </div>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Статус:</span>
              <button
                onClick={() => toggleAvailability.mutate({ id: master.id, isAvailable: !master.isAvailable })}
                disabled={toggleAvailability.isPending}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  master.isAvailable
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                {master.isAvailable ? (
                  <><CheckCircle className="w-4 h-4" /> Доступен (На работе)</>
                ) : (
                  <><XCircle className="w-4 h-4" /> Недоступен (Отпуск/Болен)</>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '16px', alignItems: 'center' }}>
          <button
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            style={{ padding: '6px 14px', cursor: currentPage === 0 ? 'not-allowed' : 'pointer' }}
          >
            ← Назад
          </button>
          <span>Страница {currentPage + 1} из {totalPages}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
            style={{ padding: '6px 14px', cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer' }}
          >
            Вперёд →
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Новый мастер</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateMaster} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Имя</label>
                  <input className="input" required value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
                </div>
                <div>
                  <label className="label">Фамилия</label>
                  <input className="input" required value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" className="input" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              <div>
                <label className="label">Пароль</label>
                <input type="text" className="input" required minLength={6} value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
              </div>
              <div>
                <label className="label">Специализация</label>
                <select className="input" value={form.specialization} onChange={e => setForm({...form, specialization: e.target.value})}>
                  {SPECIALIZATIONS.map(specialization => (
                    <option key={specialization} value={specialization}>{specialization}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Опыт, лет</label>
                <input
                  type="number"
                  min={0}
                  className="input"
                  required
                  value={form.experienceYears}
                  onChange={e => setForm({...form, experienceYears: Number(e.target.value)})}
                />
              </div>
              {createMasterMutation.isError && (
                <ErrorMessage message="Не удалось создать мастера. Проверьте email и права доступа." />
              )}
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Отмена</button>
                <button type="submit" disabled={createMasterMutation.isPending} className="btn-primary">
                  {createMasterMutation.isPending ? 'Создание...' : 'Создать'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
