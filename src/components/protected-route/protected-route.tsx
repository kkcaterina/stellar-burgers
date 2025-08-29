import { Preloader } from '@ui';
import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router';
import { isAuthCheckedSelector, userSelector } from '../../services/userSlice';

type ProtectedRoute = {
  children: React.ReactElement;
  authRoute?: boolean;
  unAuthRoute?: boolean;
};

export const ProtectedRoute = ({
  children,
  unAuthRoute,
  authRoute
}: ProtectedRoute) => {
  const location = useLocation();
  const user = useSelector(userSelector);
  const isAuthChecked = useSelector(isAuthCheckedSelector);
  if (!isAuthChecked) {
    return <Preloader />;
  } else if (authRoute && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  } else if (unAuthRoute && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }
  return children;
};
