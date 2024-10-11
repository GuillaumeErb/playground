import React from 'react';
import { TopBar } from './TopBar';
import { Navigate, Outlet } from 'react-router-dom';
import { useIsAuthenticated } from '@azure/msal-react';

export const PageLayout = () => {
  const isAuthenticated = useIsAuthenticated();

  console.warn('PageLayout', isAuthenticated);

  return (
    <>
      <TopBar />
      <br />
      <br />
      {isAuthenticated ? <Outlet /> : <Navigate to="/" replace />}
    </>
  );
};
