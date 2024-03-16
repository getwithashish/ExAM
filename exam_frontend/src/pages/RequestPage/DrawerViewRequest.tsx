import { FC, useState } from 'react';
import { Drawer } from 'antd';
import type { DrawerProps } from 'antd';

interface DrawerViewRequestProps extends DrawerProps {
    title: string;
    onClose: () => void; 
}

const DrawerViewRequest: FC<DrawerViewRequestProps> = ({ title, onClose, visible, children }) => {
    const [open, setOpen] = useState<boolean>(visible);
    const handleDrawerClose = () => {
        setOpen(false);
        onClose();
    };
    return (
        <>
            <Drawer
                title={title}
                onClose={handleDrawerClose}
                visible={open}
                width={1200}
            >
                {children}
            </Drawer>
        </>
    );
};

export default DrawerViewRequest;
