import React from 'react';
import TooltipProps from './types/index';
import { Tooltip } from 'antd';


const ToolTip: React.FC<TooltipProps> = ({ title, children }) => (
  <Tooltip
    title={title}
   
  >
    {children}
  </Tooltip>
);

export default ToolTip;
