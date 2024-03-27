
 
 
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { message } from 'antd';
 
import axiosInstance from '../../config/AxiosConfig';
import { AssetData } from './types';
import {
  Button,
  DatePicker,
  Input,
  Form,
  InputNumber,
  Select,
} from 'antd';
import dayjs from 'dayjs';
const { TextArea } = Input;
import styles from './AddAsset.module.css';
 
const { Option } = Select;
 
type SizeType = Parameters<typeof Form>[0]['size'];
 
const AddAsset: React.FC = () => {
  // State to store form data
  const [formData, setFormData] = useState<any>({});
 
  const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default');
 
  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };
 
  // Handle form input change and update form data state
  const handleInputChange = (key: string, value: any) => {
    setFormData({ ...formData, [key]: value });
  };
 
 
    // Fetch the asset type details
  const { data: assetTypeData, isLoading: isAssetTypeLoading, isError: isAssetTypeError } = useQuery({
    queryKey: ['assetType'],
    queryFn: () => axiosInstance.get('/asset/asset_type').then((res) => res.data.data),
  });
 
  // Fetch memory space options
  const { data: memoryData, isLoading: isMemoryLoading, isError: isMemoryError } = useQuery({
    queryKey: ['memorySpace'],
    queryFn: () => axiosInstance.get('/asset/memory_list').then((res) => res.data.data),
  });
 
  // Fetch business unit details
  const { data: businessUnitData, isLoading: isBusinessUnitLoading, isError: isBusinessUnitError } = useQuery({
    queryKey: ['businessUnit'],
    queryFn: () => axiosInstance.get('/asset/business_unit').then((res) => res.data.data),
  });
 
  //Fetch location details
 
  const { data: locationData, isLoading: isLocationLoading, isError: isLocationError } = useQuery({
    queryKey: ['locations'],
    queryFn: () => axiosInstance.get('/asset/location').then((res) => res.data),
    
  });
 
  if (isAssetTypeLoading || isMemoryLoading || isBusinessUnitLoading || isLocationLoading) return <div>Loading...</div>;
  if (isAssetTypeError || isMemoryError || isBusinessUnitError ||isLocationError) return <div>Error fetching data</div>;
 
  const asset_type = assetTypeData.map((item: any) => ({
    value: item.id,
    label: item.asset_type_name,
  }));
 
  const memory_space = memoryData.map((item: any) => ({
    id: item.id,
    memory_space: item.memory_space,
  }));
 
  const business_units = businessUnitData.map((item: any) => ({
    id: item.id,
    name: item.business_unit_name,
  }));
  
 
  const locations = locationData.data.map((item: any) => ({
    id: item.id,
    name: item.location_name,
  }));
  // Fetch data queries...
 
  const handleSubmit = async () => {
    try {
      // Send a POST request to your backend API with the form data
      const response = await axiosInstance.post('http://localhost:8000/api/v1/asset/', formData);
      console.log('Form Data Posted:', response.data);
        // Show success message
        message.success('Form data submitted successfully');
         
         // Reload the page after a brief delay
    setTimeout(() => {
      window.location.reload();
    }, 1500); // 1500 milliseconds (1.5 seconds) delay before reloading
 
 
       
 
       
      // Optionally, you can handle success or show a success message here
    } catch (error) {
      console.error('Error posting form data:', error);
      // Optionally, you can handle errors or show an error message here
    }
  };
 
 
 
  return (
    <div className = "font-display">
    <div className={styles['container']}>
      <h1 className={styles['heading']}>Create a new asset</h1>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 12 }}
        layout="horizontal"
        initialValues={{ size: componentSize }}
        onValuesChange={onFormLayoutChange}
        size={componentSize as SizeType}
        labelAlign="left" 
        style={{ padding: '20px', overflowX: "hidden" }} 
        
        className={styles['formContainer']} // Apply CSS module class
      >
        {/* Form items... */}
 
        {/* Category */}
        <Form.Item label="Category" className={styles['formItem']}>
          <Select
            className={styles['input']}
            placeholder="Select asset category"
            onChange={(value) => handleInputChange('asset_category', value)}
          >
            <Option value="HARDWARE">Hardware</Option>
            <Option value="SOFTWARE">Software</Option>
          </Select>
        </Form.Item>
 
        {/* Asset ID */}
        <Form.Item label="Asset ID" className={styles['formItem']}>
          <Input
            placeholder="Enter Asset ID"
            className={styles['input']}
            onChange={(e) => handleInputChange('asset_id', e.target.value)}
          />
        </Form.Item>
 
 
       <Form.Item label="Version" className={styles['formItem']}>
  <InputNumber
    className={styles['input']}
    placeholder="Enter version number"
 
    onChange={(value: number | null) => handleInputChange('version', value)}
  />
</Form.Item>
 
 
       
 
<Form.Item label="Asset Type" className={styles['formItem']}>
    <Select className={styles['input']} placeholder="Select asset type"
    onChange={(value) => handleInputChange('asset_type', value)}
    options={asset_type}
    />
     
 </Form.Item>
 
 
 
         <Form.Item label="Product name" className={styles['formItem']}>
        <Input placeholder="Enter Product name"className={styles['input']}
            onChange={(e) => handleInputChange('product_name', e.target.value)}/>
         </Form.Item>
 
 
       <Form.Item label="Model number" className={styles['formItem']}>
        <Input placeholder="Enter Model number"className={styles['input']}
            onChange={(e) => handleInputChange('model_number', e.target.value)}/>
        </Form.Item>
 
 
        <Form.Item label="Serial Number" className={styles['formItem']}>
        <Input placeholder="Enter serial number"className={styles['input']}
        onChange={(e) => handleInputChange('serial_number', e.target.value)} />
        </Form.Item>
 
 
        <Form.Item label="Owner"  className={styles['formItem']}>
          <Select className={styles['input']} placeholder="Select owner"
                onChange={(value) => handleInputChange('owner', value)}>
            <Option value="EXPERION">EXPERION</Option>
           </Select>
        </Form.Item>
 
        <Form.Item label="Purchase Date:" className={styles['formItem']}>
    <DatePicker 
        className={styles['input']}  
        placeholder="Enter purchase date"
        format="YYYY-MM-DD"  // Set the format to YYYY-MM-DD
        onChange={(_date, dateString) => handleInputChange('date_of_purchase', dateString)}  // Use dateString to get the formatted date
    />
