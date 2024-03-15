import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Space,
  Input,
  Button,
  Select,
  ConfigProvider,
  Row,
  Col,
} from "antd";
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
  assetTypeData,
}) => {
  const uniqueStatusOptions = Array.from(new Set(statusOptions));
  const uniqueBusinessOptions = Array.from(new Set(businessUnitOptions));
  const uniqueLocationoptions = Array.from(new Set(locations));
  const uniqueMemoryOptions = Array.from(new Set(memoryData));
  const uniqueAssetTypeOptions = Array.from(new Set(assetTypeData));

  const inputStyle: React.CSSProperties = {
    border: "0.5px solid #d3d3d3",
    width: "180px",
    boxShadow: "none",
    textAlign: "left",
    background:" #f5f5fb",
    borderRadius: "5px"
    
  };

  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  
  const formItems = [
    
  
    {
      label: "Asset Category",
      value: (
        
        <Form.Item name="assetCategory"style={{ flex: "1" }} className="formItem">
          <b style={{ display: "block" }}>
            Asset Category:{" "}
          </b>{" "}
          <br></br>
          <Input
            defaultValue={data.asset_category}
            onChange={(e) => handleChange("assetCategory", e.target.value)}
            style={inputStyle}
          />{" "}
        </Form.Item>
        
      ),
    },
    {
      label: "Asset Type",
      value: (
        
        <Form.Item name="status" style={{ flex: "1", marginLeft: "8px" }}className="formItem">
          <b> Asset Type:</b>
          <br></br>
          <br></br>
          <Select
            defaultValue={data.asset_type}
            style={{ boxShadow: "none", border: "none", width: "180px",background:"#f0f0fa",height:"40px" }}
            onChange={(value) => handleChange("asset_type", value)}
          >
            {uniqueAssetTypeOptions.map((asset_type, index) => (
              <Select.Option key={index} value={asset_type.id}>
                {asset_type.asset_type_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
  
      ),
    },
    { label: "Version", value:  (
    
    <Form.Item name="version" style={{ flex: "1", marginLeft: "8px" }}className="formItem">
    <b>Version: </b>
    <br></br>
    <br></br>
      {" "}
      <Input
        defaultValue={data.version}
        onChange={(e) => handleChange("version", e.target.value)}
        style={inputStyle}
      />{" "}
    </Form.Item> 
    ),},


      { label: "Asset Status", name: "assetStatus", value: <Form.Item
      name="status"
      style={{ boxShadow: "none", border: "none" }}
    >
         <b> Asset Status:</b>
         <br></br>
    <br></br>
      <Select
        defaultValue={uniqueStatusOptions[0]}
        style={{ boxShadow: "none", border: "none", width: "180px",height:"40px" }}
        onChange={(value) => handleChange("status", value)} // Pass only the value
      >
        {uniqueStatusOptions.map((status, index) => (
          <Select.Option key={index} value={status}>
            {status}
          </Select.Option>
        ))}
      </Select>
    </Form.Item> },
    { label: "Location", name: "location", value:  <Form.Item
    name="location"
    style={{ boxShadow: "none", border: "none" }}
  >
       <b> Asset Location:</b>
       <br></br>
    <br></br>
    <Select
      defaultValue={data.location}
      style={{ boxShadow: "none", border: "none", width: "180px",height:"40px" }}
      onChange={(value) => handleChange("location", value)}
    >
      {uniqueLocationoptions.map((location, index) => (
        <Select.Option key={index} value={location.id}>
          {location.location_name}
        </Select.Option>
      ))}
    </Select>
  </Form.Item> },
      { label: "Location", name: "location", value:   <Form.Item
      name="location"
      style={{ boxShadow: "none", border: "none" }}
    >
       <b>Invoice Location:</b>
       <br></br>
    <br></br>
      <Select
        defaultValue={data.invoice_location}
        style={{ boxShadow: "none", border: "none", width: "180px",height:"40px" }}
        onChange={(value) => handleChange("invoice_location", value)} // Pass only the value
      >
        {uniqueLocationoptions.map((location, index) => (
          <Select.Option key={index} value={location.id}>
            {location.location_name}
          </Select.Option>
        ))}
      </Select>
    </Form.Item> },

    { label: "OS", name: "os", value:    <Form.Item name="os">
    <b>OS: </b>
    <br></br>
    <br></br>
      {" "}
      <Input
        defaultValue={data.os}
        onChange={(e) => handleChange("os", e.target.value)}
        style={inputStyle}
      />{" "}
    </Form.Item> },
    { label: "OS Version", name: "osVersion", value:  <Form.Item name="os version">
    <b>OS Version:</b>
    <br></br>
    <br></br>
      {" "}
      <Input
        defaultValue={data.os_version}
        onChange={(e) => handleChange("os version", e.target.value)}
        style={inputStyle}
      />{" "}
    </Form.Item> },
    { label: "Mobile OS", name: "mobileOs", value:   <Form.Item name="mobile os">
    <b>Mobile OS: </b>
    <br></br>
    <br></br>
      {" "}
      <Input
        defaultValue={data.mobile_os}
        onChange={(e) => handleChange("mobile os", e.target.value)}
        style={inputStyle}
      />{" "}
    </Form.Item> },
        { label: "Processor", name: "processor", value:    <Form.Item name="processor">
        <b>Processor: </b>
        <br></br>
    <br></br>
          {" "}
          <Input
            defaultValue={data.processor}
            onChange={(e) => handleChange("processor", e.target.value)}
            style={inputStyle}
          />{" "}
        </Form.Item> },
    { label: "Generation", name: "generation", value: <Form.Item name="generation">
    <b>Generation:</b>
    <br></br>
    <br></br>
      {" "}
      <Input
        defaultValue={data.Generation}
        onChange={(e) => handleChange("generation", e.target.value)}
        style={inputStyle}
      />{" "}
    </Form.Item>  },
    { label: "Accessories", name: "accessories", value:  
    <Form.Item name="accessories">
    <b>Accessories:</b>{" "}
    <br></br>
    <br></br>
      {" "}
      <Input
        defaultValue={data.accessories}
        onChange={(e) => handleChange("accessories", e.target.value)}
        style={inputStyle}
      />{" "}
    </Form.Item> },
    { label: "Date of Purchase", name: "dateOfPurchase", value: <Form.Item name="date of purchase">
    <b>Date of Purchase:</b>{" "}
    <br></br>
    <br></br>
      {" "}
      <Input
        defaultValue={formatDate(data.date_of_purchase.toString())}
        onChange={(e) =>
          handleChange("date of purchase", e.target.value)
        }
        style={inputStyle}
      />{" "}
    </Form.Item> },
    { label: "Warranty Period", name: "warrantyPeriod", value: <Form.Item name="warranty period">
    <b>Warranty Period:</b>
    <br></br>
    <br></br>
      {" "}
      <Input
        defaultValue={data.warranty_period}
        onChange={(e) =>
          handleChange("warranty period", e.target.value)
        }
        style={inputStyle}
      />{" "}
    </Form.Item> },
    { label: "Approval Status", name: "approvalStatus", value: <Form.Item name="date of purchase">
    <b>Approval Status: </b>
    <br></br>
    <br></br>
    {" "}
    <Input
      defaultValue={data.approval_status}
      onChange={(e) =>
        handleChange("serail number", e.target.value)
      }
      style={inputStyle}
    />{" "}
  
    </Form.Item> },
    { label: "Approver", name: "approver", value:              
     <Form.Item name="date of purchase"> 
     <b>Approved By:</b>
     <br>
     </br>
     <br></br>
     {" "}
    <Input
      defaultValue={data.conceder}
      onChange={(e) =>
        handleChange("serail number", e.target.value)
      }
      style={inputStyle}
    />{" "}
     {" "} </Form.Item>
  },
  { label: "Serial Number", name: "serialNumber", value:    <Form.Item name="serial number">
  <b>Serial Number:</b>{" "}
  <br></br>
    <br></br>
    {" "}
    <Input
      defaultValue={data.serial_number}
      onChange={(e) =>
        handleChange("serail number", e.target.value)
      }
      style={inputStyle}
    />{" "}
  </Form.Item> },

{ label: "Model Number", name: "modelNumber", value:  <Form.Item name="model number">
<b>Model Number:</b>{" "}
<br></br>
    <br></br>
  {" "}
  <Input
    defaultValue={data.model_number}
    onChange={(e) => handleChange("model number", e.target.value)}
    style={inputStyle}
  />{" "}
</Form.Item> },
{ label: "Custodian", name: "custodian", value:   <Form.Item name="date of purchase" >
<b>Custodian:</b>
<br></br>
    <br></br>
    {" "}
  <Input
    defaultValue={data.custodian}
    onChange={(e) => handleChange("model number", e.target.value)}
    style={inputStyle}
  />{" "}
</Form.Item> },
{ label: "Owner", name: "owner", value:  <Form.Item name="owner">
<b>Owner: </b>
<br></br>
    <br></br>
  {" "}
  <Input
    defaultValue={data.owner}
    onChange={(e) => handleChange("owner", e.target.value)}
    style={inputStyle}
  />{" "}
</Form.Item> },
{ label: "Requester", name: "requester", value:  
<Form.Item name="requester">
<b>Requester: </b>
<br></br>
    <br></br>
  {" "}
  <Input
    defaultValue={data.requester}
    onChange={(e) => handleChange("requester", e.target.value)}
    style={inputStyle}
  />{" "}
</Form.Item> },
{ label: "Comments", name: "comments", value: <Form.Item name="comments">
<b>Comments: </b>
<br></br>
    <br></br>
  {" "}
  <Input
    defaultValue={data.notes}
    onChange={(e) => handleChange("comments", e.target.value)}
    style={inputStyle}
  />{" "}
</Form.Item> },
{ label: "Product Name", name: "productName", value:  <Form.Item name="product name">
<b>Product Name:</b>
<br></br>
    <br></br>
  {" "}
  <Input
    defaultValue={data.product_name}
    onChange={(e) => handleChange("product name", e.target.value)}
    style={inputStyle}
  />{" "}
</Form.Item> },

{ label: "Business Unti", name: "businessUnit", value:   
<Form.Item
  name="business_unit"
  style={{ boxShadow: "none", border: "none" }}
>
   <b>Business Unit:</b>
   <br></br>
    <br></br>
  <Select
    defaultValue={uniqueBusinessOptions[0]}
    style={{ boxShadow: "none", border: "none", width: "180px" ,height:"40px"}}
    onChange={(value) => handleChange("business_unit", value)} // Pass only the value
  >
    {uniqueBusinessOptions.map((business_unit, index) => (
      <Select.Option key={index} value={business_unit} style={{  background:" #f0f0fa",}}>
        {business_unit}
      </Select.Option>
    ))}
  </Select>
</Form.Item> },

{ label: "Memory", name: "memory", value:  <Form.Item
name="business_unit"
style={{ boxShadow: "none", border: "none" }}
>
  
<b>Memory:</b>
<br></br>
    <br></br>
<Select
  defaultValue={data.memory}
  style={{ boxShadow: "none", border: "none", width: "180px",height:"40px" }}
  onChange={(value) => handleChange("memory", value)} // Pass only the value
>
  {uniqueMemoryOptions.map((memory, index) => (
    <Select.Option key={index} value={memory.id}>
      {memory.memory_space}
    </Select.Option>
  ))}
</Select>
</Form.Item> },
{ label: "Storage", name: "storage", value:   
<Form.Item name="storage">
<b>Storage: </b>
<br></br>
    <br></br>
  {" "}
  <Input
    defaultValue={data.storage}
    onChange={(e) => handleChange("storage", e.target.value)}
    style={inputStyle}
  />{" "}
</Form.Item> },
{ label: "Configuration", name: "configuration", value:     
<Form.Item name="configuration">
<b>Configuration: </b>
<br></br>
    <br></br>
  {" "}
  <Input
    defaultValue={data.configuration}
    onChange={(e) =>
      handleChange("configuration", e.target.value)
    }
    style={inputStyle}
  />{" "}
</Form.Item> },
{ label: "Created At", name: "createdAt", value:     <Form.Item name="created_at">
<b>Created At: </b>
<br></br>
    <br></br>
  <Input
    defaultValue={formatDate(data.created_at)}
    style={inputStyle}
  />
</Form.Item>},
{ label: "Updated At", name: "updatedAt", value:<Form.Item name="updated_at">
<b>Updated At: </b>
<br></br>
    <br></br>
  <Input
    defaultValue={formatDate(data.updated_at)}
    style={inputStyle}
  />
</Form.Item> },
  ];

  // Filter form items based on search query
  const filteredFormItems = formItems.filter(
    (item) =>
      item.label.toLowerCase().includes(searchQuery) ||
      (typeof item.value === "string" &&
        item.value.toLowerCase().includes(searchQuery))
  );

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

  // const handleChange = (name, value) => {
  //   setEditedData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };

  const handleUpdate = async () => {
    try {
      const response = await axiosInstance.patch(
        "/asset/update",
        {
          asset_id: data.asset_id,
          data: editedData,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Check if the response contains a message indicating success
      if (
        response.data &&
        response.data.message === "Asset details successfully updated."
      ) {
        // Check if the response contains the updated asset data
        if (response.data && response.data.data) {
          // Update the data state with the received updated data
          onUpdate(response.data.data);
        }
        alert("Data updated successfully!");
      } else {
        // Handle the case where the asset could not be found
        alert(
          "The requested asset could not be found. Please review the details and try again."
        );
      }
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Error updating data");
    }
  };

  const mainCardStyle = {
   
    width: "90%",
    display: "flex",
    flexWrap: "wrap",
    background:"white",
    marginLeft: "7%",
    alignItems: "flex-start"
  
  
  };
  const formItemStyle = {
    flex: "0 0 calc(16.66% - 20px)", // Six items in one row (adjust margin)
    margin: "10px", // Adjust margin as needed
    boxSizing: "border-box",
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
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "";
    }
    return date.toLocaleString();
  }

  return (
    <div>
      
      <Input
        placeholder="Search..."
        onChange={handleChange}
        style={{    border: "0.5px solid #d3d3d3",
        marginTop:"30px" ,marginBottom: "30px",width:"300px" ,height:"30px", borderRadius: "5px",    background:" #f5f5fb",}}
      />

<Button
        style={{
          marginBottom: "40px",
          color: "white",
          border: "none",
          background: "blue",
          marginLeft:"800px"
        }}
        onClick={handleUpdate}
      >
        Update
      </Button>
      <Form
        key={data.asset_id}
        className="mainCard"
        title=""
        style={mainCardStyle}
      >
        {filteredFormItems.map((item, index) => (
          <Form.Item key={index}>
             <div key={index} style={formItemStyle}>
            {item.value}
        </div>
            
          </Form.Item>
        ))}

        <div className="rowone">
          
    
        </div>
       
      </Form>
    </div>
  );
};
export default CardComponent;
