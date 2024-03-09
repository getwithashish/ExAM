import React, { useState } from 'react';
import {
  Button,
  DatePicker,
  Input,
  Form,
  InputNumber,
  Select,

} from 'antd';


const { TextArea } = Input;
import styles from './AddAsset.module.css';
const { Option } = Select;

type SizeType = Parameters<typeof Form>[0]['size'];
const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default');
const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };