import * as React from 'react';
import {
  Hamburger,
  NavDrawer,
  NavDrawerBody,
  NavDrawerHeader,
  NavItem,
  NavItemValue,
} from '@fluentui/react-nav-preview';

import { makeStyles, tokens } from '@fluentui/react-components';
import {
  bundleIcon,
  ImageGlobe20Filled,
  ImageGlobe20Regular,
  MountainLocationBottom20Filled,
  MountainLocationBottom20Regular,
  WeatherPartlyCloudyDay20Filled,
  WeatherPartlyCloudyDay20Regular,
  Wrench20Filled,
  Wrench20Regular,
} from '@fluentui/react-icons';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
  },
  drawer: {
    width: '250px',
    flexShrink: 0,
  },
  content: {
    flex: '1',
    padding: '16px',
    display: 'grid',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  field: {
    display: 'flex',
    marginTop: '4px',
    marginLeft: '8px',
    flexDirection: 'column',
    gridRowGap: tokens.spacingVerticalS,
  },
});

const MountainLocationBottom = bundleIcon(
  MountainLocationBottom20Regular,
  MountainLocationBottom20Filled
);

const WeatherPartlyCloudyDay = bundleIcon(
  WeatherPartlyCloudyDay20Regular,
  WeatherPartlyCloudyDay20Filled
);

const Wrench = bundleIcon(Wrench20Regular, Wrench20Filled);

const ImageGlobe = bundleIcon(ImageGlobe20Regular, ImageGlobe20Filled);

export const Navigation = () => {
  const styles = useStyles();

  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] =
    React.useState('backdrop-iteration');
  const navigate = useNavigate();

  const renderHamburger = () => {
    return <Hamburger onClick={() => setIsOpen(!isOpen)} />;
  };

  if (!isOpen) {
    return renderHamburger();
  }

  return (
    <div className={styles.root}>
      <NavDrawer
        open={isOpen}
        onNavItemSelect={(_: NavItemValue, categoryValue?: NavItemValue) => {
          const newSelectedValue = (categoryValue as { value: string }).value;
          setSelectedValue(newSelectedValue);
          navigate(newSelectedValue);
          setIsOpen(false);
        }}
        selectedValue={selectedValue}
      >
        <NavDrawerHeader>{renderHamburger()}</NavDrawerHeader>

        <NavDrawerBody>
          <NavItem icon={<MountainLocationBottom />} value="heatmap">
            Image Map
          </NavItem>
          <NavItem icon={<ImageGlobe />} value="photos-metadata">
            Photos Metadata
          </NavItem>
          <NavItem icon={<WeatherPartlyCloudyDay />} value="weather-forecast">
            Weather Forecast
          </NavItem>
          <NavItem icon={<Wrench />} value="backdrop-iteration">
            Backdrop Iteration
          </NavItem>
        </NavDrawerBody>
      </NavDrawer>
    </div>
  );
};
