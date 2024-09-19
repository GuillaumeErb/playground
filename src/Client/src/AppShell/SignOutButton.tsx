import React from 'react';
import { useMsal } from '@azure/msal-react';
import { Button } from '@fluentui/react-components';

export const SignOutButton = () => {
  const { instance } = useMsal();

  const handleLogout = () => {
    instance.logoutPopup({
      postLogoutRedirectUri: '/',
      mainWindowRedirectUri: '/',
    });
  };

  return <Button onClick={() => handleLogout()}>Sign Out</Button>;
};
