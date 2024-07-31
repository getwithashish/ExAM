import React, { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { ConfigProvider, Dropdown, Button, MenuProps } from 'antd';

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

  const customTheme = {
    components: {
      Button: {
        colorPrimary: '#161b21',
        colorPrimaryHover: '#1e2329',
        colorPrimaryActive: '#0e1114',
        colorText: '#ffffff',
      },
      Dropdown: {
        colorBgElevated: '#161b21',
        colorText: '#ffffff',
      },
    },
  };

  return (
    <ConfigProvider theme={customTheme}>
      <Dropdown 
        menu={menuProps} 
        disabled={disabled}
        dropdownRender={(menu) => (
          <div style={{ backgroundColor: '#161b21', color: 'white' }}>
            {React.cloneElement(menu as React.ReactElement, {
              style: { backgroundColor: '#161b21' },
            })}
          </div>
        )}
      >
        <Button
          style={{
            borderRadius: '7px',
            border: 'none',
            background: '#1677ff',
            color: 'white',
            height: '41px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'none',
          }}
          disabled={disabled}
        >
          <span style={{ marginRight: '8px' }}>{buttonLabel}</span>
          <DownOutlined />
        </Button>
      </Dropdown>
    </ConfigProvider>
  );
};

export default DropDown;