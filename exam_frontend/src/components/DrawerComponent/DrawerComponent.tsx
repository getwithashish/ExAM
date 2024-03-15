import React, { Children } from 'react';
import { Button, Drawer } from 'antd';
import CardComponent from '../AssetTable/CardComponent';
import './DrawerComponent.css'
import { DrawerProps } from './types/index';
const DrawerComponent:React.FC<DrawerProps> = ({ visible, onClose,drawerTitle ,children}) => {
  return (
    <Drawer
    
      title={drawerTitle}
      placement="bottom"
      width={200}
      height={500}
      onClose={onClose}
      visible={visible}
      className="mainDrawer"
      closeIcon={false}
      style={{ 
      padding:30,
      borderTopLeftRadius: "8%",
      borderTopRightRadius: "8%",
     }}
    >
      <h1><b>Asset Details</b></h1>
      {children}

    </Drawer>
  );
};

export default DrawerComponent;
