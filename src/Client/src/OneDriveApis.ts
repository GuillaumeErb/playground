import { ODataValueArray } from './ODataTypes';
import { OneDriveItem } from './OneDriveItem';

export async function getPhotosFolderItems(
  accessToken: string
): Promise<ODataValueArray<OneDriveItem>> {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append('Authorization', bearer);

  const options = {
    method: 'GET',
    headers: headers,
  };

  const response = await fetch(
    'https://graph.microsoft.com/v1.0/me/drive/root:/Photos:/children',
    //?$select=id,name,folder,location,@microsoft.graph.downloadUrl

    options
  );
  const jsonResponse = await response.json();
  return jsonResponse as ODataValueArray<OneDriveItem>;
}

export async function graphGetFolderItemsFromId(
  accessToken: string,
  folderId: string
): Promise<ODataValueArray<OneDriveItem>> {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append('Authorization', bearer);

  const options = {
    method: 'GET',
    headers: headers,
  };

  const response = await fetch(
    `https://graph.microsoft.com/v1.0/me/drive/items/${folderId}/children`,
    //?$select=id,name,folder,location,@microsoft.graph.downloadUrl
    options
  );

  const jsonResponse = await response.json();
  return jsonResponse as ODataValueArray<OneDriveItem>;
}
