import * as React from 'react';
import {
  Hamburger,
  NavDrawer,
  NavDrawerBody,
  NavDrawerHeader,
  NavItem,
} from '@fluentui/react-nav-preview';

import { Tooltip, makeStyles, tokens } from '@fluentui/react-components';
import {
  bundleIcon,
  MountainLocationBottom20Filled,
  MountainLocationBottom20Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  root: {
    display: 'flex', // ensures side-by-side layout
    height: '100vh', // full height
    overflow: 'hidden', // prevents overflow
  },
  drawer: {
    width: '250px', // fixed width for the drawer
    flexShrink: 0, // prevents the drawer from shrinking
  },
  content: {
    flex: '1', // allows the content to take up remaining space
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

export const Navigation = () => {
  const styles = useStyles();

  const [isOpen, setIsOpen] = React.useState(true);

  const renderHamburger = () => {
    return <Hamburger onClick={() => setIsOpen(!isOpen)} />;
  };

  if (!isOpen) {
    return renderHamburger();
  }

  return (
    <div className={styles.root}>
      <NavDrawer defaultSelectedValue="1" open={isOpen}>
        <NavDrawerHeader>{renderHamburger()}</NavDrawerHeader>

        <NavDrawerBody>
          <NavItem icon={<MountainLocationBottom />} value="1">
            Image Map
          </NavItem>
        </NavDrawerBody>
      </NavDrawer>
    </div>
  );
};
