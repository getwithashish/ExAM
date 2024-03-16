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
      width={100}
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
      <div className='fixed-header'>
      <h1><b>Asset Details</b></h1>
      </div>
      {children}

    </Drawer>
  );
};

export default DrawerComponent;
