import { useQuery } from '@tanstack/react-query';
import { mastersApi } from '../api/masters';
import LoadingSpinner from '../components/LoadingSpinner';
import { Star, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function AboutPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  const { data: mastersData, isLoading } = useQuery({
    queryKey: ['masters-all'],
    queryFn: () => mastersApi.getAll(0, 100),
  });

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    import('leaflet').then((L) => {
      import('leaflet/dist/leaflet.css');

      const map = L.map(mapRef.current!, {
        scrollWheelZoom: false,
      }).setView([55.7558, 37.6173], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      L.marker([55.7558, 37.6173]).addTo(map).bindPopup('ServiceHub — Сервисный центр');

      mapInstance.current = map;
    });

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-50 to-primary-50 dark:from-gray-900 dark:to-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
            О компании
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
            ServiceHub — профессиональный сервисный центр по ремонту электроники с 2021 года.
            Мы специализируемся на ремонте смартфонов, ноутбуков, планшетов и умных часов.
            Наша команда — сертифицированные специалисты с многолетним опытом.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-8">Почему выбирают нас</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Clock className="w-6 h-6" />, title: 'Быстрый ремонт', desc: 'Большинство ремонтов выполняем в день обращения' },
              { icon: <Star className="w-6 h-6" />, title: 'Гарантия качества', desc: 'Гарантия до 12 месяцев на все виды работ' },
              { icon: <MapPin className="w-6 h-6" />, title: 'Удобное расположение', desc: 'Центр Москвы, удобная транспортная доступность' },
            ].map((item) => (
              <div key={item.title} className="card p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 bg-primary-100 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center text-primary-600">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-8">Наша команда</h2>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mastersData?.content.map((master) => (
                <div key={master.id} className="card p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center text-primary-600">
                      <span className="text-xl font-bold">
                        {master.firstName[0]}{master.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {master.firstName} {master.lastName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {master.specialization}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock className="w-4 h-4" />
                      {master.experienceYears} лет опыта
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {master.rating?.toFixed(1) || '—'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contacts & Map */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-8">Контакты</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center text-primary-600 flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Адрес</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    г. Москва, ул. Примерная, д. 1
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center text-primary-600 flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Телефон</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">+7 (999) 123-45-67</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center text-primary-600 flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Email</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">info@servicehub.ru</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center text-primary-600 flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Часы работы</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Пн–Пт: 9:00 — 20:00</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Сб: 10:00 — 18:00</p>
                </div>
              </div>
            </div>
            <div
              ref={mapRef}
              className="h-80 lg:h-auto rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700"
              style={{ minHeight: 320 }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

// Declare leaflet type for dynamic import
declare const L: typeof import('leaflet');
