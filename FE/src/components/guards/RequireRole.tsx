import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { Navigate, useLocation } from "react-router-dom";
import { JSX } from "react";

interface Props {
  children: JSX.Element;
  allowRoles: string[];
}

export default function RequireRole({ children, allowRoles }: Props) {
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  const userRoles = user?.roleNames || [];

  const hasAccess = userRoles.some(role => allowRoles.includes(role));

  if (!hasAccess) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}
