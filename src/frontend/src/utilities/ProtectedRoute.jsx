import { Navigate } from 'react-router-dom';
import React from 'react';
import CoreModules from '@/shared/CoreModules';
import { LoginActions } from '@/store/slices/LoginSlice';

const ProtectedRoute = ({ children }) => {
  // // Bypass check if NODE_ENV=development (local dev)
  // if (import.meta.env.MODE === 'development') {
  //   return children;
  // }
  const dispatch = CoreModules.useAppDispatch();
  const authDetails = CoreModules.useAppSelector((state) => state.login.authDetails);

  if (authDetails == null) {
    dispatch(LoginActions.setLoginModalOpen(true));
    return <Navigate to="/" replace />;
  }

  return children;
};
export default ProtectedRoute;
