import { Button } from '@fluentui/react-components';
import {
  FolderContent,
  OneDriveItem,
  splitPhotosAndFolders,
} from './OneDriveItem';
import React, { useState } from 'react';
import { getAccessToken } from './Authentication';
import { useMsal } from '@azure/msal-react';
import {
  getPhotosFolderItems,
  graphGetFolderItemsFromId,
} from './OneDriveApis';

export async function getFolderItemsFromId(
  accessToken: string,
  folderId: string
): Promise<FolderContent> {
  const folderItems = await graphGetFolderItemsFromId(accessToken, folderId);
  return splitPhotosAndFolders(folderItems.value);
}

export async function getGPSFromAllPhotos(
  accessToken: string,
  limit: number | undefined,
  setCurrentPhotosCount: (count: number) => void
) {
  const rootItems = await getPhotosFolderItems(accessToken);
  const rootFolderContent: FolderContent = splitPhotosAndFolders(
    rootItems.value
  );
  setCurrentPhotosCount(rootFolderContent.otherItems.length);

  return getGPSFromAllPhotosInternal(
    accessToken,
    limit,
    rootFolderContent.folders.map((folder) => folder.id),
    rootFolderContent.otherItems,
    setCurrentPhotosCount
  );
}

export async function getGPSFromAllPhotosInternal(
  accessToken: string,
  limit: number | undefined,
  folderIds: string[],
  oneDriveItemsAccumulator: OneDriveItem[],
  setCurrentPhotosCount: (count: number) => void
) {
  if (
    folderIds.length === 0 ||
    (limit !== undefined && oneDriveItemsAccumulator.length >= limit)
  ) {
    return oneDriveItemsAccumulator;
  }

  const newFolderIds: string[] = [];
  await Promise.all(
    folderIds.map(async (folderId) => {
      const folderContent = await getFolderItemsFromId(accessToken, folderId);
      newFolderIds.push(...folderContent.folders.map((folder) => folder.id));
      oneDriveItemsAccumulator.push(...folderContent.otherItems);
      setCurrentPhotosCount(oneDriveItemsAccumulator.length);
    })
  );

  return getGPSFromAllPhotosInternal(
    accessToken,
    limit,
    newFolderIds,
    oneDriveItemsAccumulator,
    setCurrentPhotosCount
  );
}

export const OneDrivePhotosMetadata = () => {
  const { instance, accounts } = useMsal();
  const [allPhotos, setAllPhotos] = useState<OneDriveItem[]>([]);

  async function ButtonGetGPSInfoFromAllPhotos(limit: number | undefined) {
    const accessToken = await getAccessToken(
      instance,
      ['Files.Read'],
      accounts[0]
    );
    const allPhotosGPS = await getGPSFromAllPhotos(
      accessToken,
      limit,
      () => {}
    );
    setAllPhotos(allPhotosGPS);
  }

  return (
    <>
      <h5 className="profileContent">Welcome {accounts[0].name}</h5>
      {allPhotos.length ? (
        <OneDrivePhotosMetadataList allPhotos={allPhotos} />
      ) : (
        <Button onClick={() => ButtonGetGPSInfoFromAllPhotos(undefined)}>
          Get GPS info from all photos
        </Button>
      )}
    </>
  );
};

interface AllPhotosProps {
  allPhotos: OneDriveItem[];
}

const OneDrivePhotosMetadataList = (props: AllPhotosProps) => {
  return (
    <div id="profile-div">
      <h5>Photos</h5>
      {props.allPhotos.map((photo: OneDriveItem, index: number) => {
        return (
          <div key={index}>
            <p>
              <strong>Id: </strong> {photo.id}
            </p>
            <p>
              <strong>Name: </strong> {photo.name}
            </p>
            <p>
              <strong>Altitude: </strong>{' '}
              {photo.location?.altitude ?? 'unknown'}
            </p>
            <p>
              <strong>Latitude: </strong>{' '}
              {photo.location?.latitude ?? 'unknown'}
            </p>
            <p>
              <strong>Longitude: </strong>{' '}
              {photo.location?.longitude ?? 'unknown'}
            </p>
          </div>
        );
      })}
    </div>
  );
};
