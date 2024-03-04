
//AddAsset.tsx

import React, { useState } from 'react';
import {
  Button,
  Cascader,
  DatePicker,
  Input,
  Form,
  InputNumber,
  Select,
  TimePicker,
  Switch,
  TreeSelect,
} from 'antd';
const { TextArea } = Input;
import styles from './AddAsset.module.css';

const { Option } = Select;

type SizeType = Parameters<typeof Form>[0]['size'];

const AddAsset: React.FC = () => {
  const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default');

  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };

  return (
    <div className={styles['container']}>
      <h1 className={styles['heading']}>Add an asset</h1>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        initialValues={{ size: componentSize }}
        onValuesChange={onFormLayoutChange}
        size={componentSize as SizeType}
        className={styles['formContainer']} // Apply CSS module class
        
      >



        <Form.Item label="Category"  className={styles['formItem']}>
          <Select className={styles['input']} placeholder="Select asset category">
            <Option value="Hardware">Hardware</Option>
            <Option value="Software">Software</Option>
          </Select>
        </Form.Item>



        <Form.Item label="Asset ID" className={styles['formItem']}>
        <Input placeholder="Enter Asset ID"className={styles['input']} />
        </Form.Item>

        <Form.Item label="Version" className={styles['formItem']}>
        <InputNumber className={styles['input']}  placeholder="Enter version number" />
        </Form.Item>


        <Form.Item label="Asset Type" className={styles['formItem']}>
          <Select className={styles['input']}  placeholder="Select asset type">
            <Option value="laptops">Laptop</Option>
            <Option value="desktop">Desktop</Option>
            <Option value="monitors">Monitors</Option>
            <Option value="routers">Routers</Option>
            <Option value="vs code">VS code</Option>
            <Option value="cables">Cables</Option>
          </Select>
        </Form.Item>


        <Form.Item label="Product name" className={styles['formItem']}>
        <Input placeholder="Enter Product name"className={styles['input']} />
        </Form.Item>


        <Form.Item label="Model number" className={styles['formItem']}>
        <Input placeholder="Enter Model number"className={styles['input']} />
        </Form.Item>


        <Form.Item label="Serial Number" className={styles['formItem']}>
        <Input placeholder="Enter serial number"className={styles['input']} />
        </Form.Item>


        
        <Form.Item label="Owner"  className={styles['formItem']}>
          <Select className={styles['input']} placeholder="Select owner">
            <Option value="experion">EXPERION</Option>
           </Select>
        </Form.Item>


        <Form.Item label="Custodian name:" className={styles['formItem']}>
          <Select className={styles['input']}  placeholder="Select custodian name">
            <Option value="Ashish">Ashish</Option>
            <Option value="Aidrin">Aidrin</Option>
            <Option value="Asima">Asima</Option>
            <Option value="Ananthakrishnan">Anandhu</Option>
            <Option value="Pavithra">Pavithra</Option>
        </Select>
        </Form.Item>



        <Form.Item label="Enter purchase Date:" className={styles['formItem']}>
          <DatePicker className={styles['input']}  placeholder="Enter purchase date"/>
        </Form.Item>


        <Form.Item label="Enter warranty Period:" className={styles['formItem']}>
        <InputNumber className={styles['input']}  placeholder="Enter warranty period" />
        </Form.Item>


        <Form.Item label="Product location:" className={styles['formItem']}>
          <Select className={styles['input']}  placeholder="Select product location">
            <Option value="trivandrum">Trivandrum</Option>
            <Option value="kochi">Kochi</Option>
            <Option value="bangalore">Bangalore</Option>
          </Select>
        </Form.Item>


        <Form.Item label="Invoice location:" className={styles['formItem']}>
          <Select className={styles['input']}  placeholder="Select invoice location">
            <Option value="Trivandrum">Laptop</Option>
            <Option value="Kochi">Desktop</Option>
            <Option value="Bangalore">Monitors</Option>
          </Select>
        </Form.Item>


        <Form.Item label="Business Unit:" className={styles['formItem']}>
          <Select className={styles['input']}  placeholder="Select business unit">
            <Option value="du1">DU1</Option>
            <Option value="du2">DU2</Option>
          </Select>
        </Form.Item>


        <Form.Item label="OS:" className={styles['formItem']}>
          <Select className={styles['input']}  placeholder="Select OS">
            <Option value="windows">Windows</Option>
            <Option value="mac">Mac</Option>
            <Option value="linux">Linux</Option>
            <Option value="debian">Debian</Option>
            <Option value="ubuntu">Ubuntu</Option>
          </Select>
        </Form.Item>


        <Form.Item label="OS version" className={styles['formItem']}>
        <Input placeholder="Enter OS version"className={styles['input']} />
        </Form.Item>



        <Form.Item label=" Mobile OS:" className={styles['formItem']}>
          <Select className={styles['input']}  placeholder="Select mobile OS">
            <Option value="android">Android</Option>
            <Option value="mac">Mac</Option>
          </Select>
        </Form.Item>


        <Form.Item label="Processor:" className={styles['formItem']}>
        <InputNumber className={styles['input']}  placeholder="Enter processor" />
        </Form.Item>

        {/* <Form.Item label="Processor Generation:" className={`text-wrap ${styles['formItem']}`}>
        <InputNumber className={styles['input']}  placeholder="Enter processor generation" />
        </Form.Item> */}

        
        <Form.Item label="Processor Generation" className={styles['formItem']}>
        <Input placeholder="Enter processor generation"className={styles['input']} />
        </Form.Item>
      

        <Form.Item label=" Memory:" className={styles['formItem']}>
          <Select className={styles['input']}  placeholder="Select memory">
            <Option value="8GB">8gb</Option>
            <Option value="16GB">16gb</Option>
            <Option value="32GB">32gb</Option>
            <Option value="64GB">64gb</Option>
          </Select>
        </Form.Item>


        
        <Form.Item label="Storage:" className={styles['formItem']}>
        <InputNumber className={styles['input']}  placeholder="Enter storage" />
        </Form.Item>


        
        <Form.Item label="Configuration:" className={styles['formItem']}>
        <InputNumber className={styles['input']}  placeholder="Enter configuration" />
        </Form.Item>

        
        <Form.Item label="Accessory/s:" className={styles['formItem']}>
        <InputNumber className={styles['input']}  placeholder="Enter accessories" />
        </Form.Item>

        <Form.Item label="Status:" className={styles['formItem']}>
          <Select className={styles['input']} defaultValue="in store" placeholder="Select Approval">
            <Option value="in store">IN-STORE</Option>
            <Option value=" in use">IN-USE</Option>
            <Option value="in repair">IN-REPAIR</Option>
            <Option value="expired">EXPIRED</Option>
            <Option value="disposed">DISPOSED</Option>
          </Select>
        </Form.Item>
    


        <Form.Item label="Note/s" className={styles['formItem']}>
          <TextArea rows={4}  className={styles['input']}  placeholder="Enter any note/comment" />
        </Form.Item>



        <Form.Item label=" Conceder:" className={styles['formItem']}>
          <Select className={styles['input']}  placeholder="Select Conceder name">
            <Option value="sukesh">Sukesh</Option>
            <Option value="mehtab">Mehtab</Option>
           
          </Select>
        </Form.Item>



        <Form.Item label="Approval Status:" className={styles['formItem']}>
          <Select className={styles['input']}  placeholder="Select Approval">
            <Option value="approved">APPROVED</Option>
            <Option value="pending">PENDING</Option>
            <Option value="rejected">REJECTED</Option>
            <Option value="cancelled">CANCELLED</Option>
          </Select>
        </Form.Item>


        <Form.Item label="Message" className={styles['formItem']}>
        <Input placeholder="Enter message"className={styles['input']} />
        </Form.Item>

      
         <Form.Item >
          <Button  className={styles['button']} >Submit</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddAsset;



//real code -------

