import { FC } from "react";
import { Drawer } from "antd";
import type { DrawerProps} from "antd";

interface DrawerViewRequestProps extends DrawerProps {
  title?: string;
  onClose?: () => void;
  selectedRow?: any;
  drawerTitle?: string;
  onUpdateData?: (updatedData: { key: any }) => void;
  closeIcon?: JSX.Element;
}

const DrawerViewRequest: FC<DrawerViewRequestProps> = ({
  open,
  title,
  onClose,
  children,
}) => {
  return (
    <>
      <Drawer
        destroyOnClose={true}
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
