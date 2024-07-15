import React from "react";
import TooltipProps from "./types/index";
import { Tooltip } from "@mui/material";
import Zoom from "@mui/material/Zoom";
// import { Tooltip } from "antd";

const ToolTip: React.FC<TooltipProps> = ({ title, children }) => (
  <Tooltip
    title={title}
    // disableInteractive
    placement="top"
    TransitionComponent={Zoom}
  >
    {children}
  </Tooltip>
);

export default ToolTip;
