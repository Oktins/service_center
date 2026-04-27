import { useState, useEffect, useCallback } from 'react';
import type { News } from '../types';
import { ChevronLeft, ChevronRight, Megaphone, Newspaper } from 'lucide-react';

interface NewsCarouselProps {
  news: News[];
}

export default function NewsCarousel({ news }: NewsCarouselProps) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % news.length);
  }, [news.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + news.length) % news.length);
  }, [news.length]);

  useEffect(() => {
    if (news.length <= 1) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next, news.length]);

  if (news.length === 0) return null;

  const item = news[current];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 text-white">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      <div className="relative p-8 md:p-12 min-h-[200px] flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            {item.isPromotion ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-sm font-medium">
                <Megaphone className="w-4 h-4" /> Акция
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-sm font-medium">
                <Newspaper className="w-4 h-4" /> Новость
              </span>
            )}
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-3">{item.title}</h3>
          <p className="text-white/80 text-sm md:text-base max-w-2xl line-clamp-3">
            {item.content}
          </p>
        </div>

        {news.length > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="flex gap-2">
              {news.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === current ? 'bg-white w-6' : 'bg-white/40'
                  }`}
                  aria-label={`Перейти к слайду ${idx + 1}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                aria-label="Предыдущий слайд"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                aria-label="Следующий слайд"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
