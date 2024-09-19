export async function getPhotosFolderItems(accessToken: string) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append('Authorization', bearer);

  const options = {
    method: 'GET',
    headers: headers,
  };

  const response = await fetch(
    'https://graph.microsoft.com/v1.0/me/drive/root:/Photos:/children',
    options
  );
  return await response.json();
}

export async function graphGetFolderItemsFromId(
  accessToken: string,
  folderId: string
) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append('Authorization', bearer);

  const options = {
    method: 'GET',
    headers: headers,
  };

  const response = await fetch(
    `https://graph.microsoft.com/v1.0/me/drive/items/${folderId}/children`,
    options
  );
  return await response.json();
}
