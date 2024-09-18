import React from 'react';
import { TopBar } from './TopBar';

export interface PageLayoutProps {
  children: React.ReactNode;
}

export const PageLayout = (props: PageLayoutProps) => {
  return (
    <>
      <TopBar />
      <br />
      <br />
      {props.children}
    </>
  );
};
