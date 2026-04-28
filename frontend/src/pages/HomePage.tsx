import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { servicesApi } from '../api/services';
import { newsApi } from '../api/news';
import { mastersApi } from '../api/masters';
import ServiceCard from '../components/ServiceCard';
import NewsCarousel from '../components/NewsCarousel';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  ArrowRight,
  Star,
  ClipboardCheck,
  Users,
  Calendar,
  ChevronRight,
  Settings,
} from 'lucide-react';
import type { ServiceCatalog, Category } from '../types';

function flattenCategories(categories: Category[]): Category[] {
  return categories.flatMap((category) => [
    category,
    ...flattenCategories(category.subCategories || []),
  ]);
}

function findCategory(categories: Category[], categoryId: number): Category | undefined {
  return flattenCategories(categories).find((category) => category.id === categoryId);
}

function collectCategoryIds(category: Category): number[] {
  return [
    category.id,
    ...(category.subCategories || []).flatMap((subCategory) => collectCategoryIds(subCategory)),
  ];
}

function useCounter(target: number, duration = 2000): [number, (node: HTMLDivElement | null) => void] {
  const [count, setCount] = useState(0);
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!node || started.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node, target, duration]);

  return [count, setNode];
}

export default function HomePage() {
  const [calcCategoryId, setCalcCategoryId] = useState<number | null>(null);
  const [calcServices, setCalcServices] = useState<ServiceCatalog[]>([]);
  const [calcServicesLoading, setCalcServicesLoading] = useState(false);

  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ['services'],
    queryFn: servicesApi.getAll,
  });

  const { data: news, isLoading: newsLoading } = useQuery({
    queryKey: ['news'],
    queryFn: newsApi.getAll,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: servicesApi.getCategories,
  });

  const { data: mastersData } = useQuery({
    queryKey: ['masters-home'],
    queryFn: () => mastersApi.getAll(0, 3),
  });

  const [count1, setRef1] = useCounter(500);
  const [count2, setRef2] = useCounter(20);
  const [count3, setRef3] = useCounter(5);

  const calcCategories = flattenCategories(categories || []);
  const selectedCategory = calcCategoryId && categories ? findCategory(categories, calcCategoryId) : undefined;
  const selectedCategoryName = selectedCategory?.name;

  useEffect(() => {
    let isCancelled = false;

    const loadCategoryServices = async () => {
      if (!calcCategoryId || !selectedCategory) {
        setCalcServices([]);
        return;
      }

      setCalcServicesLoading(true);
      try {
        const categoryIds = collectCategoryIds(selectedCategory);
        const responses = await Promise.all(
          categoryIds.map((categoryId) => servicesApi.getByCategory(categoryId))
        );
        const uniqueServices = Array.from(
          new Map(responses.flat().map((service) => [service.id, service])).values()
        );

        if (!isCancelled) {
          setCalcServices(uniqueServices);
        }
      } finally {
        if (!isCancelled) {
          setCalcServicesLoading(false);
        }
      }
    };

    loadCategoryServices();

    return () => {
      isCancelled = true;
    };
  }, [calcCategoryId, selectedCategory]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-primary-50 dark:from-gray-900 dark:to-gray-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxNmEzNGEiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] " />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight text-balance">
              ServiceHub —{' '}
              <span className="text-primary-600">Профессиональный</span>{' '}
              ремонт техники
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
              Быстрый и качественный ремонт смартфонов, ноутбуков, планшетов и часов.
              Оставьте заявку онлайн и отслеживайте статус в личном кабинете.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/dashboard/new-request" className="btn-primary text-base">
                Оставить заявку
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/services" className="btn-secondary text-base">
                Наши услуги
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Counters */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div ref={setRef1} className="text-center">
              <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 bg-primary-100 dark:bg-primary-900/20 rounded-2xl">
                <ClipboardCheck className="w-7 h-7 text-primary-600" />
              </div>
              <p className="text-4xl font-extrabold text-gray-900 dark:text-white">
                {count1}+
              </p>
              <p className="mt-1 text-gray-500 dark:text-gray-400">Выполненных заявок</p>
            </div>
            <div ref={setRef2} className="text-center">
              <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 bg-primary-100 dark:bg-primary-900/20 rounded-2xl">
                <Users className="w-7 h-7 text-primary-600" />
              </div>
              <p className="text-4xl font-extrabold text-gray-900 dark:text-white">
                {count2}
              </p>
              <p className="mt-1 text-gray-500 dark:text-gray-400">Мастеров в команде</p>
            </div>
            <div ref={setRef3} className="text-center">
              <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 bg-primary-100 dark:bg-primary-900/20 rounded-2xl">
                <Calendar className="w-7 h-7 text-primary-600" />
              </div>
              <p className="text-4xl font-extrabold text-gray-900 dark:text-white">
                {count3}
              </p>
              <p className="mt-1 text-gray-500 dark:text-gray-400">Лет на рынке</p>
            </div>
          </div>
        </div>
      </section>

      {/* News Carousel */}
      {!newsLoading && news && news.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="section-title mb-8">Новости и акции</h2>
            <NewsCarousel news={news} />
          </div>
        </section>
      )}

      {/* Services Catalog */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Наши услуги</h2>
              <p className="section-subtitle">Профессиональный ремонт любой сложности</p>
            </div>
            <Link
              to="/services"
              className="hidden sm:flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              Все услуги <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {servicesLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services?.slice(0, 6).map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Calculator */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-2">Онлайн-калькулятор</h2>
          <p className="section-subtitle mb-8">Выберите категорию устройства для расчёта стоимости</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
            {calcCategories.map((cat: Category) => (
              <button
                key={cat.id}
                onClick={() => setCalcCategoryId(calcCategoryId === cat.id ? null : cat.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  calcCategoryId === cat.id
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 hover:border-primary-300'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span className="text-xs font-medium">{cat.name}</span>
              </button>
            ))}
          </div>
          {calcCategoryId && calcServicesLoading && <LoadingSpinner />}
          {calcCategoryId && !calcServicesLoading && calcServices.length > 0 && (
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Услуги — {selectedCategoryName}
              </h3>
              <div className="space-y-3">
                {calcServices.map((s: ServiceCatalog) => (
                  <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{s.name}</span>
                    <span className="text-sm font-semibold text-primary-600">
                      от {s.basePrice.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {calcCategoryId && !calcServicesLoading && calcServices.length === 0 && (
            <p className="text-center text-gray-500 py-8 bg-white dark:bg-gray-800 rounded-2xl">
              В категории "{selectedCategoryName}" пока нет услуг для расчёта
            </p>
          )}
        </div>
      </section>

      {/* Masters */}
      {mastersData && mastersData.content.length > 0 && (
        <section className="py-16 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="section-title mb-2">Наши мастера</h2>
            <p className="section-subtitle mb-8">Опытные специалисты к вашим услугам</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mastersData.content.map((master) => (
                <div key={master.id} className="card p-6 flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center text-primary-600 flex-shrink-0">
                    <span className="text-lg font-bold">
                      {master.firstName[0]}{master.lastName[0]}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {master.firstName} {master.lastName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{master.specialization}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {master.rating?.toFixed(1) || '—'}
                      </span>
                      <span className="text-xs text-gray-400 ml-1">
                        · {master.experienceYears} лет опыта
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
