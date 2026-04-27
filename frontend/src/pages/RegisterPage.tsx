import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { authApi } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import { UserPlus, Eye, EyeOff, Wrench } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const mutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setErrorMessage('');
      try {
        login(data.accessToken, data.refreshToken, data.user);
        navigate('/dashboard');
      } catch (error) {
        console.error('Register success handler error:', error);
      }
    },
    onError: (error) => {
      console.error('Register error:', error);
      if (axios.isAxiosError<{ message?: string }>(error)) {
        setErrorMessage(
          error.response?.data?.message
            ?? error.message
            ?? 'Не удалось зарегистрироваться. Проверьте подключение и повторите попытку.'
        );
        return;
      }
      setErrorMessage('Не удалось зарегистрироваться. Проверьте подключение и повторите попытку.');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    mutation.mutate(form);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Wrench className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Регистрация</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Создайте аккаунт для подачи заявок
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="reg-firstName" className="label">Имя</label>
              <input
                id="reg-firstName"
                name="firstName"
                type="text"
                value={form.firstName}
                onChange={handleChange}
                className="input-field"
                placeholder="Иван"
                required
              />
            </div>
            <div>
              <label htmlFor="reg-lastName" className="label">Фамилия</label>
              <input
                id="reg-lastName"
                name="lastName"
                type="text"
                value={form.lastName}
                onChange={handleChange}
                className="input-field"
                placeholder="Иванов"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="reg-email" className="label">Email</label>
            <input
              id="reg-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="input-field"
              placeholder="example@mail.ru"
              required
            />
          </div>

          <div>
            <label htmlFor="reg-phone" className="label">Телефон</label>
            <input
              id="reg-phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              className="input-field"
              placeholder="+7 (999) 123-45-67"
            />
          </div>

          <div>
            <label htmlFor="reg-password" className="label">Пароль</label>
            <div className="relative">
              <input
                id="reg-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                className="input-field pr-12"
                placeholder="Минимум 6 символов"
                minLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-600 dark:text-red-400">
              {errorMessage}
            </div>
          )}

          <button type="submit" disabled={mutation.isPending} className="btn-primary w-full">
            {mutation.isPending ? 'Регистрация...' : (
              <>
                <UserPlus className="w-5 h-5" />
                Создать аккаунт
              </>
            )}
          </button>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Войти
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
