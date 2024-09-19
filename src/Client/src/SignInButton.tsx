import React from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from './Authentication';
import { Button } from '@fluentui/react-components';

export const SignInButton = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch((e) => {
      console.log(e);
    });
  };

  return <Button onClick={() => handleLogin()}>Sign In</Button>;
};
