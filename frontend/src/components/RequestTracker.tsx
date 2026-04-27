import { RequestStatus, STATUS_LABELS } from '../types';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

interface RequestTrackerProps {
  status: RequestStatus;
}

const STEPS = [
  RequestStatus.NEW,
  RequestStatus.ASSIGNED,
  RequestStatus.IN_PROGRESS,
  RequestStatus.COMPLETED,
];

export default function RequestTracker({ status }: RequestTrackerProps) {
  if (status === RequestStatus.CANCELLED) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <div className="w-3 h-3 bg-red-500 rounded-full" />
        <span className="text-sm font-medium text-red-700 dark:text-red-400">
          Заявка отменена
        </span>
      </div>
    );
  }

  const currentIdx = STEPS.indexOf(status);

  return (
    <div className="flex items-center gap-1">
      {STEPS.map((step, idx) => {
        const isCompleted = idx < currentIdx;
        const isCurrent = idx === currentIdx;

        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isCompleted
                    ? 'bg-primary-600 text-white'
                    : isCurrent
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 ring-2 ring-primary-600'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
              </div>
              <span
                className={`text-[10px] mt-1 font-medium whitespace-nowrap ${
                  isCompleted || isCurrent
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-400'
                }`}
              >
                {STATUS_LABELS[step]}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`w-8 h-0.5 mx-1 mb-5 ${
                  idx < currentIdx
                    ? 'bg-primary-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
