import React, { ReactNode } from 'react';

interface SideDrawerProps {
  buttonTextLarge: string;
  children: ReactNode;
  displayDrawer:boolean
  closeDrawer:()=>void
}

export default SideDrawerProps;
