
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
  