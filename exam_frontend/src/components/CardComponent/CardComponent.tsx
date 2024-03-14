import React, { useState } from "react";
import { Card, Form, Space, Input, Button, Select, ConfigProvider, Row, Col } from "antd";
import "./CardComponent.css";
import { DataType } from "../AssetTable/types/index";
import { CardType } from "./types/index";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../config/AxiosConfig";
const CardComponent: React.FC<CardType> = ({
  data,
  onUpdate,
  statusOptions,
  businessUnitOptions,
  locations,
  memoryData,
  assetTypeData
}) => {
  const uniqueStatusOptions = Array.from(new Set(statusOptions));
  const uniqueBusinessOptions = Array.from(new Set(businessUnitOptions));
  const uniqueLocationoptions = Array.from(new Set(locations));
  const uniqueMemoryOptions = Array.from(new Set(memoryData));
  const uniqueAssetTypeOptions = Array.from(new Set(assetTypeData));
  const [editedData, setEditedData] = useState(data);

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const {name,value}=e.target;
  //   setEditedData((prevData) => ({
  //     ...prevData,
  //     propertyName: newValue, 
  //     [name]: value,
  //   }));
  // };

  const handleChange = (name: string, value: string | number) => {
    let updatedValue = value;
    if (name === 'location' || name === 'invoice_location' || name === 'business_unit') {
      updatedValue = mapInputValueToPrimaryKey(name, value);
    }
    else if (name === 'asset_type') {
      updatedValue = mapInputValueToPrimaryKey(name, value, assetTypeData);
    } else if (name === 'memory') {
      updatedValue = mapInputValueToPrimaryKey(name, value, memoryData);
    }
    setEditedData((prevData) => ({
      ...prevData,
      [name]: updatedValue,
    }));
  };

  const mapInputValueToPrimaryKey = (fieldName: string, value: string | number) => {
    switch (fieldName) {
      case 'location':
        const location = uniqueLocationoptions.find(option => option.location_name === value);
        return location ? location.id : value; 
      case 'invoice_location':
        const invoiceLocation = uniqueLocationoptions.find(option => option.location_name === value);
        return invoiceLocation ? invoiceLocation.id : value; 
      case 'business_unit':
        const businessUnit = uniqueBusinessOptions.find(option => option === value);
        return businessUnit ? businessUnit.id : value; 
        case 'asset_type':
          
          const assetType = options.find(option => option.asset_type_name === value);
          return assetType ? assetType.id : value; 
        case 'memory':
          
          const memory = options.find(option => option.memory_space === value);
          return memory ? memory.id : value; 
      default:
        return value; 
    }
  };
  

  const handleUpdate = () => {
    axiosInstance.patch('http://localhost:8000/api/v1/asset/update', 
    {
      asset_uuid: editedData.key,
      data: editedData
    }, 
    {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => {
      if (response.status === 200) {
        alert('Data updated successfully!');
      } else {
        throw new Error('Failed to update data');
      }
    })
    .catch(error => {
      console.error('Error updating data:', error);
      alert('Failed to update data. Please try again later.');
    });
  };


  const mainCardStyle = {
    marginLeft: "10%",
    width: "80%",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    background: "white",
  };

  const [assetCategory, setvalue] = useState();
  const [orgiginalValue, setOriginalValue] = useState(data.asset_category);

  const handleInputChange = (e: any) => {
    setvalue(e.target.value);
  };
 
  const inputStyle: React.CSSProperties = {
    border: "none",
    width: "200px",
    boxShadow: "none",
    textAlign: "center",

  };
  
  <ConfigProvider
    theme={{
      components: {
        Select: {
          multipleItemBorderColor: "transparent",
          colorBorder: "none",
        },
      },
    }}
  >
    ...
  </ConfigProvider>;
  function formatDate(dateString: string | number | Date) {
    if (!dateString) return ''; 
    const date = new Date(dateString);
      if (isNaN(date.getTime())) {
      return ''; 
    }
    return date.toLocaleString();
  }

  
  return (
    
    <Form
      key={data.asset_id}
      className="mainCard"
      title=""
      style={mainCardStyle}
    >
      <div className="rowone">
        <Row gutter={[16, 16]}>
        <Col span={8}>

        <b>Asset Category: </b>
        <Form.Item name="version">
          {" "}
          <Input
            defaultValue={data.asset_category}
            onChange={handleInputChange}
            style={inputStyle}
          />{" "}
        </Form.Item>
     
        </Col>
        <Col span={8}>
        <b> Asset Type:</b>
        <Form.Item
          name="status"
          style={{ boxShadow: "none", border: "none" }}
        >
          <Select
            defaultValue={data.asset_type}
            style={{ boxShadow: "none", border: "none",width:"200px" }}
            onChange={(value) => handleChange(value)} // Adjusted to accept only one argument
          >
            {uniqueAssetTypeOptions.map((asset_type, index) => (
              <Select.Option key={index} value={asset_type.id}>
                {asset_type.asset_type_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        </Col>

    
   
    
     <Col span={8}>
        <b>Version: </b>
        <Form.Item name="version">
          {" "}
          <Input
            defaultValue={data.version}
            onChange={handleInputChange}
            style={inputStyle}
          />{" "}
        </Form.Item>
    </Col>
    </Row>
    <Col span={12}>
        <b> Asset Status:</b>
        <Form.Item
          name="status"
          style={{ boxShadow: "none", border: "none" }}
        >
          <Select
            defaultValue={uniqueStatusOptions[0]}
            style={{ boxShadow: "none", border: "none",width:"200px" }}
            onChange={(value) => handleChange(value)} // Pass only the value
          >
            {uniqueStatusOptions.map((status, index) => (
              <Select.Option key={index} value={status}>
                {status}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        </Col>
          
           <Row gutter={[16, 16]}>
           <Col span={12}>
        <b> Asset Location:</b>

        <Form.Item
          name="location"
          style={{ boxShadow: "none", border: "none" }}
        >
          <Select
            defaultValue={data.location}
            style={{ boxShadow: "none", border: "none",width:"200px" }}
            onChange={(value) => handleChange(value)} 
          >
            {uniqueLocationoptions.map((location, index) => (
              <Select.Option key={index} value={location.id}>
                {location.location_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
</Col>

      
<Col span={12}>
        <b>Invoice Location:</b>
        <Form.Item
          name="location"
          style={{ boxShadow: "none", border: "none" }}
        >
          <Select
            defaultValue={data.invoice_location}
            style={{ boxShadow: "none", border: "none" ,width:"200px"}}
            onChange={(value) => handleChange(value)} // Pass only the value
          >
            {uniqueLocationoptions.map((location, index) => (
              <Select.Option key={index} value={location.id}>
                {location.location_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        </Col>
        </Row>
        <Row gutter={[16, 16]}>
               
<Col span={12}>
        <b>Business Unit:</b>
        <Form.Item
          name="business_unit"
          style={{ boxShadow: "none", border: "none" }}
        >
          <Select
            defaultValue={uniqueBusinessOptions[0]}
            style={{ boxShadow: "none", border: "none",width:"200px" }}
            onChange={(value) => handleChange(value)} // Pass only the value
          >
            {uniqueBusinessOptions.map((business_unit, index) => (
              <Select.Option key={index} value={business_unit}>
                {business_unit}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
            
</Col>
<Col span={12}>
        <b>OS: </b>
        <Form.Item name="os">
          {" "}
          <Input
            defaultValue={data.os}
            onChange={handleInputChange}
            style={inputStyle}
          />{" "}
        </Form.Item>
        </Col>
        </Row>
        <Row gutter={[16, 16]}>
        <Col span={12}>
        <b>OS Version:</b>
        <Form.Item name="os version">
          {" "}
          <Input
            defaultValue={data.os_version}
            onChange={handleInputChange}
            style={inputStyle}
          />{" "}
        </Form.Item>
        </Col>

        <Col span={12}>
        <b>Mobile OS: </b>
        <Form.Item name="mobile os">
          {" "}
          <Input
            defaultValue={data.mobile_os}
            onChange={handleInputChange}
            style={inputStyle}
          />{" "}
        </Form.Item>
        </Col>
        </Row>
        <Row gutter={[16, 16]}>
        <Col span={12}>
        <b>Processor: </b>
        <Form.Item name="processor">
          {" "}
          <Input
            defaultValue={data.processor}
            onChange={handleInputChange}
            style={inputStyle}
          />{" "}
        </Form.Item>
        </Col>
        <Col span={12}>

        <b>Generation:</b>
        <Form.Item name="generation">
          {" "}
          <Input
            defaultValue={data.Generation}
            onChange={handleInputChange}
            style={inputStyle}
          />{" "}
        </Form.Item>
        </Col>

        </Row>
        <Row gutter={[16, 16]}>
        <Col span={12}>
        <b>Accessories:</b>{" "}
        <Form.Item name="accessories">
          {" "}
          <Input
            defaultValue={data.accessories}
            onChange={handleInputChange}
            style={inputStyle}
          />{" "}
        </Form.Item>
        </Col>
        <Col span={12}>
        <b>Date of Purchase:</b>{" "}
        <Form.Item name="date of purchase">
          {" "}
          <Input
            defaultValue={formatDate(data.date_of_purchase.toString())}
            onChange={handleInputChange}
            style={inputStyle}
          />{" "}
        </Form.Item>
        </Col>
        </Row>
        <Row gutter={[16, 16]}>
        <Col span={12}>

        <b>Warranty Period:</b>
        <Form.Item name="warranty period">
          {" "}
          <Input
            defaultValue={data.warranty_period}
            onChange={handleInputChange}
            style={inputStyle}
          />{" "}
        </Form.Item>
        </Col>

        <Col span={12}>

        <b>Approval Status: </b>
        <Form.Item name="date of purchase" style={inputStyle}>
          {data.approval_status}{" "}
        </Form.Item>
        </Col>

        </Row>
        <Row gutter={[16, 16]}>
        <Col span={12}>

        <b>Approver:</b>{" "}
        <Form.Item name="date of purchase">{data.conceder} </Form.Item>
        </Col>

        <Col span={12}>

        <b>Serial Number:</b>{" "}
        <Form.Item name="serial number">
          {" "}
          <Input
            defaultValue={data.serial_number}
            onChange={handleInputChange}
            style={inputStyle}
          />{" "}
        </Form.Item>
        </Col>

        </Row>
        <Row gutter={[16, 16]}>
        <Col span={12}>

        <b>Model Number:</b>{" "}
        <Form.Item name="serial number">
          {" "}
          <Input
            defaultValue={data.model_number}
            onChange={handleInputChange}
            style={inputStyle}
          />{" "}
        </Form.Item>
        </Col>
        <Col span={12}>

        <b>Custodian:</b>
        <Form.Item name="date of purchase" style={inputStyle}>
          {data.custodian}{" "}
        </Form.Item>
        </Col>

        </Row>
        <Row gutter={[16, 16]}>
        <Col span={12}>

        <b>Product Name:</b>
        <Form.Item name="product name">
          {" "}
          <Input
            defaultValue={data.product_name}
            onChange={handleInputChange}
            style={inputStyle}
          />{" "}
        </Form.Item>
        </Col>
        <Col span={12}>

        <b>Memory:</b>
        <Form.Item
          name="business_unit"
          style={{ boxShadow: "none", border: "none" }}
        >
          <Select
            defaultValue={data.memory}
            style={{ boxShadow: "none", border: "none",width:"200px" }}
            onChange={(value) => handleChange(value)} // Pass only the value
          >
            {uniqueMemoryOptions.map((memory, index) => (
              <Select.Option key={index} value={memory.id}>
                {memory.memory_space}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        </Col>

        </Row>
        <Row gutter={[16, 16]}>
        <Col span={12}>

        <b>Storage: </b>
        <Form.Item name="storage">
          {" "}
          <Input
            defaultValue={data.storage}
            onChange={handleInputChange}
            style={inputStyle}
          />{" "}
        </Form.Item>
        </Col>
        <Col span={12}>
        <b>Configuration: </b>
        <Form.Item name="configuration">
          {" "}
          <Input
            defaultValue={data.configuration}
            onChange={handleInputChange}
            style={inputStyle}
          />{" "}
        </Form.Item>
        </Col>

        </Row>
        <Row gutter={[16, 16]}>
        <Col span={12}>

        <b>Owner: </b>
        <Form.Item name="configuration">
          {" "}
          <Input
            defaultValue={data.owner}
            onChange={handleInputChange}
            style={inputStyle}
          />{" "}
        </Form.Item>
        </Col>
        <Col span={12}>

        <b>Requester: </b>
        <Form.Item name="configuration">
          {" "}
          <Input
            defaultValue={data.requester}
            onChange={handleInputChange}
            style={inputStyle}
          />{" "}
        </Form.Item>
        </Col>

        </Row>
        <Row gutter={[16, 16]}>
        <Col span={12}>

        <b>Comments: </b>
        <Form.Item name="configuration">
          {" "}
          <Input
            defaultValue={data.notes}
            onChange={handleInputChange}
            style={inputStyle}
          />{" "}
        </Form.Item>
        </Col>

        <Col span={12}>

  <b>Created At: </b>
  <Form.Item name="configuration">
    {" "}
    <Input
      defaultValue={formatDate(data.created_at)}
      onChange={handleInputChange}
      style={inputStyle}
    />{" "}
  </Form.Item>
  </Col>

  </Row>
  <Row gutter={[16, 16]}>
  <Col span={12}>
  <b>Updated At: </b>
  <Form.Item name="configuration">
    {" "}
    <Input
      defaultValue={formatDate(data.updated_at)}
  
      style={inputStyle}
    />{" "}
  </Form.Item>
  </Col>
  <Col span={12}>
  <Form.Item name="configuration">
      <Button
        style={{
          marginLeft: "1020px",
          marginBottom: "40px",
          color: "black",
          border: "none",
          background: "lightblue",
        }}
        onClick={handleUpdate}
      >
        Update
      </Button>
    </Form.Item>
    </Col>
    </Row>
      </div>
    </Form>
    
  
  );
};
export default CardComponent;





