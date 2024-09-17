import React, { useState } from 'react';

import { loginRequest } from './authConfig';
import { ProfileData } from './ProfileData';

import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import './App.css';
import WeatherForecast from './WeatherForecast';
import { AzureMap } from './AzureMap';
import { PageLayout } from './PageLayout';
import { callMsGraph } from './graph';
import { Button, FluentProvider, webLightTheme } from '@fluentui/react-components';


const ProfileContent = () => {
  const { instance, accounts } = useMsal();
  const [graphData, setGraphData] = useState(null);

  function RequestProfileData() {
      // Silently acquires an access token which is then attached to a request for MS Graph data
      instance
          .acquireTokenSilent({
              ...loginRequest,
              account: accounts[0],
          })
          .then((response) => {
              callMsGraph(response.accessToken).then((response) => setGraphData(response));
          });
  }

  return (
      <>
          <h5 className="profileContent">Welcome {accounts[0].name}</h5>
          {graphData ? (
              <ProfileData graphData={graphData} />
          ) : (
              <Button onClick={RequestProfileData}>
                  Request Profile
              </Button>
          )}
      </>
  );
};

const MainContent = () => {
  return (
      <div className="App">
          <AuthenticatedTemplate>
              <ProfileContent />
              <WeatherForecast />
              <AzureMap />
          </AuthenticatedTemplate>

          <UnauthenticatedTemplate>
              <h5 className="card-title">Please sign-in to see your profile information.</h5>
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