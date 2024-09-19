import React from 'react';
import { TopBar } from './TopBar';
import { Navigate, Outlet } from 'react-router-dom';
import { useIsAuthenticated } from '@azure/msal-react';

export const PageLayout = () => {
  const isAuthenticated = useIsAuthenticated();

  return (
    <>
      <TopBar />
      <br />
      <br />
      {isAuthenticated || window.location.pathname === '/' ? (
        <Outlet />
      ) : (
        <Navigate to="/" replace />
      )}
    </>
  );
};
