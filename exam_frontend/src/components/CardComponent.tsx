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

  const handleInputChange = (e) => {
    setvalue(e.target.value);
  };
  const handleFormClose=(e)=>{
    setOriginalValue(orgiginalValue);
  }
  return (
    <Card key={data.AssetId} className='mainCard' title=""  style={mainCardStyle}>
        <Card.Grid style={gridStyle}><b>Asset Category:</b>  <Form.Item name="assetCategory"> <Input defaultValue={data.AssetCategory} onChange={handleInputChange} onBlur={handleFormClose}  style={{ border: 'none' }} /> </Form.Item></Card.Grid>
       <Card.Grid style={gridStyle}><b>Version: </b><Form.Item name="version"> <Input defaultValue={data.Version} onChange={handleInputChange} style={{ border: 'none' }}/> </Form.Item></Card.Grid>
          <Card.Grid style={gridStyle}><b>Status:</b> {data.Status}<EditOutlined style={editIconStyle} rev={undefined} /></Card.Grid>
          <Card.Grid style={gridStyle}><b>Location: </b>{data.Location}<EditOutlined style={editIconStyle} rev={undefined} /></Card.Grid>
          <Card.Grid style={gridStyle}><b>Invoice Location:</b> {data.InVoiceLocation}<EditOutlined style={editIconStyle} rev={undefined} /></Card.Grid>
          <Card.Grid style={gridStyle}><b>Business Unit:</b> {data.BusinessUnit}<EditOutlined style={editIconStyle} rev={undefined} /></Card.Grid>
          <Card.Grid style={gridStyle}><b>OS: </b>{data.Os}<EditOutlined style={editIconStyle} rev={undefined} /></Card.Grid>
          <Card.Grid style={gridStyle}><b>OS Version:</b> {data.OsVersion}<EditOutlined style={editIconStyle} rev={undefined} /></Card.Grid>
          <Card.Grid style={gridStyle}><b>Mobile OS: </b>{data.MobileOs}<EditOutlined style={editIconStyle} rev={undefined} /></Card.Grid>
          <Card.Grid style={gridStyle}><b>Processor: </b>{data.Processor}<EditOutlined style={editIconStyle} rev={undefined} /></Card.Grid>
          <Card.Grid style={gridStyle}><b>Generation:</b> {data.Generation}<EditOutlined style={editIconStyle} rev={undefined} /></Card.Grid>
          <Card.Grid style={gridStyle}><b>Accessories:</b> {data.Accessories}<EditOutlined style={editIconStyle} rev={undefined} /></Card.Grid>
          <Card.Grid style={gridStyle}><b>Date of Purchase:</b> {data.DateOfPurchase.toString()}<EditOutlined style={editIconStyle} rev={undefined} /></Card.Grid>
          <Card.Grid style={gridStyle}><b>Warranty Period:</b> {data.WarrantyPeriod}<EditOutlined style={editIconStyle} rev={undefined} /></Card.Grid>
          <Card.Grid style={gridStyle}><b>Approval Status: </b>{data.ApprovalStatus}<EditOutlined style={editIconStyle} rev={undefined} /></Card.Grid>
          <Card.Grid style={gridStyle}><b>Approver:</b> {data.Approver}<EditOutlined style={editIconStyle} rev={undefined} /></Card.Grid>
          <Card.Grid style={gridStyle}><b>Assign Asset:</b> {data.AssignAsset}<EditOutlined style={editIconStyle} rev={undefined} /></Card.Grid>
          <Card.Grid style={gridStyle}><b>Serial Number:</b> {data.SerialNumber}<EditOutlined style={editIconStyle} rev={undefined} /></Card.Grid>
          <Card.Grid style={gridStyle}><b>Custodian:</b> {data.Custodian}<EditOutlined style={editIconStyle} rev={undefined} /></Card.Grid>
          <Card.Grid style={gridStyle}><b>Product Name:</b> {data.ProductName}<EditOutlined style={editIconStyle} rev={undefined} /></Card.Grid>
          <Card.Grid style={gridStyle}><b>Memory:</b> {data.Memory}<EditOutlined style={editIconStyle} rev={undefined} /></Card.Grid>
          <Card.Grid style={gridStyle}><b>Storage: </b>{data.Storage}<EditOutlined style={editIconStyle} rev={undefined} /></Card.Grid>
          <Card.Grid style={gridStyle}><b>Configuration:  </b>{data.Configuration}<EditOutlined style={editIconStyle} rev={undefined} /></Card.Grid>
          <Card.Grid style={gridStyle}>

      </Card.Grid>
      {/* Add more card details as needed */}
    </Card>
  );

};
export default CardComponent;
