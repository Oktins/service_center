import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Role } from '../../types';

export default function DashboardRedirect() {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case Role.CLIENT: return <Navigate to="/dashboard/my-requests" replace />;
    case Role.MASTER: return <Navigate to="/dashboard/pool" replace />;
    case Role.MANAGER: return <Navigate to="/dashboard/requests" replace />;
    case Role.ADMIN: return <Navigate to="/dashboard/users" replace />;
    default: return <Navigate to="/" replace />;
  }
}
