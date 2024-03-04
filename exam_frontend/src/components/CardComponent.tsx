// CardComponent.js
import React, { useState } from 'react';
import { Card, Form, Space,Input } from 'antd';
import './CardComponent.css'
import { EditOutlined } from '@ant-design/icons';
import { DataType } from './AssetTable';
const CardComponent: React.FC<{
  data: DataType; // Specify the data prop type as DataType
}> = ({ data }) => {
  


  
 
  const gridStyle: React.CSSProperties = {
    width: '25%',
    textAlign: 'center',
  };
  const mainCardStyle = {
    marginLeft:'10%',
    width: '80%', 
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
    borderRadius: '8px', 
  };
  const editIconStyle = { marginLeft: '10px',color:'gray' };
  
  const [assetCategory, setvalue] = useState();
  const[orgiginalValue,setOriginalValue]=useState(data.AssetCategory);

  const handleInputChange = (e:any) => {
    setvalue(e.target.value);
  };
  const handleFormClose=()=>{
    setOriginalValue(orgiginalValue);
  }
  return (
    <Card key={data.AssetId} className='mainCard' title=""  style={mainCardStyle}>
        <Card.Grid style={gridStyle}><b>Asset Category:</b>  <Form.Item name="assetCategory"> <Input defaultValue={data.AssetCategory} onChange={handleInputChange} onBlur={handleFormClose}  style={{ border: 'none' }} /> </Form.Item></Card.Grid>
       <Card.Grid style={gridStyle}><b>Version: </b><Form.Item name="version"> <Input defaultValue={data.Version} onChange={handleInputChange} style={{ border: 'none' }}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Status:</b> <Form.Item name="status"> <Input defaultValue={data.Status} onChange={handleInputChange} style={{ border: 'none' }}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Location: </b><Form.Item name="location"> <Input defaultValue={data.Location} onChange={handleInputChange} style={{ border: 'none' }}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Invoice Location:</b> <Form.Item name="invoiceLocation"> <Input defaultValue={data.InVoiceLocation} onChange={handleInputChange} style={{ border: 'none' }}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Business Unit:</b> <Form.Item name="businessUnit"> <Input defaultValue={data.BusinessUnit} onChange={handleInputChange} style={{ border: 'none' }}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>OS: </b><Form.Item name="os"> <Input defaultValue={data.Os} onChange={handleInputChange} style={{ border: 'none' }}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>OS Version:</b><Form.Item name="os version"> <Input defaultValue={data.OsVersion} onChange={handleInputChange} style={{ border: 'none' }}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Mobile OS: </b><Form.Item name="mobile os"> <Input defaultValue={data.MobileOs} onChange={handleInputChange} style={{ border: 'none' }}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Processor: </b><Form.Item name="processor"> <Input defaultValue={data.Processor} onChange={handleInputChange} style={{ border: 'none' }}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Generation:</b><Form.Item name="generation"> <Input defaultValue={data.Generation} onChange={handleInputChange} style={{ border: 'none' }}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Accessories:</b> <Form.Item name="accessories"> <Input defaultValue={data.Accessories} onChange={handleInputChange} style={{ border: 'none' }}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Date of Purchase:</b> <Form.Item name="date of purchase"> <Input defaultValue={data.DateOfPurchase.toString()} onChange={handleInputChange} style={{ border: 'none' }}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Warranty Period:</b><Form.Item name="warranty period"> <Input defaultValue={data.WarrantyPeriod} onChange={handleInputChange} style={{ border: 'none' }}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Approval Status: </b>{data.ApprovalStatus}</Card.Grid>
          <Card.Grid style={gridStyle}><b>Approver:</b> {data.Approver}</Card.Grid>
          <Card.Grid style={gridStyle}><b>Assign Asset:</b> {data.AssignAsset}</Card.Grid>
          <Card.Grid style={gridStyle}><b>Serial Number:</b> <Form.Item name="serial number"> <Input defaultValue={data.SerialNumber} onChange={handleInputChange} style={{ border: 'none' }}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Model Number:</b> <Form.Item name="serial number"> <Input defaultValue={data.ModelNumber} onChange={handleInputChange} style={{ border: 'none' }}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Custodian:</b> {data.Custodian}</Card.Grid>
          <Card.Grid style={gridStyle}><b>Product Name:</b><Form.Item name="product name"> <Input defaultValue={data.ProductName} onChange={handleInputChange} style={{ border: 'none' }}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Memory:</b><Form.Item name="memory"> <Input defaultValue={data.Memory} onChange={handleInputChange} style={{ border: 'none' }}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Storage: </b><Form.Item name="storage"> <Input defaultValue={data.Storage} onChange={handleInputChange} style={{ border: 'none' }}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Configuration:  </b><Form.Item name="configuration"> <Input defaultValue={data.Configuration} onChange={handleInputChange} style={{ border: 'none' }}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Owner:  </b><Form.Item name="configuration"> <Input defaultValue={data.Owner} onChange={handleInputChange} style={{ border: 'none' }}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Requester:  </b><Form.Item name="configuration"> <Input defaultValue={data.Requester} onChange={handleInputChange} style={{ border: 'none' }}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Comments:  </b><Form.Item name="configuration"> <Input defaultValue={data.Comments} onChange={handleInputChange} style={{ border: 'none' }}/> </Form.Item></Card.Grid>


          <Card.Grid style={gridStyle}>

      </Card.Grid>
      {/* Add more card details as needed */}
    </Card>
  );

};
export default CardComponent;
