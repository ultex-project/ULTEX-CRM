import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from 'app/config/store';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';

interface HasAnyAuthorityProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const HasAnyAuthority = ({ children, allowedRoles }: HasAnyAuthorityProps) => {
  // 👇 Get user's actual authorities from Redux
  const currentAuthorities = useAppSelector(state => state.authentication.account?.authorities) || [];

  // 👇 Now pass BOTH arguments: user roles + required roles
  const hasAccess = hasAnyAuthority(currentAuthorities, allowedRoles);

  if (!hasAccess) {
    return <Navigate to="/accessdenied" replace />;
  }

  return <>{children}</>;
};
