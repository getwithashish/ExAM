import React, { useState , useEffect } from 'react';
import SideDrawerProps from './types';
import { Drawer, Space } from 'antd';
import type { DrawerProps } from 'antd';

const SideDrawerComponent: React.FC<SideDrawerProps> = ({children,displayDrawer,closeDrawer}) => {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<DrawerProps['size']>();

  const showDefaultDrawer = () => {
    setSize('default');
    setOpen(true);
  };

  useEffect(() => {
    if (displayDrawer) {
      showLargeDrawer();
    }
  }, [displayDrawer]);


  const showLargeDrawer = () => {
    setSize('large');
    setOpen(true);

  };

  const onClose = () => {
    setOpen(false);
    closeDrawer()
  };

  return (
    <>
      <Space/>   
      <Drawer        
        placement="right"
        size={size}
        onClose={onClose}
        open={open}
        style={{borderRadius:"10px"}}      
      >
          {children}
      </Drawer>
    </>
  );
};

export default SideDrawerComponent;
