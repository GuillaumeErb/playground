//https://learn.microsoft.com/en-us/onedrive/developer/rest-api/resources/driveitem?view=odsp-graph-online
export interface OneDriveItem {
  id: string;
  name: string;
  folder?: OneDriveFolder;
  location?: OneDriveGeoCoordinates;
  '@microsoft.graph.downloadUrl'?: string;
}

export interface OneDriveFolder {
  childCount: number;
}

export interface OneDriveGeoCoordinates {
  altitude: number;
  latitude: number;
  longitude: number;
}

export interface FolderContent {
  folders: OneDriveItem[];
  otherItems: OneDriveItem[];
}

export const splitPhotosAndFolders = (items: OneDriveItem[]): FolderContent => {
  const otherItems: OneDriveItem[] = [];
  const folders: OneDriveItem[] = [];
  for (const item of items) {
    if (item.folder !== undefined) {
      folders.push(item);
    } else {
      otherItems.push(item);
    }
  }
  return { folders, otherItems };
};
