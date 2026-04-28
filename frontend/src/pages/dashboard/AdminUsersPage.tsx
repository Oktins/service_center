import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../../api/users';
import { Role, ROLE_LABELS } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { Users, Shield, UserCog, User, Wrench, Plus, X } from 'lucide-react';

const ROLE_ICONS: Record<Role, React.ReactNode> = {
  [Role.ADMIN]: <Shield className="w-4 h-4" />,
  [Role.MANAGER]: <UserCog className="w-4 h-4" />,
  [Role.MASTER]: <Wrench className="w-4 h-4" />,
  [Role.CLIENT]: <User className="w-4 h-4" />,
};

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: Role.CLIENT as Role,
  });

  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ['users-admin', currentPage],
    queryFn: () => usersApi.getAll(currentPage, 10, 'id,asc'),
  });
  const totalPages = users?.totalPages ?? 1;

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: number, role: Role }) => usersApi.updateRole(id, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-admin'] });
    },
  });

  const createMutation = useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-admin'] });
      setIsModalOpen(false);
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: Role.CLIENT,
      });
    },
  });

  const handleCreateUser = (event: React.FormEvent) => {
    event.preventDefault();
    createMutation.mutate(form);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 text-primary-600 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Пользователи</h1>
        </div>
        <button type="button" onClick={() => setIsModalOpen(true)} className="btn-primary btn-sm">
          <Plus className="w-4 h-4" /> Добавить пользователя
        </button>
      </div>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message="Ошибка загрузки пользователей" onRetry={() => refetch()} />}

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <th className="py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Пользователь</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Email / Телефон</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Дата регистрации</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Роль</th>
            </tr>
          </thead>
          <tbody>
            {users?.content.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-900 dark:text-white">{user.firstName} {user.lastName}</div>
                  <div className="text-xs text-gray-500">ID: {user.id}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm text-gray-900 dark:text-white">{user.email}</div>
                  <div className="text-xs text-gray-500">{user.phone || 'Нет телефона'}</div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                  {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">{ROLE_ICONS[user.role]}</span>
                    <select
                      className="text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 p-1 font-medium"
                      value={user.role}
                      onChange={(e) => {
                        if (window.confirm(`Изменить роль пользователя на ${ROLE_LABELS[e.target.value as Role]}?`)) {
                          roleMutation.mutate({ id: user.id, role: e.target.value as Role });
                        }
                      }}
                      disabled={roleMutation.isPending}
                    >
                      {Object.values(Role).map(r => (
                        <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                      ))}
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users && users.content.length === 0 && (
          <div className="text-center py-8 text-gray-500">Пользователей не найдено</div>
        )}
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
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Новый пользователь</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="space-y-4">
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
                <input type="text" minLength={6} className="input" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
              </div>
              <div>
                <label className="label">Роль</label>
                <select className="input" value={form.role} onChange={e => setForm({...form, role: e.target.value as Role})}>
                  {Object.values(Role).map(role => (
                    <option key={role} value={role}>{ROLE_LABELS[role]}</option>
                  ))}
                </select>
              </div>
              {createMutation.isError && (
                <ErrorMessage message="Не удалось создать пользователя. Возможно, email уже используется." />
              )}
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Отмена</button>
                <button type="submit" disabled={createMutation.isPending} className="btn-primary">
                  {createMutation.isPending ? 'Создание...' : 'Создать'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
