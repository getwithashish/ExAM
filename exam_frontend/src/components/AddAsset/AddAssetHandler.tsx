import { useState } from "react";
import { Input, Form, Select } from "antd";

const { TextArea } = Input;
const { Option } = Select;

type SizeType = Parameters<typeof Form>[0]["size"];
const [_componentSize, setComponentSize] = useState<SizeType | "default">(
  "default"
);
const onFormLayoutChange = ({ size }: { size: SizeType }) => {
  setComponentSize(size);
};
