import { NavLink, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Role } from '../types';
import {
  ClipboardList,
  PlusCircle,
  Inbox,
  Zap,
  Users,
  Package,
  BarChart3,
  Newspaper,
  Settings,
  Wrench,
} from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  roles: Role[];
}

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard/my-requests', label: 'Мои заявки', icon: <ClipboardList className="w-4 h-4" />, roles: [Role.CLIENT] },
  { to: '/dashboard/new-request', label: 'Новая заявка', icon: <PlusCircle className="w-4 h-4" />, roles: [Role.CLIENT] },
  { to: '/dashboard/pool', label: 'Пул заявок', icon: <Inbox className="w-4 h-4" />, roles: [Role.MASTER] },
  { to: '/dashboard/active', label: 'Мои активные', icon: <Zap className="w-4 h-4" />, roles: [Role.MASTER] },
  { to: '/dashboard/requests', label: 'Все заявки', icon: <ClipboardList className="w-4 h-4" />, roles: [Role.MANAGER] },
  { to: '/dashboard/services', label: 'Каталог услуг', icon: <Settings className="w-4 h-4" />, roles: [Role.MANAGER] },
  { to: '/dashboard/news', label: 'Новости', icon: <Newspaper className="w-4 h-4" />, roles: [Role.MANAGER] },
  { to: '/dashboard/masters', label: 'Мастера', icon: <Wrench className="w-4 h-4" />, roles: [Role.MANAGER] },
  { to: '/dashboard/users', label: 'Пользователи', icon: <Users className="w-4 h-4" />, roles: [Role.ADMIN] },
  { to: '/dashboard/spare-parts', label: 'Запчасти', icon: <Package className="w-4 h-4" />, roles: [Role.ADMIN] },
  { to: '/dashboard/statistics', label: 'Статистика', icon: <BarChart3 className="w-4 h-4" />, roles: [Role.ADMIN] },
];

export default function DashboardLayout() {
  const { user } = useAuthStore();

  const filteredNav = NAV_ITEMS.filter(
    (item) => user && item.roles.includes(user.role)
  );

  return (
    <div className="min-h-[calc(100vh-8rem)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Личный кабинет
            </h2>
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {filteredNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
