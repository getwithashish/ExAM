
//AddAsset.tsx

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
const { TextArea } = Input;
import styles from './AddAsset.module.css';


const { Option } = Select;

type SizeType = Parameters<typeof Form>[0]['size'];

const AddAsset: React.FC = () => {
  const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default');

  const onFormLayoutChange = ({ size }: { size: SizeType }) => {
    setComponentSize(size);
  };

  /////////////////////////// Fetch the asset type details
//   const { data, isLoading, isError } = useQuery({
//     queryKey: ['assetType'],
//     queryFn: () => axiosInstance.get('/asset/asset_type').then((res) => {
//       console.log("res.data.data",res.data.data);
//       return res.data.data
//     }),    
//   });
 
//   if (isLoading) return <div>Loading...</div>;
//   if (isError) return <div>Error fetching data</div>;

//   const asset_type = data.map((item)=>({
//     name:item.asset_type_name
//   }));

// console.log(asset_type);
/////////////////////////////////////////////////Fetch the asset type details


// Fetch the asset type details
// Fetch the asset type details

  // Fetch the asset type details
  const { data: assetTypeData, isLoading: isAssetTypeLoading, isError: isAssetTypeError } = useQuery({
    queryKey: ['assetType'],
    queryFn: () => axiosInstance.get('/asset/asset_type').then((res) => res.data.data),
  });

  // Fetch memory space options
  const { data: memoryData, isLoading: isMemoryLoading, isError: isMemoryError } = useQuery({
    queryKey: ['memorySpace'],
    queryFn: () => axiosInstance.get('/asset/memory_list').then((res) => res.data),
  });

  // Fetch business unit details
  const { data: businessUnitData, isLoading: isBusinessUnitLoading, isError: isBusinessUnitError } = useQuery({
    queryKey: ['businessUnit'],
    queryFn: () => axiosInstance.get('/asset/business_unit').then((res) => res.data.data),
  });

  //Fetch location details

  const { data: locationData, isLoading: isLocationLoading, isError: isLocationError } = useQuery({
    queryKey: ['locations'],
    queryFn: () => axiosInstance.get('/asset/location').then((res) => res.data.data),
  });

  if (isAssetTypeLoading || isMemoryLoading || isBusinessUnitLoading || isLocationLoading) return <div>Loading...</div>;
  if (isAssetTypeError || isMemoryError || isBusinessUnitError ||isLocationError) return <div>Error fetching data</div>;

  const asset_type = assetTypeData.map((item: any) => ({
    name: item.asset_type_name,
  }));

  const memory_space = memoryData.map((item: any) => ({
    id: item.id,
    memory_space: item.memory_space,
  }));

  const business_units = businessUnitData.map((item: any) => ({
    id: item.id,
    name: item.business_unit_name,
  }));

  const locations = locationData.results.map((item: any) => ({
    id: item.id,
    name: item.location_name,
  }));
//////////////////////////////////////////

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


        {/* <Form.Item label="Asset Type" className={styles['formItem']}>
          <Select className={styles['input']}  placeholder="Select asset type">
            <Option value="laptops">Laptop</Option>
            <Option value="desktop">Desktop</Option>
            <Option value="monitors">Monitors</Option>
            <Option value="routers">Routers</Option>
            <Option value="vs code">VS code</Option>
            <Option value="cables">Cables</Option>
          </Select>
        </Form.Item> */}
    

<Form.Item label="Asset Type" className={styles['formItem']}>
  <Select className={styles['input']} placeholder="Select asset type">
    {asset_type.map((item: any) => (
      <Option key={item.name}>{`${item.name}`}</Option>
    ))}
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


        {/* <Form.Item label="Custodian name:" className={styles['formItem']}>
          <Select className={styles['input']}  placeholder="Select custodian name">
            <Option value="Ashish">Ashish</Option>
            <Option value="Aidrin">Aidrin</Option>
            <Option value="Asima">Asima</Option>
            <Option value="Ananthakrishnan">Anandhu</Option>
            <Option value="Pavithra">Pavithra</Option>
        </Select>
        </Form.Item> */}



        <Form.Item label="Enter purchase Date:" className={styles['formItem']}>
          <DatePicker className={styles['input']}  placeholder="Enter purchase date"/>
        </Form.Item>


        <Form.Item label="Enter warranty Period:" className={styles['formItem']}>
        <InputNumber className={styles['input']}  placeholder="Enter warranty period" />
        </Form.Item>


        <Form.Item label="Product location:" className={styles['formItem']}>
          <Select className={styles['input']} placeholder="Select product location">
            {locations.map((location: any) => (
              <Option key={location.id}>{location.name}</Option>
            ))}
          </Select>
        </Form.Item>


       

        <Form.Item label="Invoice location:" className={styles['formItem']}>
          <Select className={styles['input']} placeholder="Select invoice location">
            {locations.map((location: any) => (
              <Option key={location.id}>{location.name}</Option>
            ))}
          </Select>
        </Form.Item>


      

        <Form.Item label="Business Unit" className={styles['formItem']}>
          <Select className={styles['input']} placeholder="Select business unit">
            {business_units.map((item: any) => (
              <Option key={item.id}>{item.name}</Option>
            ))}
          </Select>
        </Form.Item>
   



 


















      


    

        
        <Form.Item label="OS " className={styles['formItem']}>
        <Input placeholder="Enter OS "className={styles['input']} />
        </Form.Item>



       

        
        <Form.Item label="Mobie OS" className={styles['formItem']}>
        <Input placeholder="Enter Mobile OS"className={styles['input']} />
        </Form.Item>



        <Form.Item label="Processor" className={styles['formItem']}>
        <Input placeholder="Enter processor"className={styles['input']} />
        </Form.Item>

     

       

        
        <Form.Item label="Processor Generation" className={styles['formItem']}>
        <Input placeholder="Enter processor generation"className={styles['input']} />
        </Form.Item>
      

        {/* <Form.Item label=" Memory:" className={styles['formItem']}>
          <Select className={styles['input']}  placeholder="Select memory">
            <Option value="8GB">8gb</Option>
            <Option value="16GB">16gb</Option>
            <Option value="32GB">32gb</Option>
            <Option value="64GB">64gb</Option>
          </Select>
        </Form.Item> */}



        <Form.Item label="Memory" className={styles['formItem']}>
          <Select className={styles['input']} placeholder="Select memory space">
            {memory_space.map((item: any) => (
              <Option key={item.id}>{item.memory_space}</Option>
            ))}
          </Select>
        </Form.Item>


        
        

        <Form.Item label="Storage" className={styles['formItem']}>
        <Input placeholder="Enter Storage"className={styles['input']} />
        </Form.Item>


        
       
        <Form.Item label="Configuration" className={styles['formItem']}>
        <Input placeholder="Enter configuration"className={styles['input']} />
        </Form.Item>
        



          
        <Form.Item label="Accessory/s" className={styles['formItem']}>
        <Input placeholder="Enter Accessory"className={styles['input']} />
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
    


        <Form.Item label="Remark/s" className={styles['formItem']}>
          <TextArea rows={4}  className={styles['input']}  placeholder="Enter any remarks/s" />
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
          <Button  className={styles['button']} ghost style={{background:"blue",marginLeft:"300px",marginTop:"30px",width:"120px",height:"40px"}}>Submit</Button>
        </Form.Item>
      </Form>
    </div>
    
    
  );
};

export default AddAsset;



//real code -------

