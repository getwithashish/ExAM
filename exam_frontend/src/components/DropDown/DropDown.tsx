import React, { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Button, MenuProps } from 'antd';

interface DropDownProps {
  onSelect: (key: string) => void;
  items?: { label: string; key: string; icon?: React.ReactNode }[];
  buttonLabel?: React.ReactNode;
  disabled?: boolean;
}

const DropDown: React.FC<DropDownProps> = ({ 
  onSelect, 
  items = [], 
  buttonLabel = "Submit",
  disabled = false
}) => {
  const [loading, setLoading] = useState(false);

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setLoading(true);
    onSelect(e.key);
    setTimeout(() => {
      setLoading(false);
    }, 6000);
  };

  const menuItems = items.map(item => ({
    key: item.key,
    label: item.label,
    icon: item.icon,
  }));

  const menuProps = {
    items: menuItems,
    onClick: handleMenuClick,
  };

  return (
    <Dropdown menu={menuProps} disabled={disabled}>
      <Button
        style={{
          borderRadius: '7px',
          border: '1px solid #d9d9d9',
          background: '#1677ff',
          color: 'white',
          height: '41px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        
        disabled={disabled}
      >
        <span style={{ marginRight: '8px' }}>{buttonLabel}</span>
        <DownOutlined />
      </Button>
    </Dropdown>
  );
};

export default DropDown;