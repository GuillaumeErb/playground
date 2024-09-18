import React from 'react';
/**
 * Renders information about the user obtained from MS Graph
 * @param props
 */

export interface OneDriveDataProps {
  graphData: {
    id: string;
    driveType: string;
    code: string;
    message: string;
  };
}

export const OneDriveData = (props: OneDriveDataProps) => {
  return (
    <div id="profile-div">
      <p>
        <strong>Id: </strong> {props.graphData.id}
      </p>
      <p>
        <strong>Drive type: </strong> {props.graphData.driveType}
      </p>
      <p>
        <strong>Code: </strong> {props.graphData.code}
      </p>
      <p>
        <strong>Message: </strong> {props.graphData.message}
      </p>
    </div>
  );
};
