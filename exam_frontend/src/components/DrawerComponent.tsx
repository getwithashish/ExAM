import React from 'react';
import { Drawer } from 'antd';
import CardComponent from './CardComponent';
import './AssetTable.css'
const DrawerComponent = ({ visible, onClose, selectedRow,title }) => {
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
      {selectedRow && (
        <div>
          <h2 className='drawerHeading'>{selectedRow.ProductName}</h2>
          <p>Asset Id: {selectedRow.AssetId}</p>
      
        </div>
      )}
      {selectedRow && <CardComponent data={selectedRow} />} {/* Render the CardComponent */}
    </Drawer>
  );
};

export default DrawerComponent;
