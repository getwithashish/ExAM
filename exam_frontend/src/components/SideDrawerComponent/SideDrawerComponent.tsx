




import React, { useState } from 'react';
import SideDrawerProps from './types';

import { Button, Drawer, Space } from 'antd';
import type { DrawerProps } from 'antd';

const SideDrawerComponent: React.FC<SideDrawerProps> = ({children,buttonTextLarge}) => {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<DrawerProps['size']>();

  const showDefaultDrawer = () => {
    setSize('default');
    setOpen(true);
  };

  const showLargeDrawer = () => {
    setSize('large');
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Space>
        {/* <Button type="primary" onClick={showDefaultDrawer}>
        {buttonTextDefault}
        </Button> */}
        <Button  ghost style={{background:"blue"}} onClick={showLargeDrawer}>
        {buttonTextLarge}
        </Button>
      </Space>
      <Drawer
        // title={`${size} Drawer`}
        placement="right"
        size={size}
        onClose={onClose}
        open={open}
        style={{borderRadius:"10px"}}
        // extra={
        //   <Space>
        //     <Button onClick={onClose}>Cancel</Button>
        //     <Button  ghost style={{background:"blue"}} onClick={onClose}>
        //       OK
        //     </Button>
        //   </Space>
        // }
      >
          {children}
      </Drawer>
    </>
  );
};

export default SideDrawerComponent;
