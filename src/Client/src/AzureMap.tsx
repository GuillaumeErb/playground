import React, { useEffect, useRef } from 'react';
import * as atlas from 'azure-maps-control';
import { AuthenticationType } from 'azure-maps-control';
import { useMsal } from '@azure/msal-react';
import { getAccessToken, TENANT_ID } from './authConfig';

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
        getToken: (resolve, reject, _) =>
          getAccessToken(
            instance,
            ['https://atlas.microsoft.com/user_impersonation'],
            accounts[0],
            'https://login.microsoftonline.com/' + TENANT_ID
          )
            .then((accessToken: string) => resolve(accessToken))
            .catch((e) => reject(e)),
      },
    });

    return () => map.dispose();
  }, [mapRef.current, instance === null]);

  return <div style={{ height: '90%', width: '90%' }} ref={mapRef} />;
};
