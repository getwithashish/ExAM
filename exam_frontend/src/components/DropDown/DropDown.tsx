import React, { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Button, Menu } from 'antd';
 
interface DropDownProps {
  onSelect: (key: string) => void;
  items?: { label: string; key: string; icon?: React.ReactNode }[];
  buttonLabel?: string;
  menu: JSX.Element; // Define menu as a prop
}

const DropDown: React.FC<DropDownProps> = ({ menu, onSelect, buttonLabel = "Submit" }) => {
 
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
 
  const menu = (
    <Menu>
      {items.map((item) => (
        <Menu.Item key={item.key} onClick={() => onSelect(item.key)} icon={item.icon}>
          {item.label}
        </Menu.Item>
      ))}
    </Menu>
  );
 
  return (
    <Dropdown overlay={menu}>
      <Button icon={<DownOutlined />} style={{ borderRadius: '7px', border: '1px solid #d9d9d9', background: '#1677ff', color: 'white', height: '41px' }} onClick={() => enterLoading(1)}>
        {buttonLabel}
      </Button>
    </Dropdown>
  );
};
 
export default DropDown;