import { RequestStatus, STATUS_LABELS } from '../types';

interface StatusBadgeProps {
  status: RequestStatus;
}

const BADGE_CLASSES: Record<RequestStatus, string> = {
  [RequestStatus.NEW]: 'badge badge-new',
  [RequestStatus.ASSIGNED]: 'badge badge-assigned',
  [RequestStatus.IN_PROGRESS]: 'badge badge-in-progress',
  [RequestStatus.COMPLETED]: 'badge badge-completed',
  [RequestStatus.CANCELLED]: 'badge badge-cancelled',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={BADGE_CLASSES[status]}>{STATUS_LABELS[status]}</span>;
}
