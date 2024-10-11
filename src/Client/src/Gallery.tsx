import * as React from 'react';
import { Image, makeStyles } from '@fluentui/react-components';

export interface GalleryProps {
  images: { key: string; name: string; url: string }[];
}

const useStyles = makeStyles({
  gallery: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    maxWidth: '100%',
    maxHeight: '100%',
    overflowX: 'auto',
  },
  item: {
    flex: '0 0 auto',
  },
});

export const Gallery = (props: GalleryProps) => {
  const styles = useStyles();
  return (
    <div className={styles.gallery}>
      {props.images.map((image) => (
        <div key={image.key} className={styles.item}>
          <Image
            key={image.key}
            alt={image.name}
            src={image.url}
            loading="lazy"
            fit="default"
            width={'200px'}
            height={'200px'}
            block={true}
            bordered={true}
            shape="rounded"
          />
        </div>
      ))}
    </div>
  );
};
