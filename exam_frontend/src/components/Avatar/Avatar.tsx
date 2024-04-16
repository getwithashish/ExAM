import React from "react";
import { UserOutlined } from "@ant-design/icons";

import { Avatar, Space } from "antd";

const Avatars: React.FC = () => (
  <Space direction="vertical" size={16}>
    <Space wrap size={16}>
      <Avatar
        size={47}
        icon={<UserOutlined />}
        style={{ backgroundColor: "rgb(22, 119, 255)" }}
      />
    </Space>
  </Space>
);

export default Avatars;
