import React, { useEffect, useRef } from 'react';
import * as atlas from 'azure-maps-control';
import { AuthenticationType } from 'azure-maps-control';
import { useMsal } from '@azure/msal-react';
import { getAccessToken } from './authConfig';

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
            'https://login.microsoftonline.com/39978ec3-287e-4574-8c31-93c1151c1bb6'
          )
            .then((accessToken: string) => resolve(accessToken))
            .catch((e) => reject(e)),
      },
    });

    return () => map.dispose();
  }, [mapRef.current, instance === null]);

  return <div style={{ height: '500px' }} ref={mapRef} />;
};
