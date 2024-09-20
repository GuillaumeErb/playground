import React, { useEffect, useRef, useState } from 'react';
import * as atlas from 'azure-maps-control';
import { useMsal } from '@azure/msal-react';
import { getAccessToken } from './Authentication';
import { getGPSFromAllPhotos } from './OneDrivePhotosMetadata';
import { AccountInfo, IPublicClientApplication } from '@azure/msal-browser';
import { OneDriveItem } from './OneDriveItem';
import { Button, Field, ProgressBar } from '@fluentui/react-components';

function getDatasourceFromPhotos(photos: OneDriveItem[]) {
  const datasource = new atlas.source.DataSource(undefined, {
    cluster: true,
    clusterRadius: 10,
  });
  photos
    .filter((photo) => photo.location !== undefined)
    .forEach((photo) => {
      datasource.add(
        new atlas.data.Feature(
          new atlas.data.Point(
            new atlas.data.Position(
              photo.location!.longitude,
              photo.location!.latitude
            )
          )
        )
      );
    });
  return datasource;
}

const getAllPhotos = async (
  instance: IPublicClientApplication,
  account: AccountInfo,
  setCurrentPhotosCount: (count: number) => void
) => {
  const accessToken = await getAccessToken(instance, ['Files.Read'], account);
  const allPhotos = await getGPSFromAllPhotos(
    accessToken,
    undefined,
    setCurrentPhotosCount
  );
  return allPhotos;
};

export const AzureMap = () => {
  const mapRef = useRef(null);
  const { instance, accounts } = useMsal();

  const [oneDrivePhotosMetadata, setOneDrivePhotosMetadata] = useState<
    OneDriveItem[] | null
  >(null);
  const [currentPhotosCount, setCurrentPhotosCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [map, setMap] = useState<atlas.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    if (instance === null) {
      return;
    }

    if (oneDrivePhotosMetadata === null) {
      return;
    }

    const addGPSHeatMapToMap = (map: atlas.Map) => {
      const datasource = getDatasourceFromPhotos(oneDrivePhotosMetadata);

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
    setMap(map);

    return () => map.dispose();
  }, [mapRef.current, instance === null, oneDrivePhotosMetadata === null]);

  console.log('MapRef', mapRef);
  console.log('Camera', map?.getCamera());

  const loadOneDrivePhotosMetadata = async () => {
    setLoading(true);
    const allPhotos = await getAllPhotos(
      instance,
      accounts[0],
      (count: number) => {
        if (count > currentPhotosCount) {
          setCurrentPhotosCount(count);
        }
      }
    );
    setOneDrivePhotosMetadata(allPhotos);
    setLoading(false);
  };

  const LoadOneDrivePhotosMetadataButton = () => {
    if (loading) {
      return <OneDriveProgressBar itemsDownloaded={currentPhotosCount} />;
    }
    return (
      <Button onClick={() => loadOneDrivePhotosMetadata()}>
        Load OneDrive Photos Metadata
      </Button>
    );
  };

  return (
    <>
      <LoadOneDrivePhotosMetadataButton />
      <div
        style={{ position: 'relative', height: '700px', width: '100%' }}
        ref={mapRef}
        hidden={oneDrivePhotosMetadata === null}
      />
    </>
  );
};

export const OneDriveProgressBar = (props: { itemsDownloaded: number }) => {
  return (
    <Field
      validationMessage={`There have been ${props.itemsDownloaded} items downloaded`}
      validationState="none"
    >
      <ProgressBar />
    </Field>
  );
};
