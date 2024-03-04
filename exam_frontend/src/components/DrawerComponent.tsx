import React, { Children } from 'react';
import { Button, Drawer } from 'antd';
import CardComponent from './CardComponent';
import './DrawerComponent.css'

import { DataType } from './AssetTable';
interface DrawerProps {
  visible: boolean;
  onClose: () => void;
  selectedRow: DataType | null;
  title: string;
  button: React.ReactNode;
  children:string;
}
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
      style={{ background: "offwhite",
      borderRadius: 40,
      padding:30,
      
      
     }}
    >
      
      {children}

    </Drawer>
  );
};

export default DrawerComponent;
