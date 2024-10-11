import React from 'react';

import WeatherForecast from './WeatherForecast';
import { AzureMap } from './AzureMap';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { Link, Route, Routes } from 'react-router-dom';
import { OneDrivePhotosMetadata } from './OneDrivePhotosMetadata';
import { PageLayout } from './AppShell/PageLayout';
import BackdropIntegration from './BackdropIteration';

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

export default function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <Routes>
        <Route path="/" element={<PageLayout />}>
          <Route index element={<Home />} />
          <Route path="heatmap" element={<AzureMap />} />
          <Route path="photos-metadata" element={<OneDrivePhotosMetadata />} />
          <Route path="weather-forecast" element={<WeatherForecast />} />
          <Route path="backdrop-iteration" element={<BackdropIntegration />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </FluentProvider>
  );
}
