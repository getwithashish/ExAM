import { FC } from "react";
import { Drawer } from "antd";
import type { DrawerProps } from "antd";
import { theme } from "antd";
interface DrawerViewRequestProps extends DrawerProps {
  title?: string;
  onClose?: () => void;
  selectedRow?: any;
  drawerTitle?: string;
  onUpdateData?: (updatedData: { key: any }) => void;
  closeIcon?: JSX.Element;
  destroyOnClose?: boolean;
}

const DrawerViewRequest: FC<DrawerViewRequestProps> = ({
  open,
  title,
  onClose,
  children,
  destroyOnClose = false,
}) => {
  return (
    <div>
      <Drawer
        destroyOnClose={destroyOnClose}
        title={title}
        onClose={onClose}
        open={open}
        width={1200}
      >
        {children}
      </Drawer>
    </div>
  );
};

export default DrawerViewRequest;
