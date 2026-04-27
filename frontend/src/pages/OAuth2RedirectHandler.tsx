import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

export default function OAuth2RedirectHandler() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const login = useAuthStore((s) => s.login);

  const token = searchParams.get('token');
  const refreshToken = searchParams.get('refreshToken');

  const { data: userData, isError, isLoading } = useQuery({
    queryKey: ['me', token],
    queryFn: async () => {
      const response = await api.get('/api/v1/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    enabled: !!token,
  });

  useEffect(() => {
    if (token && refreshToken && userData) {
      login(token, refreshToken, userData);
      navigate('/dashboard');
    }
  }, [token, refreshToken, userData, login, navigate]);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-xl font-bold text-red-600 mb-2">Ошибка авторизации</h1>
        <p className="text-gray-600 mb-4">Не удалось получить данные пользователя.</p>
        <button onClick={() => navigate('/login')} className="btn-primary">
          Вернуться к входу
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <LoadingSpinner />
      <p className="mt-4 text-gray-500">Завершение авторизации...</p>
    </div>
  );
}
