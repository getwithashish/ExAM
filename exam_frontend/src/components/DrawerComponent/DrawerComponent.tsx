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
      height={500}
      onClose={onClose}
      visible={visible}
      className="mainDrawer"
      style={{ 
      // borderRadius: 40,
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
