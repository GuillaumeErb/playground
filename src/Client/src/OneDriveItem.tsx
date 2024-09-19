export interface OneDriveItem {
  id: string;
  name: string;
  folder: any;
}

export interface Folder extends OneDriveItem {
  childCount: number | undefined;
}

export interface Photo {
  id: string;
  name: string;
  location?: {
    altitude?: number;
    latitude?: number;
    longitude?: number;
  };
}

export function isFolderItem(item: OneDriveItem): item is Folder {
  return item.folder;
}

export type FolderContents = { photos: Photo[]; folders: Folder[] };

