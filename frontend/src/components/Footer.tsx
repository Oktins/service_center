import { Link } from 'react-router-dom';
import { Wrench, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Service<span className="text-primary-400">Hub</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm max-w-md leading-relaxed">
              Профессиональный сервисный центр по ремонту электроники. Работаем с 2021 года.
              Гарантия качества на все виды работ.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Навигация
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                  Услуги
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                  Новости
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                  Вопросы и ответы
                </Link>
              </li>
              <li>
                <Link to="/contacts" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                  Контакты
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                  О компании
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Контакты
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-primary-500 flex-shrink-0" />
                +7 (999) 123-45-67
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-primary-500 flex-shrink-0" />
                info@servicehub.ru
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                г. Минск, ул. Примерная, д. 1
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} ServiceHub. Все права защищены.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
              Политика конфиденциальности
            </a>
            <a href="#" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
              Условия использования
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
