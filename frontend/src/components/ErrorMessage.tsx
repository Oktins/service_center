import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message = 'Произошла ошибка', onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="w-14 h-14 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
        <AlertTriangle className="w-7 h-7 text-red-600" />
      </div>
      <p className="text-gray-600 dark:text-gray-400">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary btn-sm">
          Попробовать снова
        </button>
      )}
    </div>
  );
}
