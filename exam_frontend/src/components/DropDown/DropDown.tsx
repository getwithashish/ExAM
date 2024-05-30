import React, { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Button, Menu } from 'antd';

interface DropDownProps {
  onSelect: (key: string) => void;
  items?: { label: string; key: string; icon?: React.ReactNode }[];
  buttonLabel?: string;
}

const DropDown: React.FC<DropDownProps> = ({ onSelect, items = [], buttonLabel = "Submit" }) => {
  const [loadings, setLoadings] = useState<boolean[]>([]);

  const enterLoading = (index: number) => {
    setLoadings((state) => {
      const newLoadings = [...state];
      newLoadings[index] = true;
      return newLoadings;
    });

    setTimeout(() => {
      setLoadings((state) => {
        const newLoadings = [...state];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 6000);
  };

  const menuItems = items.map(item => ({
    key: item.key,
    label: (
      <span onClick={() => onSelect(item.key)}>
        {item.icon}
        {item.label}
      </span>
    ),
    icon: item.icon,
  }));

  return (
    <Dropdown menu={{ items: menuItems }}>
      <Button
        icon={<DownOutlined />}
        style={{
          borderRadius: '7px',
          border: '1px solid #d9d9d9',
          background: '#1677ff',
          color: 'white',
          height: '41px',
        }}
        loading={loadings[0]}
        onClick={() => enterLoading(0)}
      >
        {buttonLabel}
      </Button>
    </Dropdown>
  );
};

export default DropDown;
