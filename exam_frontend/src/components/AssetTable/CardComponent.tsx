
import React, { useState } from 'react';
import { Card, Form, Space,Input, Button,Select, ConfigProvider } from 'antd';
import './CardComponent.css'
import { DataType } from '../AssetTable/types/index'
import { DataType } from '../AssetTable/types/index'

const CardComponent: React.FC<{
  data: DataType; 
  statusOptions: string[];
  businessUnitOptions:string[];
  locationOptions:string[];
  memoryoptions:string[];
  onUpdate: (updatedData: DataType) => void;
  
  // Specify the data prop type as DataType
}> = ({ data,onUpdate,statusOptions,businessUnitOptions,locationOptions,memoryoptions,assetTypeOptions }) => {
  
  const uniqueStatusOptions = Array.from(new Set(statusOptions));
  const uniqueBusinessOptions=Array.from(new Set(businessUnitOptions));
  const uniqueLocationoptions=Array.from(new Set(locationOptions));
  const uniqueMemoryOptions=Array.from(new Set(memoryoptions));
  const uniqueAssetTypeOptions=Array.from(new Set(assetTypeOptions));
  const [editedData, setEditedData] = useState(data);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleUpdate = () => {
    onUpdate(editedData);
  };
  const gridStyle: React.CSSProperties = {
    width: '25%',
    height:'30%',
    textAlign: 'center',
  
    
  };
  const mainCardStyle = {
    marginLeft:'10%',
    width: '80%', 
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
    borderRadius: '8px', 
    background:'white'
  };
  
  const [assetCategory, setvalue] = useState();
  const[orgiginalValue,setOriginalValue]=useState(data.assetCategory);

  const handleInputChange = (e:any) => {
    setvalue(e.target.value);
  };
  const handleFormClose=()=>{
    setOriginalValue(orgiginalValue);
  }
  const inputStyle: React.CSSProperties = {
    border: 'none',
    width: '200px',
    boxShadow: 'none',
    textAlign: 'center'
  };
  <ConfigProvider
  theme={{
    components: {
      Select: {
        multipleItemBorderColor:'transparent',
        colorBorder:'none',
        
      },
    },
  }}
>
  ...
</ConfigProvider>
  return (
    
    <Card key={data.asset_id} className='mainCard' title=""  style={mainCardStyle}>
                <Card.Grid style={gridStyle}><b>Asset Category: </b><Form.Item name="version"> <Input defaultValue={data. asset_category} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
        <Card.Grid style={gridStyle} ><b> Asset Type:</b>
       <Form.Item name="status" style={{ background: '#FAFAFA', boxShadow: 'none', border: 'none' }}>
      <Select 
      defaultValue={uniqueAssetTypeOptions[0]} style={{ background: '#FAFAFA', boxShadow: 'none', border: 'none' }} onChange={(value) => handleChange("Status", value)}>
        {uniqueAssetTypeOptions.map((asset_type, index) => (
          <Select.Option key={index} value={asset_type}>{asset_type}</Select.Option>
        ))}
      </Select>
    </Form.Item>
      
      </Card.Grid>
       

       <Card.Grid style={gridStyle}><b>Version: </b><Form.Item name="version"> <Input defaultValue={data.version} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
       <Card.Grid style={gridStyle} ><b> Asset Status:</b>
       <Form.Item name="status" style={{ background: '#FAFAFA', boxShadow: 'none', border: 'none' }}>
      <Select defaultValue={uniqueStatusOptions[0]} style={{ background: '#FAFAFA', boxShadow: 'none', border: 'none' }} onChange={(value) => handleChange("Status", value)}>
        {uniqueStatusOptions.map((status, index) => (
          <Select.Option key={index} value={status}>{status}</Select.Option>
        ))}
      </Select>
    </Form.Item>
      
      </Card.Grid>
      
      <Card.Grid style={gridStyle} ><b> Asset Location:</b>
       <Form.Item name="location" style={{ background: '#FAFAFA', boxShadow: 'none', border: 'none' }}>
      <Select defaultValue={uniqueLocationoptions[0]} style={{ background: '#FAFAFA', boxShadow: 'none', border: 'none' }} onChange={(value) => handleChange("location", value)}>
        {uniqueLocationoptions.map((location, index) => (
          <Select.Option key={index} value={location}>{location}</Select.Option>
        ))}
      </Select>
    </Form.Item>
      
      </Card.Grid>

             
      <Card.Grid style={gridStyle} ><b>Invoice Location:</b>
       <Form.Item name="location" style={{ background: '#FAFAFA', boxShadow: 'none', border: 'none' }}>
      <Select defaultValue={uniqueLocationoptions[0]} style={{ background: '#FAFAFA', boxShadow: 'none', border: 'none' }} onChange={(value) => handleChange("location", value)}>
        {uniqueLocationoptions.map((location, index) => (
          <Select.Option key={index} value={location}>{location}</Select.Option>
        ))}
      </Select>
    </Form.Item>
      
      </Card.Grid>
          <Card.Grid style={gridStyle} ><b>Business Unit:</b>
          <Form.Item name="business_unit" style={{ background: '#FAFAFA', boxShadow: 'none', border: 'none' }}>
      <Select defaultValue={uniqueBusinessOptions[0]} style={{ background: '#FAFAFA', boxShadow: 'none', border: 'none' }} onChange={(value) => handleChange("business_unit", value)}>
        {uniqueBusinessOptions.map((business_unit, index) => (
          <Select.Option key={index} value={business_unit}>{business_unit}</Select.Option>
        ))}
      </Select>
    </Form.Item>
    </Card.Grid>
          <Card.Grid style={gridStyle}><b>OS: </b><Form.Item name="os"> <Input defaultValue={data.os} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>OS Version:</b><Form.Item name="os version"> <Input defaultValue={data.os_version} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Mobile OS: </b><Form.Item name="mobile os"> <Input defaultValue={data.mobile_os} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Processor: </b><Form.Item name="processor"> <Input defaultValue={data.processor} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Generation:</b><Form.Item name="generation"> <Input defaultValue={data.Generation} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Accessories:</b> <Form.Item name="accessories"> <Input defaultValue={data.accessories} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Date of Purchase:</b> <Form.Item name="date of purchase"> <Input defaultValue={data.date_of_purchase.toString()} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Warranty Period:</b><Form.Item name="warranty period"> <Input defaultValue={data.warranty_period} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Approval Status: </b><Form.Item name="date of purchase" style={inputStyle}>{data.approval_status}   </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Approver:</b>  <Form.Item name="date of purchase" >{data.conceder}   </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Serial Number:</b> <Form.Item name="serial number"> <Input defaultValue={data.serial_number} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Model Number:</b> <Form.Item name="serial number"> <Input defaultValue={data.model_number} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Custodian:</b><Form.Item name="date of purchase"  style={inputStyle}>{data.custodian}   </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Product Name:</b><Form.Item name="product name"> <Input defaultValue={data.product_name} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle} ><b>Memory:</b>
          <Form.Item name="business_unit" style={{ background: '#FAFAFA', boxShadow: 'none', border: 'none' }}>
      <Select defaultValue={uniqueMemoryOptions[0]} style={{ background: '#FAFAFA', boxShadow: 'none', border: 'none' }} onChange={(value) => handleChange("business_unit", value)}>
        {uniqueMemoryOptions.map((memory, index) => (
          <Select.Option key={index} value={memory}>{memory}</Select.Option>
        ))}
      </Select>
    </Form.Item>
    </Card.Grid>

          <Card.Grid style={gridStyle}><b>Storage: </b><Form.Item name="storage"> <Input defaultValue={data.storage} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Configuration:  </b><Form.Item name="configuration"> <Input defaultValue={data.configuration} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Owner:  </b><Form.Item name="configuration"> <Input defaultValue={data.owner} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Requester:  </b><Form.Item name="configuration"> <Input defaultValue={data.requester} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Comments:  </b><Form.Item name="configuration"> <Input defaultValue={data.notes} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Created At:  </b><Form.Item name="configuration"> <Input defaultValue={data.created_at} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Updated At:  </b><Form.Item name="configuration"> <Input defaultValue={data.updated_at} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>

      {/* Add more card details as needed */}
      <Button style={{marginLeft:'1020px',marginBottom:'40px', color:'black',border:'none',background:'lightblue'}} onClick={handleUpdate}>Update</Button>
    </Card>
    
  );

};
export default CardComponent;
