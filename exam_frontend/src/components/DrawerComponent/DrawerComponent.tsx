import React, { Children } from 'react';
import { Drawer } from 'antd';
import './DrawerComponent.css'
import { DrawerProps } from './types/index';
const DrawerComponent:React.FC<DrawerProps> = ({ visible, onClose,Request_Details,children}) => {
  return (
    <Drawer
    
      title={Request_Details}
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
