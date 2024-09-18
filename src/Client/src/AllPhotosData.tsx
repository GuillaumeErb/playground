import { Photo } from 'OneDriveItem';
import React from 'react';
/**
 * Renders information about the user obtained from MS Graph
 * @param props
 */

export interface AllPhotosProps {
  allPhotos: Photo[];
}

export const AllPhotosData = (props: AllPhotosProps) => {
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
