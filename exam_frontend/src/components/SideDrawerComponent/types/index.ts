import React, { ReactNode } from 'react';

interface SideDrawerProps {
  
  children: ReactNode;
  displayDrawer:boolean
  closeDrawer:()=>void
}

export default SideDrawerProps;
