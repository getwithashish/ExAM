import React, { useEffect, useState } from "react";
import { Card, Form, Space, Input, Button, Select, ConfigProvider, Row, Col } from "antd";
import "./CardComponent.css";
import { DataType } from "../AssetTable/types/index";
import { CardType } from "./types/index";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../config/AxiosConfig";


interface UpdateData {
  asset_uuid: string;
  data: Partial<DataType>; // Partial to allow updating only specific fields
}
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


  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const {name,value}=e.target;
  //   setEditedData((prevData) => ({
  //     ...prevData,
  //     propertyName: newValue, 
  //     [name]: value,
  //   }));
  // };

  const [editedData, setEditedData] = useState({ ...data });

  useEffect(() => {
    setEditedData({ ...data });
  }, [data]);

  const handleChange = (name, value) => {
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {

      const response = await axiosInstance.patch(
        "/asset/update",
        {
          asset_uuid: data.asset_uuid,
          data: editedData,
          
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
        
      );
   
  
      // Check if the response contains a message indicating success
      if (response.data && response.data.message === "Asset details successfully updated.") {
        
        // Check if the response contains the updated asset data
        if (response.data && response.data.data) {
          // Update the data state with the received updated data
          onUpdate(response.data.data);
        }
        alert("Data updated successfully!");
      } else {
        // Handle the case where the asset could not be found
        alert("The requested asset could not be found. Please review the details and try again.");
      }
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Error updating data");
    }
  };
  
  

  



  const mainCardStyle = {
    marginLeft: "10%",
    width: "80%",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    background: "white",
  };

 

  
 
  const inputStyle: React.CSSProperties = {
    border: "none",
    width: "200px",
    boxShadow: "none",
    textAlign: "left",

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

        <b  style={{ display: "block", marginBottom: "8px" }}>Asset Category: </b>
        <Form.Item name="version">
          {" "}
          <Input
            defaultValue={data.asset_category}
            onChange={(e) => handleChange("assetCategory", e.target.value)}
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
            onChange={(value) => handleChange("asset_type", value)} // Adjusted to accept only one argument
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
            onChange={(e) => handleChange("version", e.target.value)}

            style={inputStyle}
          />{" "}
        </Form.Item>
    </Col>
    </Row>
    <Row gutter={[16, 16]}>
    <Col span={8}>
        <b> Asset Status:</b>
        <Form.Item
          name="status"
          style={{ boxShadow: "none", border: "none" }}
        >
          <Select
            defaultValue={uniqueStatusOptions[0]}
            style={{ boxShadow: "none", border: "none",width:"200px" }}
            onChange={(value) => handleChange("status", value)} // Pass only the value
          >
            {uniqueStatusOptions.map((status, index) => (
              <Select.Option key={index} value={status}>
                {status}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        </Col>
          
          
           <Col span={8}>
        <b> Asset Location:</b>

        <Form.Item
          name="location"
          style={{ boxShadow: "none", border: "none" }}
        >
          <Select
            defaultValue={data.location}
            style={{ boxShadow: "none", border: "none",width:"200px" }}
            onChange={(value) => handleChange("location", value)} 
          >
            {uniqueLocationoptions.map((location, index) => (
              <Select.Option key={index} value={location.id}>
                {location.location_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
</Col>

      
<Col span={8}>
        <b>Invoice Location:</b>
        <Form.Item
          name="location"
          style={{ boxShadow: "none", border: "none" }}
        >
          <Select
            defaultValue={data.invoice_location}
            style={{ boxShadow: "none", border: "none" ,width:"200px"}}
            onChange={(value) => handleChange("invoice_location", value)} // Pass only the value
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
               
<Col span={8}>
        <b>Business Unit:</b>
        <Form.Item
          name="business_unit"
          style={{ boxShadow: "none", border: "none" }}
        >
          <Select
            defaultValue={uniqueBusinessOptions[0]}
            style={{ boxShadow: "none", border: "none",width:"200px" }}
            onChange={(value) => handleChange("business_unit", value)} // Pass only the value
          >
            {uniqueBusinessOptions.map((business_unit, index) => (
              <Select.Option key={index} value={business_unit}>
                {business_unit}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
            
</Col>
<Col span={8}>
        <b>OS: </b>
        <Form.Item name="os">
          {" "}
          <Input
            defaultValue={data.os}
            onChange={(e) => handleChange("os", e.target.value)}

            style={inputStyle}
          />{" "}
        </Form.Item>
        </Col>
       
     
        <Col span={8}>
        <b>OS Version:</b>
        <Form.Item name="os version">
          {" "}
          <Input
            defaultValue={data.os_version}
            onChange={(e) => handleChange("os version", e.target.value)}

            style={inputStyle}
          />{" "}
        </Form.Item>
        </Col>
        </Row>
        
        <Row gutter={[16, 16]}>
        <Col span={8}>
        <b>Mobile OS: </b>
        <Form.Item name="mobile os">
          {" "}
          <Input
            defaultValue={data.mobile_os}
            onChange={(e) => handleChange("mobile os", e.target.value)}

            style={inputStyle}
          />{" "}
        </Form.Item>
        </Col>
      
        <Col span={8}>
        <b>Processor: </b>
        <Form.Item name="processor">
          {" "}
          <Input
            defaultValue={data.processor}
            onChange={(e) => handleChange("processor", e.target.value)}

            style={inputStyle}
          />{" "}
        </Form.Item>
        </Col>
        <Col span={8}>

        <b>Generation:</b>
        <Form.Item name="generation">
          {" "}
          <Input
            defaultValue={data.Generation}
            onChange={(e) => handleChange("generation", e.target.value)}

            style={inputStyle}
          />{" "}
        </Form.Item>
        </Col>

        </Row>
        <Row gutter={[16, 16]}>
        <Col span={8}>
        <b>Accessories:</b>{" "}
        <Form.Item name="accessories">
          {" "}
          <Input
            defaultValue={data.accessories}
            onChange={(e) => handleChange("accessories", e.target.value)}

            style={inputStyle}
          />{" "}
        </Form.Item>
        </Col>
        <Col span={8}>
        <b>Date of Purchase:</b>{" "}
        <Form.Item name="date of purchase">
          {" "}
          <Input
            defaultValue={formatDate(data.date_of_purchase.toString())}
            onChange={(e) => handleChange("date of purchase", e.target.value)}

            style={inputStyle}
          />{" "}
        </Form.Item>
        </Col>
   
        <Col span={8}>

        <b>Warranty Period:</b>
        <Form.Item name="warranty period">
          {" "}
          <Input
            defaultValue={data.warranty_period}
            onChange={(e) => handleChange("warranty period", e.target.value)}

            style={inputStyle}
          />{" "}
        </Form.Item>
        </Col>
        </Row>
        <Row gutter={[16, 16]}>
        <Col span={8}>

        <b>Approval Status: </b>
        <Form.Item name="date of purchase" style={inputStyle}>
          {data.approval_status}{" "}
        </Form.Item>
        </Col>

      
        <Col span={8}>

        <b>Approver:</b>{" "}
        <Form.Item name="date of purchase">{data.conceder} </Form.Item>
        </Col>

        <Col span={8}>

        <b>Serial Number:</b>{" "}
        <Form.Item name="serial number">
          {" "}
          <Input
            defaultValue={data.serial_number}
            onChange={(e) => handleChange("serail number", e.target.value)}

            style={inputStyle}
          />{" "}
        </Form.Item>
        </Col>

        </Row>
        <Row gutter={[16, 16]}>
        <Col span={8}>

        <b>Model Number:</b>{" "}
        <Form.Item name="model number">
          {" "}
          <Input
            defaultValue={data.model_number}
            onChange={(e) => handleChange("model number", e.target.value)}

            style={inputStyle}
          />{" "}
        </Form.Item>
        </Col>
        <Col span={8}>

        <b>Custodian:</b>
        <Form.Item name="date of purchase" style={inputStyle}>
          {data.custodian}{" "}
        </Form.Item>
        </Col>

    
      
        <Col span={8}>

        <b>Product Name:</b>
        <Form.Item name="product name">
          {" "}
          <Input
            defaultValue={data.product_name}
            onChange={(e) => handleChange("product name", e.target.value)}

            style={inputStyle}
          />{" "}
        </Form.Item>

        </Col>
        </Row>
        <Row gutter={[16, 16]}>
        <Col span={8}>

        <b>Memory:</b>
        <Form.Item
          name="business_unit"
          style={{ boxShadow: "none", border: "none" }}
        >
          <Select
            defaultValue={data.memory}
            style={{ boxShadow: "none", border: "none",width:"200px" }}
            onChange={(value) => handleChange("memory", value)} // Pass only the value
          >
            {uniqueMemoryOptions.map((memory, index) => (
              <Select.Option key={index} value={memory.id}>
                {memory.memory_space}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        </Col>

      
     
        <Col span={8}>

        <b>Storage: </b>
        <Form.Item name="storage">
          {" "}
          <Input
            defaultValue={data.storage}
            onChange={(e) => handleChange("storage", e.target.value)}

            style={inputStyle}
          />{" "}
        </Form.Item>
        </Col>
        <Col span={8}>
        <b>Configuration: </b>
        <Form.Item name="configuration">
          {" "}
          <Input
            defaultValue={data.configuration}
            onChange={(e) => handleChange("configuration", e.target.value)}

            style={inputStyle}
          />{" "}
        </Form.Item>
        </Col>

        </Row>
        <Row gutter={[16, 16]}>
        <Col span={8}>

        <b>Owner: </b>
        <Form.Item name="owner">
          {" "}
          <Input
            defaultValue={data.owner}
            onChange={(e) => handleChange("owner", e.target.value)}

            style={inputStyle}
          />{" "}
        </Form.Item>
        </Col>
        <Col span={8}>

        <b>Requester: </b>
        <Form.Item name="requester">
          {" "}
          <Input
            defaultValue={data.requester}
            onChange={(e) => handleChange("requester", e.target.value)}

            style={inputStyle}
          />{" "}
        </Form.Item>
        </Col>

      
      
        <Col span={8}>

        <b>Comments: </b>
        <Form.Item name="comments">
          {" "}
          <Input
            defaultValue={data.notes}
            onChange={(e) => handleChange("comments", e.target.value)}

            style={inputStyle}
          />{" "}
        </Form.Item>
        </Col>
        </Row>
        <Row gutter={[16, 16]}>
  <Col span={8}>
    <b>Created At: </b>
    <Form.Item name="created_at">
      <Input defaultValue={formatDate(data.created_at)} style={inputStyle} />
    </Form.Item>
  </Col>
  <Col span={8}>
    <b>Updated At: </b>
    <Form.Item name="updated_at">
      <Input defaultValue={formatDate(data.updated_at)} style={inputStyle} />
    </Form.Item>
  </Col>
  <Col span={8}>
    <Form.Item>
      <Button
        style={{
          marginBottom: "40px",
          color: "white",
          border: "none",
          background: "blue",
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





