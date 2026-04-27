import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { usersApi } from '../api/users';
import LoadingSpinner from '../components/LoadingSpinner';

export default function OAuth2RedirectHandler() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const token = searchParams.get('token');
  const refreshToken = searchParams.get('refreshToken');
  const missingTokenError = !token || !refreshToken
    ? 'Отсутствуют токен или refresh-токен в URL'
    : null;

  useEffect(() => {
    if (missingTokenError) {
      return;
    }

    let isMounted = true;

    const fetchUserAndLogin = async () => {
      try {
        const user = await usersApi.getCurrentUser(token);
        setAuth(token, refreshToken, user);
        navigate('/dashboard', { replace: true });
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        if (isMounted) {
          setError('Не удалось получить данные профиля пользователя');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUserAndLogin();

    return () => {
      isMounted = false;
    };
  }, [token, refreshToken, missingTokenError, setAuth, navigate]);

  const visibleError = missingTokenError ?? error;

  if (visibleError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-red-100">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Ошибка авторизации</h1>
          <p className="text-gray-600 mb-8">{visibleError}</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Вернуться к входу
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600 font-medium animate-pulse">
          Завершение авторизации, пожалуйста, подождите...
        </p>
      </div>
    );
  }

  return null;
}
