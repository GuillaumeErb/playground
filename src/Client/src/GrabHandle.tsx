import { makeStyles, mergeClasses } from '@fluentui/react-components';
import React from 'react';

const useStyles = makeStyles({
  root: {
    width: '40px',
    height: '5px',
    backgroundColor: '#ccc',
    borderRadius: '5px',
    margin: '10px auto',
    cursor: 'pointer',
  },
});

const GrabHandle = (props: React.HTMLProps<HTMLDivElement>) => {
  const styles = useStyles();
  return (
    <div
      {...{ props, className: undefined }}
      className={mergeClasses(styles.root, props.className)}
      //onTouchStart={handleTouchStart}
      //onTouchMove={handleTouchMove}
      //onClick={() => setIsOpen(!isOpen)} // Toggle open/close on click
    />
  );
};

export default GrabHandle;