</Form.Item>
 
 
        <Form.Item label="Warranty Period:" className={styles['formItem']}>
        <InputNumber className={styles['input']}  placeholder="Enter warranty period"
       onChange={(value) => handleInputChange('warranty_period', value)}/>
        </Form.Item>
 
 
        <Form.Item label="Product location:" className={styles['formItem']}>
          <Select className={styles['input']} placeholder="Select product location"
           onChange={(value) => handleInputChange('location', value)}>
           {locations.map((location: any) => (
             <Option key={location.id}>{location.name}</Option>
           ))}
         </Select>
       </Form.Item>
 
 
       
 
        <Form.Item label="Invoice location:" className={styles['formItem']}>
          <Select className={styles['input']} placeholder="Select invoice location"
           onChange={(value) => handleInputChange('invoice_location', value)}>
            {locations.map((location: any) => (
              <Option key={location.id}>{location.name}</Option>
            ))}
          </Select>
        </Form.Item>
 
 
                <Form.Item label="Business Unit" className={styles['formItem']}>
        <Select className={styles['input']} placeholder="Select business unit"
         onChange={(value) => handleInputChange('business_unit', value)}>
          {business_units.map((item: any) => (
              <Option key={item.id}>{item.name}</Option>
            ))}
          </Select>
        </Form.Item>
   
 
        <Form.Item label="OS:" className={styles['formItem']}>
           <Select className={styles['input']}  placeholder="Select OS"
                onChange={(value) => handleInputChange('os', value)}>
             <Option value="WINDOWS">Windows</Option>
           
             <Option value="MAC">Mac</Option>
             <Option value="LINUX">Linux</Option>
           
           </Select>
         </Form.Item>
 
 
 

 
 
        <Form.Item label="OS  version" className={styles['formItem']}>
         <Input placeholder="Enter OS version "className={styles['input']}
  onChange={(e) => handleInputChange('os_version', e.target.value)}/>
        </Form.Item>
 
 
 
 
       
 
       
         <Form.Item label="Mobile OS" className={styles['formItem']}>
         <Input placeholder="Enter Mobile OS"className={styles['input']}
            onChange={(e) => handleInputChange('mobile_os', e.target.value)} />
         </Form.Item>
 
 
 
         <Form.Item label="Processor" className={styles['formItem']}>
         <Input placeholder="Enter processor"className={styles['input']}
 onChange={(e) => handleInputChange('processor', e.target.value)}/>
        </Form.Item>
 
 
        <Form.Item label="Processor Gen:" className={styles['formItem']}>
         <Input placeholder="Enter processor generation"className={styles['input']}
 onChange={(e) => handleInputChange('processor_gen', e.target.value)}/>
        </Form.Item>
 
       
 
   
 
 
 
 
        <Form.Item label="Memory:" className={styles['formItem']}>
          <Select className={styles['input']} placeholder="Select memory space">
           {memory_space.map((item: any) => (
              <Option key={item.id}>{item.memory_space}</Option>
            ))}
          </Select>
        </Form.Item>
 
 
       
       
 
         <Form.Item label="Storage:" className={styles['formItem']}>
         <Input placeholder="Enter Storage"className={styles['input']}
 onChange={(e) => handleInputChange('storage', e.target.value)}/>
        </Form.Item>
 
 
       
       
         <Form.Item label="Configuration:" className={styles['formItem']}>
         <Input placeholder="Enter configuration"className={styles['input']}
             onChange={(e) => handleInputChange('configuration', e.target.value)}/>
        </Form.Item>
       
 
 
 
         
         <Form.Item label="Accessory/s:" className={styles['formItem']}>
         <Input placeholder="Enter Accessory"className={styles['input']}
             onChange={(e) => handleInputChange('accessories', e.target.value)}/>
         </Form.Item>
 
         <Form.Item label="Status:" className={styles['formItem']}>
           <Select className={styles['input']} defaultValue="in store" placeholder="Select Approval"
                onChange={(value) => handleInputChange('status', value)}>
             <Option value="in store">IN-STORE</Option>
           
             <Option value="in repair">IN-REPAIR</Option>
             <Option value="expired">EXPIRED</Option>
             <Option value="disposed">DISPOSED</Option>
           </Select>
         </Form.Item>
   
 
 
        <Form.Item label="Asset Remark/s:" className={styles['formItem']}>
           <TextArea rows={4}  className={styles['input']}  placeholder="Enter asset remarks/s"
                  onChange={(e) => handleInputChange('remark', e.target.value)}/>
         </Form.Item>
 
       
 
 
        <Form.Item label="Reason of creation:" className={styles['formItem']}>
        <Input placeholder="Enter reason for creation"className={styles['input']}
          onChange={(e) => handleInputChange('message', e.target.value)}/>
        </Form.Item>
        <Form.Item>
          <Button
            className={styles['button']}
            ghost
            style={{ background: 'rgb(22, 119, 255)', marginTop: '30px', width: '120px', height: '40px' }}
            onClick={() =>  handleSubmit()} // Example: Log form data on submit
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
    </div>
  );
};
 
export default AddAsset;
 