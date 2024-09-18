import React, { useState } from 'react';

import { loginRequest } from './authConfig';
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from '@azure/msal-react';
import './App.css';
import WeatherForecast from './WeatherForecast';
import { AzureMap } from './AzureMap';
import { PageLayout } from './PageLayout';
import { getPhotosFolderItems, graphGetFolderItemsFromId } from './graph';
import {
  Button,
  FluentProvider,
  webLightTheme,
} from '@fluentui/react-components';
import { AllPhotosData, Photo } from './AllPhotosData';
import { off } from 'process';

interface Folder extends Item{
  childCount: number | undefined;
}

interface Item {
    id: string;
    name: string;
    folder: any;
}

function isFolderItem(item: Item): item is Folder {
    return item.folder;
  }

type FolderContents = {photos: Photo[], folders: Folder[]};

const GPSInfoFromAllPhotos = () => {
  const { instance, accounts } = useMsal();
  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);



  function splitPhotosAndFolders(items: Item[]): FolderContents {
    const photos: Photo[] = [];
    const folders: Folder[] = [];
    for (const item of items) {
        if (isFolderItem(item)) {
            folders.push(item);
        } else {
            photos.push(item);
        }
     }
        return {photos, folders};
  }

  async function getFolderItemsFromId(folderId: string): Promise<FolderContents> {
    const token = await instance 
      // Silently acquires an access token which is then attached to a request for MS Graph data
      .acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });
    const folderItems = await graphGetFolderItemsFromId(token.accessToken, folderId);

    return splitPhotosAndFolders(folderItems.value);
}

  async function GetGPSInfoFromAllPhotos() {
    const folderIdsQueue: string[] = [];

    // get root (Photos folder) items
    const token = await instance 
      // Silently acquires an access token which is then attached to a request for MS Graph data
      .acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });
    const result2 = await getPhotosFolderItems(token.accessToken);
    const {photos: photosInRoot, folders: foldersInRoot} = splitPhotosAndFolders(result2.value);
    folderIdsQueue.push(...foldersInRoot.map(folder => folder.id));

    // get items in each sub folder recursively
    while (folderIdsQueue.length > 0) {
        const {photos, folders} = await getFolderItemsFromId(folderIdsQueue.shift()!);
        folderIdsQueue.push(...folders.map(folder => folder.id));
        photosInRoot.push(...photos);
}

    setAllPhotos(photosInRoot);
  }

  return (
    <>
      <h5 className="profileContent">Welcome {accounts[0].name}</h5>
      {allPhotos.length ? (
        <AllPhotosData allPhotos={allPhotos} />
      ) : (
        <Button onClick={GetGPSInfoFromAllPhotos}>Get GPS info from all photos</Button>
      )}
    </>
  );
};

const MainContent = () => {
  return (
    <div className="App">
      <AuthenticatedTemplate>
        <GPSInfoFromAllPhotos />
        <WeatherForecast />
        <AzureMap />
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <h5 className="card-title">
          Please sign-in to see your profile information.
        </h5>
      </UnauthenticatedTemplate>
    </div>
  );
};

export default function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <PageLayout>
        <MainContent />
      </PageLayout>
    </FluentProvider>
  );
}
