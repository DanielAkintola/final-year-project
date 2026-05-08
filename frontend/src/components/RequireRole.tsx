import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';
import type { AdminRole } from '../types';

type RequireRoleProps = {
  allowedRoles: AdminRole[];
  children: ReactNode;
};

export function RequireRole({ allowedRoles, children }: RequireRoleProps) {
  const location = useLocation();
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate replace state={{ from: location }} to="/app/dashboard" />;
  }

  return children;
}
