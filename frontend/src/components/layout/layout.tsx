import React from 'react';
import { AppShell } from '@mantine/core';
import { HeaderMenu } from './header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <AppShell
    >
      <HeaderMenu />
      {children}
    </AppShell>
  )
};

export default Layout;



