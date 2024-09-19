import React, { useEffect, useRef, useState } from 'react';
import * as atlas from 'azure-maps-control';
import { useMsal } from '@azure/msal-react';
import { getAccessToken } from './Authentication';
import { getGPSFromAllPhotos } from './OneDrivePhotosMetadata';
import { AccountInfo, IPublicClientApplication } from '@azure/msal-browser';
import { OneDriveItem } from './OneDriveItem';

function getDatasourceFromPhotos(photos: OneDriveItem[]) {
  // filter out photos without geotag
  photos = photos.filter((photo) => photo.location !== undefined);

  const datasource = new atlas.source.DataSource(undefined, {
    cluster: true,
    clusterRadius: 10,
  });
  photos.forEach((photo) => {
    datasource.add(
      new atlas.data.Feature(
        new atlas.data.Point(
          new atlas.data.Position(
            photo.location?.longitude ?? 0,
            photo.location?.latitude ?? 0
          )
        )
      )
    );
  });
  return datasource;
}

const getAllPhotos = async (
  instance: IPublicClientApplication,
  account: AccountInfo
) => {
  const accessToken = await getAccessToken(instance, ['Files.Read'], account);
  const allPhotos = await getGPSFromAllPhotos(accessToken, 1000);
  return allPhotos;
};

export const AzureMap = () => {
  const mapRef = useRef(null);
  const { instance, accounts } = useMsal();

  const [allPhotos, setAllPhotos] = useState<OneDriveItem[] | null>(null);

  useEffect(() => {
    if (!instance) {
      return;
    }

    if (accounts?.[0] === undefined) {
      return;
    }

    getAllPhotos(instance, accounts[0]).then((photos) => {
      setAllPhotos(photos);
    });
  }, [instance, accounts?.[0]]);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    if (instance === null) {
      return;
    }

    if (allPhotos === null) {
      return;
    }

    const addGPSHeatMapToMap = (map: atlas.Map) => {
      const datasource = getDatasourceFromPhotos(allPhotos);

      map.events.add('ready', function () {
        map.sources.add(datasource);
        map.layers.add(
          new atlas.layer.HeatMapLayer(datasource, undefined, {
            weight: ['get', 'point_count'],
            radius: 10,
          }),
          'labels'
        );
      });

      return map;
    };

    const mapOptions = {
      zoom: 12,
      center: [2.2656859, 48.8338625],
      view: 'Auto',
      authOptions: {
        authType: atlas.AuthenticationType.subscriptionKey,
        subscriptionKey: process.env.REACT_APP_AZURE_MAPS_KEY,
        /*authType: AuthenticationType.anonymous,
        clientId: CLIENT_ID,
        getToken: (resolve, reject, _) =>
          getAccessToken(
            instance,
            ['https://atlas.microsoft.com/user_impersonation'],
            accounts[0],
            'https://login.microsoftonline.com/' + TENANT_ID
          )
            .then((accessToken: string) => resolve(accessToken))
            .catch((e) => reject(e)),*/
      },
      showFeedbackLink: false,
      showLogo: false,
    };
    const map = new atlas.Map(mapRef.current, mapOptions);
    addGPSHeatMapToMap(map);

    return () => map.dispose();
  }, [mapRef.current, instance === null, allPhotos === null]);

  return (
    <div
      style={{ position: 'relative', height: '700px', width: '100%' }}
      ref={mapRef}
    />
  );
};
