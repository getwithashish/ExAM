import React, { useState, useEffect } from "react";
import AssignDrawerProps from "./types";
import { Drawer } from "antd";
import type { DrawerProps } from "antd";

const AssignmentDrawer: React.FC<AssignDrawerProps> = ({
  children,
  closeAssignDrawer,
  isAssign,
}) => {
  const [size, setSize] = useState<DrawerProps["size"]>("default");

  const showAssignDrawer = () => {
    setSize("default");
  };

  useEffect(() => {
    if (isAssign) {
      showAssignDrawer();
    }
  }, [isAssign]);

  const onClose = () => {
    closeAssignDrawer();
  };

  return (
    <Drawer
      placement="right"
      size={size}
      onClose={onClose}
      open={isAssign}
      style={{ borderRadius: "10px" }}
    >
      {children}
    </Drawer>
  );
};

export default AssignmentDrawer;
