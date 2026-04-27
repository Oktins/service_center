import { useQuery } from '@tanstack/react-query';
import { newsApi } from '../api/news';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function NewsPage() {
  const { data: news, isLoading, error, refetch } = useQuery({
    queryKey: ['news'],
    queryFn: newsApi.getAll,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="section-title">Новости и акции</h1>
        <p className="section-subtitle">Будьте в курсе последних событий и выгодных предложений</p>
      </div>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message="Не удалось загрузить новости" onRetry={() => refetch()} />}

      {news && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item) => (
            <article key={item.id} className="card overflow-hidden flex flex-col h-full transition-all hover:shadow-xl">
              {item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Tag className="w-12 h-12 text-gray-300 dark:text-gray-700" />
                </div>
              )}
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(item.createdAt), 'd MMMM yyyy', { locale: ru })}
                  </div>
                  {item.isPromotion && (
                    <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full font-medium">
                      Акция
                    </span>
                  )}
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                  {item.title}
                </h2>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-4 mb-6">
                  {item.content}
                </p>
                
                {item.expiresAt && (
                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-xs text-red-500 font-medium">
                      Акция до: {format(new Date(item.expiresAt), 'd MMMM', { locale: ru })}
                    </p>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
      
      {news && news.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400">Новостей пока нет</p>
        </div>
      )}
    </div>
  );
}
