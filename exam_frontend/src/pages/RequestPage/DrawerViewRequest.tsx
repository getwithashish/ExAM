import { FC } from "react";
import { Drawer } from "antd";
import type { DrawerProps } from "antd";
import { ConfigProvider, theme } from "antd";
interface DrawerViewRequestProps extends DrawerProps {
  title?: string;
  onClose?: () => void;
  selectedRow?: any;
  drawerTitle?: string;
  onUpdateData?: (updatedData: { key: any }) => void;
  closeIcon?: JSX.Element;
  destroyOnClose?: boolean;
}

const { darkAlgorithm } = theme;

const customTheme = {
  algorithm: darkAlgorithm,
  components: {
    Drawer: {
      colorBgElevated: "#161B21",
      colorText: "#FFFFFF",
    },
  },
};

const DrawerViewRequest: FC<DrawerViewRequestProps> = ({
  open,
  title,
  onClose,
  children,
  destroyOnClose = false
}) => {
  return (
    <ConfigProvider theme={customTheme}>
      <div>
        <Drawer destroyOnClose={destroyOnClose} title={title} onClose={onClose} open={open} width={1200}>
          {children}
        </Drawer>
      </div>
    </ConfigProvider>
  );
};

export default DrawerViewRequest;
