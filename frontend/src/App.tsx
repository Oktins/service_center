import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Role } from './types';

import Header from './components/Header';
import Footer from './components/Footer';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NewsPage from './pages/NewsPage';
import FaqPage from './pages/FaqPage';
import ContactsPage from './pages/ContactsPage';
import OAuth2RedirectHandler from './pages/OAuth2RedirectHandler';

import DashboardRedirect from './pages/dashboard/DashboardRedirect';
import MyRequestsPage from './pages/dashboard/MyRequestsPage';
import NewRequestPage from './pages/dashboard/NewRequestPage';
import MasterPoolPage from './pages/dashboard/MasterPoolPage';
import MasterActivePage from './pages/dashboard/MasterActivePage';
import ManagerRequestsPage from './pages/dashboard/ManagerRequestsPage';
import ManagerServicesPage from './pages/dashboard/ManagerServicesPage';
import ManagerNewsPage from './pages/dashboard/ManagerNewsPage';
import ManagerMastersPage from './pages/dashboard/ManagerMastersPage';
import AdminUsersPage from './pages/dashboard/AdminUsersPage';
import AdminSparePartsPage from './pages/dashboard/AdminSparePartsPage';
import AdminStatisticsPage from './pages/dashboard/AdminStatisticsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayout />}>
            {/* Публичные страницы */}
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

            {/* Личный кабинет */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<DashboardRedirect />} />
              
              {/* Клиент */}
              <Route path="my-requests" element={<ProtectedRoute allowedRoles={[Role.CLIENT]}><MyRequestsPage /></ProtectedRoute>} />
              <Route path="new-request" element={<ProtectedRoute allowedRoles={[Role.CLIENT]}><NewRequestPage /></ProtectedRoute>} />

              {/* Мастер */}
              <Route path="pool" element={<ProtectedRoute allowedRoles={[Role.MASTER]}><MasterPoolPage /></ProtectedRoute>} />
              <Route path="active" element={<ProtectedRoute allowedRoles={[Role.MASTER]}><MasterActivePage /></ProtectedRoute>} />

              {/* Менеджер */}
              <Route path="requests" element={<ProtectedRoute allowedRoles={[Role.MANAGER]}><ManagerRequestsPage /></ProtectedRoute>} />
              <Route path="services" element={<ProtectedRoute allowedRoles={[Role.MANAGER]}><ManagerServicesPage /></ProtectedRoute>} />
              <Route path="news" element={<ProtectedRoute allowedRoles={[Role.MANAGER]}><ManagerNewsPage /></ProtectedRoute>} />
              <Route path="masters" element={<ProtectedRoute allowedRoles={[Role.MANAGER]}><ManagerMastersPage /></ProtectedRoute>} />

              {/* Админ */}
              <Route path="users" element={<ProtectedRoute allowedRoles={[Role.ADMIN]}><AdminUsersPage /></ProtectedRoute>} />
              <Route path="spare-parts" element={<ProtectedRoute allowedRoles={[Role.ADMIN]}><AdminSparePartsPage /></ProtectedRoute>} />
              <Route path="statistics" element={<ProtectedRoute allowedRoles={[Role.ADMIN]}><AdminStatisticsPage /></ProtectedRoute>} />
            </Route>

            {/* Заглушка для 404 */}
            <Route path="*" element={
              <div className="flex-1 flex flex-col items-center justify-center py-20 text-center px-4">
                <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Страница не найдена</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
                  Возможно, она была удалена или вы ввели неправильный адрес.
                </p>
                <a href="/" className="btn-primary">Вернуться на главную</a>
              </div>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
