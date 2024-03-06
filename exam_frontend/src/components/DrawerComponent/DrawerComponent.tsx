import React, { Children } from 'react';
import { Button, Drawer } from 'antd';
import CardComponent from '../AssetTable/CardComponent';
import './DrawerComponent.css'
import { DrawerProps } from './types/index';
const DrawerComponent:React.FC<DrawerProps> = ({ visible, onClose,title ,children}) => {
  return (
    <Drawer
    
      title={title}
      placement="bottom"
      width={200}
      height={600}
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
      
      {children}

    </Drawer>
  );
};

export default DrawerComponent;
