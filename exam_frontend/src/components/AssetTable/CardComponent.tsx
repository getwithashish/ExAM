// CardComponent.js
import React, { useState } from 'react';
import { Card, Form, Space,Input, Button,Select } from 'antd';
import './CardComponent.css'
import { DataType } from './AssetTable';

const CardComponent: React.FC<{
  data: DataType; 
  onUpdate: (updatedData: DataType) => void;
  // Specify the data prop type as DataType
}> = ({ data,onUpdate }) => {
  
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
    padding:'8px',
    gap:'5px',
    marginTop: '10px',
    
  };
  const mainCardStyle = {
    marginLeft:'10%',
    width: '80%', 
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
    borderRadius: '8px', 
  };
  
  const [assetCategory, setvalue] = useState();
  const[orgiginalValue,setOriginalValue]=useState(data.AssetCategory);

  const handleInputChange = (e:any) => {
    setvalue(e.target.value);
  };
  const handleFormClose=()=>{
    setOriginalValue(orgiginalValue);
  }
  const inputStyle: React.CSSProperties = {
    border: 'none',
    width: '100px',
    boxShadow: 'none',
    textAlign: 'center',
    background: '#FAFAFA'
  };
  return (
    <Card key={data.AssetId} className='mainCard' title=""  style={mainCardStyle}>
                <Card.Grid style={gridStyle}><b>Asset Category: </b><Form.Item name="version"> <Input defaultValue={data.AssetCategory} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>

        <Card.Grid style={gridStyle}><b>Asset Type: </b><Form.Item name="version"> <Input defaultValue={data.AssetType} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>

       <Card.Grid style={gridStyle}><b>Version: </b><Form.Item name="version"> <Input defaultValue={data.Version} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
       <Card.Grid style={gridStyle} ><b>Status:</b>
        <Form.Item name="status" style={{background:'#FAFAFA',  boxShadow: 'none',border:'none'}} >
          <Select defaultValue={data.Status} style={{background:'#FAFAFA',  boxShadow: 'none',border:'none'}} onChange={value => handleChange("Status", value)}>
            <Select.Option value="instore">In Store</Select.Option>
            <Select.Option value="inuse">In Use</Select.Option>
            <Select.Option value="inrepair">In Repair</Select.Option>
            <Select.Option value="expired">Expired</Select.Option>
            <Select.Option value="disposed">Disposed</Select.Option>
          </Select>
        </Form.Item>
      </Card.Grid>

          <Card.Grid style={gridStyle}><b>Location: </b><Form.Item name="location"> <Input defaultValue={data.Location} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Invoice Location:</b> <Form.Item name="invoiceLocation"> <Input defaultValue={data.InVoiceLocation} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Business Unit:</b> <Form.Item name="businessUnit"> <Input defaultValue={data.BusinessUnit} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>OS: </b><Form.Item name="os"> <Input defaultValue={data.Os} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>OS Version:</b><Form.Item name="os version"> <Input defaultValue={data.OsVersion} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Mobile OS: </b><Form.Item name="mobile os"> <Input defaultValue={data.MobileOs} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Processor: </b><Form.Item name="processor"> <Input defaultValue={data.Processor} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Generation:</b><Form.Item name="generation"> <Input defaultValue={data.Generation} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Accessories:</b> <Form.Item name="accessories"> <Input defaultValue={data.Accessories} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Date of Purchase:</b> <Form.Item name="date of purchase"> <Input defaultValue={data.DateOfPurchase.toString()} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Warranty Period:</b><Form.Item name="warranty period"> <Input defaultValue={data.WarrantyPeriod} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Approval Status: </b><Form.Item name="date of purchase">{data.ApprovalStatus}   </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Approver:</b>  <Form.Item name="date of purchase">{data.Approver}   </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Serial Number:</b> <Form.Item name="serial number"> <Input defaultValue={data.SerialNumber} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Model Number:</b> <Form.Item name="serial number"> <Input defaultValue={data.ModelNumber} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Custodian:</b><Form.Item name="date of purchase">{data.Custodian}   </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Product Name:</b><Form.Item name="product name"> <Input defaultValue={data.ProductName} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Memory:</b><Form.Item name="memory"> <Input defaultValue={data.Memory} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Storage: </b><Form.Item name="storage"> <Input defaultValue={data.Storage} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Configuration:  </b><Form.Item name="configuration"> <Input defaultValue={data.Configuration} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Owner:  </b><Form.Item name="configuration"> <Input defaultValue={data.Owner} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Requester:  </b><Form.Item name="configuration"> <Input defaultValue={data.Requester} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Comments:  </b><Form.Item name="configuration"> <Input defaultValue={data.Comments} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Created At:  </b><Form.Item name="configuration"> <Input defaultValue={data.CreatedAt} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Updated At:  </b><Form.Item name="configuration"> <Input defaultValue={data.UpdatedAt} onChange={handleInputChange} style={inputStyle}/> </Form.Item></Card.Grid>

      {/* Add more card details as needed */}
      <Button style={{marginLeft:'1020px',marginBottom:'40px', color:'black',border:'none',background:'lightblue'}} onClick={handleUpdate}>Update</Button>
    </Card>
    
  );

};
export default CardComponent;