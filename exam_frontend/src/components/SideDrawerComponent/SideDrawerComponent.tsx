import React, { useState, useEffect } from "react";
import SideDrawerProps from "./types";
import { Button, Drawer, Space } from "antd";
import type { DrawerProps } from "antd";

const SideDrawerComponent: React.FC<SideDrawerProps> = ({
  children,
  displayDrawer,
  closeDrawer,
}) => {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<DrawerProps["size"]>();

  const showDefaultDrawer = () => {
    setSize("default");
    setOpen(true);
  };

  useEffect(() => {
    // Call showLargeDrawer function when displayDrawer is true
    if (displayDrawer) {
      showLargeDrawer();
    }
  }, [displayDrawer]);

  const showLargeDrawer = () => {
    setSize("large");
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    closeDrawer();
  };

  return (
    <>
      <Space></Space>
      <Drawer
        placement="right"
        size={size}
        onClose={onClose}
        open={open}
        style={{
          borderTopLeftRadius: "5px",
          borderBottomLeftRadius: "5px",
        }}
      >
        {children}
      </Drawer>
    </>
  );
};

export default SideDrawerComponent;
