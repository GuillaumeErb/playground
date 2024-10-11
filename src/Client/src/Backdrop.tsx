import {
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerHeader,
  makeStyles,
} from '@fluentui/react-components';
import React from 'react';
import GrabHandle from './GrabHandle';

const useStyles = makeStyles({
  headerRoot: {
    display: 'flex',
    padding: '0px',
    margin: '0px',
    gap: '5px',
  },
  headerTitle: {
    margin: '0px auto',
  },
  grabHandle: {
    margin: '5px auto',
  },
  swipeArea: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 'auto',
    right: 0,
  },
});

const SwipeArea = () => {
  const styles = useStyles();
  return <div className={styles.swipeArea} />;
};

type BackdropProps = {
  title: string;
  minimized: string;
};

const Backdrop = (props: BackdropProps) => {
  const styles = useStyles();

  const [open, setOpen] = React.useState(true);

  return (
    <>
      <SwipeArea />
      <Button onClick={() => setOpen(!open)}>Toggle</Button>
      <Drawer open={open} type="inline" position="bottom" separator>
        <DrawerHeader className={styles.headerRoot}>
          <GrabHandle className={styles.grabHandle} />
          <div className={styles.headerTitle}> {props.title}</div>
          <Divider />
        </DrawerHeader>
        <DrawerBody>
          <>
            <>{props.minimized}</>
            <br />
            <>{'Derp'}</>
          </>
        </DrawerBody>
      </Drawer>
    </>
  );
};

export default Backdrop;
