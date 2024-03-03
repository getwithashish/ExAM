// CardComponent.js
import React from 'react';
import { Card, Space } from 'antd';
import './CardComponent.css'
import { EditOutlined } from '@ant-design/icons';
const CardComponent = ({ data }) => {
 
  const gridStyle: React.CSSProperties = {
    width: '25%',
    textAlign: 'center',
  };
  return (
    <Card className='mainCard' title="">
      <Card.Grid style={gridStyle}>Asset Type: {data.AssetType}<EditOutlined style={{ marginLeft: 7,color:'lightgray' }} rev={undefined} /></Card.Grid>
      <Card.Grid style={gridStyle}>Asset Category: {data.AssetCategory}</Card.Grid>
      <Card.Grid style={gridStyle}>Version: {data.Version}</Card.Grid>
          <Card.Grid style={gridStyle}>Status: {data.Status}</Card.Grid>
          <Card.Grid style={gridStyle}>Location: {data.Location}</Card.Grid>
          <Card.Grid style={gridStyle}>Invoice Location: {data.InVoiceLocation}</Card.Grid>
          <Card.Grid style={gridStyle}>Business Unit: {data.BusinessUnit}</Card.Grid>
          <Card.Grid style={gridStyle}>OS: {data.Os}</Card.Grid>
          <Card.Grid style={gridStyle}>OS Version: {data.OsVersion}</Card.Grid>
          <Card.Grid style={gridStyle}>Mobile OS: {data.MobileOs}</Card.Grid>
          <Card.Grid style={gridStyle}>Processor: {data.Processor}</Card.Grid>
          <Card.Grid style={gridStyle}>Generation: {data.Generation}</Card.Grid>
          <Card.Grid style={gridStyle}>Accessories: {data.Accessories}</Card.Grid>
          <Card.Grid style={gridStyle}>Approval Status: {data.ApprovalStatus}</Card.Grid>
          <Card.Grid style={gridStyle}>Approver: {data.Approver}</Card.Grid>
          <Card.Grid style={gridStyle}>Assign Asset: {data.AssignAsset}</Card.Grid>
          <Card.Grid style={gridStyle}>Serial Number: {data.SerialNumber}</Card.Grid>
          <Card.Grid style={gridStyle}>Custodian: {data.Custodian}</Card.Grid>
          <Card.Grid style={gridStyle}>

      </Card.Grid>
      {/* Add more card details as needed */}
    </Card>
  );
};

export default CardComponent;
