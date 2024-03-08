import React, { useState ,useEffect} from 'react';
import SideDrawerProps from './types';
import { Button, Drawer, Space } from 'antd';
import type { DrawerProps } from 'antd';

const AssignmentDrawer: React.FC<SideDrawerProps> = ({children, buttonTextDefault,displayDrawer}) => {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<DrawerProps['size']>();

  const showDefaultDrawer = () => {
    setSize('default');
    setOpen(true);
  };

 
  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if(displayDrawer)
    showDefaultDrawer();
    
  }, []);

  return (
    <>
      <Space>
        <Button type="primary" ghost onClick={showDefaultDrawer}>
        {buttonTextDefault}
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
      //     <Space>
      //       <Button onClick={onClose}>Cancel</Button>
      //       <Button  ghost style={{background:"blue"}} onClick={onClose}>
      //         OK
      //       </Button>
      //     </Space>
      //   }
      >
          {children}
      </Drawer>
    </>
  );
};

export default AssignmentDrawer;
