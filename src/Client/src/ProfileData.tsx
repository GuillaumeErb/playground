import React from 'react';
/**
 * Renders information about the user obtained from MS Graph
 * @param props
 */

export interface PhotoInfo {
  id: string;
  name: string;
  location?: {
    altitude?: number;
    latitude?: number;
    longitude?: number;
  };
}

export interface ProfileDataProps {
  graphData: {
    value: PhotoInfo[] | undefined;
    folder: any | undefined;
  };
}

export const ProfileData = (props: ProfileDataProps) => {
  return (
    <div id="profile-div">
      <h5>Photos</h5>
      {props.graphData.value?.map((photo: PhotoInfo, index: number) => {
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
