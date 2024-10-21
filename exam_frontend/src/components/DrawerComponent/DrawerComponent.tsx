import React, { Children } from "react";
import { Button, Drawer } from "antd";

import "./DrawerComponent.css";
import { DrawerProps } from "./types/index";
const DrawerComponent: React.FC<DrawerProps> = ({
  visible,
  onClose,
  drawerTitle,
  children,
}) => {
  return (
    <Drawer
      // title={drawerTitle}
      placement="bottom"
      // width={100}
      height={500}
      onClose={onClose}
      visible={visible}
      className="mainDrawer"
      closeIcon={false}
      style={{
        padding: 30,
        borderTopLeftRadius: "5%",
        borderTopRightRadius: "5%",
        borderBottomLeftRadius: "0%",
        borderBottomRightRadius: "0%",
        marginBottom: "0px",
      }}
    >
      <div className="fixed-header font-display">
        <h1
          style={{ fontSize: "24px", textAlign: "center", marginBottom: "0px" }}
        >
          Asset Details
        </h1>{" "}
      </div>
      {children}
    </Drawer>
  );
};

export default DrawerComponent;
