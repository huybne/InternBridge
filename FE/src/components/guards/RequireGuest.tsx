// src/components/guards/RequireGuest.tsx
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { Navigate } from 'react-router-dom';
import { JSX } from 'react';

interface Props {
  children: JSX.Element;
}

export default function RequireGuest({ children }: Props) {
  const { user } = useSelector((state: RootState) => state.auth);

  // Nếu đã login → redirect về homepage (hoặc profile)
  if (user) {
    return <Navigate to="/" replace />;
  }

  // Nếu chưa login thì cho xem login/signup page
  return children;
}
