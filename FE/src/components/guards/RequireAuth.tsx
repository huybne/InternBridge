// src/components/guards/RequireAuth.tsx
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { Navigate, useLocation } from 'react-router-dom';
import { JSX } from 'react';

interface Props {
  children: JSX.Element;
}

export default function RequireAuth({ children }: Props) {
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
