import { FC, useState } from 'react';
import { Drawer } from 'antd';
import type { DrawerProps } from 'antd';

interface DrawerViewRequestProps extends DrawerProps {
    title: string;
    onClose: () => void; 
}

const DrawerViewRequest: FC<DrawerViewRequestProps> = ({open, title, onClose, children }) => {
    
    return (
        <>
            <Drawer
                title={title}
                onClose={onClose}
                open={open}
                width={1200}
            >
                {children}
            </Drawer>
        </>
    );
};

export default DrawerViewRequest;
