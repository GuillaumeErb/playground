import React, { useEffect, useRef } from 'react';
import * as atlas from 'azure-maps-control';
import { AuthenticationType } from 'azure-maps-control';

export const AzureMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    const map = new atlas.Map(mapRef.current, {
      center: [-122.33, 47.6],
      zoom: 12,
      view: 'Auto',
      authOptions: {
        authType: AuthenticationType.subscriptionKey,
        subscriptionKey: process.env.REACT_APP_AZURE_MAPS_KEY,
      },
    });

    return () => map.dispose();
  }, [mapRef.current]);

  return <div style={{ height: '500px' }} ref={mapRef} />;
};
