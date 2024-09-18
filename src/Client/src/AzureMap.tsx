import React, { useEffect, useRef } from 'react';
import * as atlas from 'azure-maps-control';
import { AuthenticationType } from 'azure-maps-control';
import { useMsal } from '@azure/msal-react';
import { AuthenticationResult } from '@azure/msal-browser';

export const AzureMap = () => {
  const mapRef = useRef(null);
  const { instance, accounts } = useMsal();

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    if (instance === null) {
      return;
    }

    const map = new atlas.Map(mapRef.current, {
      center: [-122.33, 47.6],
      zoom: 12,
      view: 'Auto',
      authOptions: {
        authType: AuthenticationType.anonymous,
        getToken: (resolve, reject, _) => {
          return instance
            .acquireTokenSilent({
              scopes: ['https://atlas.microsoft.com/user_impersonation'],
              account: accounts[0],
            })
            .then((response: AuthenticationResult) => {
              console.log(JSON.stringify(response));
              resolve(response.accessToken);
            })
            .catch((e: Error) => {
              console.error(e);
              reject(e);
            });
        },
      },
    });

    return () => map.dispose();
  }, [mapRef.current, instance === null]);

  return <div style={{ height: '500px' }} ref={mapRef} />;
};
