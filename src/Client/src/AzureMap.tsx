import React, { useContext, useEffect, useRef, useState } from 'react';
import * as atlas from 'azure-maps-control';
import { AuthenticationType } from 'azure-maps-control';
import { useMsal } from '@azure/msal-react';
import { getAccessToken, TENANT_ID } from './Authentication';
import { getGPSFromAllPhotos } from './OneDrivePhotosMetadata';
import { Photo } from './OneDriveItem';
import { AccountInfo, IPublicClientApplication } from '@azure/msal-browser';

function getDatasourceFromPhotos(photos: Photo[]) {
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

  const [allPhotos, setAllPhotos] = useState<Photo[] | null>(null);

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
        authType: AuthenticationType.subscriptionKey,
        subscriptionKey: process.env.REACT_APP_AZURE_MAPS_KEY,
      },
    };

    const map = new atlas.Map(mapRef.current, mapOptions);
    addGPSHeatMapToMap(map);

    return () => map.dispose();
  }, [mapRef.current, instance === null, allPhotos === null]);

  return <div style={{ height: '500px', width: '500px' }} ref={mapRef} />;
};
