import * as React from 'react';
import { Image } from '@fluentui/react-components';

export interface GalleryProps {
  images: { key: string; name: string; url: string }[];
}

export const Gallery = (props: GalleryProps) => (
  <div
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      maxWidth: '100%',
      maxHeight: '100%',
      overflowX: 'auto',
    }}
  >
    {props.images.map((image) => (
      <div
        key={image.key}
        style={{
          flex: '0 0 auto',
        }}
      >
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
