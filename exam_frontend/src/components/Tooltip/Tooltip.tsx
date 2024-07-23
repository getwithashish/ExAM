import React from "react";
import { Tooltip } from "@mui/material";
import Zoom from "@mui/material/Zoom";
import { TooltipProps } from "./types/types";


const ToolTip: React.FC<TooltipProps> = ({ title, children }) => (
  <Tooltip
    title={title}
    placement="top"
    TransitionComponent={Zoom}
    disableInteractive
  >
    {children}
  </Tooltip>
);

export default ToolTip;
