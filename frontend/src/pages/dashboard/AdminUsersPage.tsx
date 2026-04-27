import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../../api/users';
import { Role, ROLE_LABELS } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { Users, Shield, UserCog, User, Wrench } from 'lucide-react';

const ROLE_ICONS: Record<Role, React.ReactNode> = {
  [Role.ADMIN]: <Shield className="w-4 h-4" />,
  [Role.MANAGER]: <UserCog className="w-4 h-4" />,
  [Role.MASTER]: <Wrench className="w-4 h-4" />,
  [Role.CLIENT]: <User className="w-4 h-4" />,
};

export default function AdminUsersPage() {
  const queryClient = useQueryClient();

  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ['users-admin'],
    queryFn: () => usersApi.getAll(0, 100),
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: number, role: Role }) => usersApi.updateRole(id, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-admin'] });
    },
  });

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 text-primary-600 rounded-xl flex items-center justify-center">
          <Users className="w-5 h-5" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Пользователи</h1>
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
    </div>
  );
}
