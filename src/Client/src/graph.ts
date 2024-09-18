import { graphConfig } from './authConfig';

export async function getPhotosFolderItems(accessToken: string) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append('Authorization', bearer);

  const options = {
    method: 'GET',
    headers: headers,
  };

  return fetch(graphConfig.graphOneDrivePhotosFolderChildrenEndpoint, options)
    .then((response) => {
      return response.json();
    })
    .catch((error) => console.log(error));
}

export async function graphGetFolderItemsFromId(accessToken: string, folderId: string) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;
  
    headers.append('Authorization', bearer);
  
    const options = {
      method: 'GET',
      headers: headers,
    };

    const endpoint = graphConfig.graphOneDriveFolderIdChildrenEndpoint.replace('{folderId}', folderId);
    console.warn('graphGetFolderItemsFromId', endpoint);

    return fetch(endpoint, options)
      .then((response) => {
        return response.json();
      })
      .catch((error) => console.log(error));
  }
