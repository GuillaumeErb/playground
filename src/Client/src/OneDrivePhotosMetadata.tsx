import { Button } from '@fluentui/react-components';
import { FolderContents, Photo, splitPhotosAndFolders } from './OneDriveItem';
import React, { useState } from 'react';
import { getAccessToken } from './Authentication';
import { useMsal } from '@azure/msal-react';
import {
  getPhotosFolderItems,
  graphGetFolderItemsFromId,
} from './OneDriveApis';

export const OneDrivePhotosMetadata = () => {
  const { instance, accounts } = useMsal();
  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);

  async function getFolderItemsFromId(
    folderId: string
  ): Promise<FolderContents> {
    const accessToken = await getAccessToken(
      instance,
      ['Files.Read'],
      accounts[0]
    );
    const folderItems = await graphGetFolderItemsFromId(accessToken, folderId);

    return splitPhotosAndFolders(folderItems.value);
  }

  async function GetGPSInfoFromAllPhotos(limit: number = 1000) {
    const folderIdsQueue: string[] = [];

    const accessToken = await getAccessToken(
      instance,
      ['Files.Read'],
      accounts[0]
    );
    const result2 = await getPhotosFolderItems(accessToken);
    const { photos: photosInRoot, folders: foldersInRoot } =
      splitPhotosAndFolders(result2.value);
    folderIdsQueue.push(...foldersInRoot.map((folder) => folder.id));

    // get items in each sub folder recursively
    while (folderIdsQueue.length > 0 && folderIdsQueue.length < limit) {
      const { photos, folders } = await getFolderItemsFromId(
        folderIdsQueue.shift()!
      );
      folderIdsQueue.push(...folders.map((folder) => folder.id));
      photosInRoot.push(...photos);
    }

    setAllPhotos(photosInRoot);
  }

  return (
    <>
      <h5 className="profileContent">Welcome {accounts[0].name}</h5>
      {allPhotos.length ? (
        <OneDrivePhotosMetadataList allPhotos={allPhotos} />
      ) : (
        <Button onClick={() => GetGPSInfoFromAllPhotos()}>
          Get GPS info from all photos
        </Button>
      )}
    </>
  );
};

interface AllPhotosProps {
  allPhotos: Photo[];
}

const OneDrivePhotosMetadataList = (props: AllPhotosProps) => {
  return (
    <div id="profile-div">
      <h5>Photos</h5>
      {props.allPhotos.map((photo: Photo, index: number) => {
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
