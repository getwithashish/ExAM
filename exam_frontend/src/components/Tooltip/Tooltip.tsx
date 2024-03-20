import React from 'react';
import TooltipProps from './types/index';
import { Tooltip } from 'antd';
import styles from './Tooltip.module.css';

const ToolTip: React.FC<TooltipProps> = ({ title, children }) => (
  <Tooltip
    title={title}
    overlayClassName={styles['antTooltipInner']} // Correctly pass overlayClassName
  >
    {children}
  </Tooltip>
);

export default ToolTip;
