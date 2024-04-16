import React, { useState, useEffect } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload as AntUpload, Button } from "antd";
import { UploadProps, UploadFile } from "antd/lib/upload";
import axios from "axios";
import axiosInstance from "../../config/AxiosConfig";
 
const { Dragger } = AntUpload;
 
const UploadComponent: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile<any>[]>([]);
  const [token, setToken] = useState<string | null>(null);
 
  useEffect(() => {
    // Fetch JWT token from localStorage
    const storedToken = localStorage.getItem("jwt");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);
 
  const props: UploadProps<any> = {
    name: "file",
    multiple: true,
    fileList,
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
      setFileList(info.fileList); // Update fileList state
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
 
  const handleSubmit = () => {
    const formData = new FormData();
 
    fileList.forEach((file) => {
      if (file.originFileObj) {
        formData.append("file", file.originFileObj);
      }
    });
 
    // Check if token is available
    if (token) {
      axiosInstance
        .post("http://localhost:8000/api/v1/asset/import-csv/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Send JWT token in the Authorization header
          },
        })
        .then((response) => {
          if (response.status === 200) {
            console.log("Files successfully submitted.");
            message.success("Files successfully submitted.");
            setFileList([]);
          } else {
            console.error("Failed to submit files.");
            message.error("Failed to submit files.");
          }
        })
        .catch((error) => {
          console.error("Error submitting files:", error);
          message.error("Error submitting files.");
        });
    } else {
      console.error("Token not available.");
      message.error("Token not available.");
    }
  };
 
  return (
    <div
      style={{
        height: "70vh",
      }}
    >
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click here to upload a csv file</p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload.
        </p>
      </Dragger>
      <Button
        style={{
          marginTop: 20,
          marginTop: 20,
        }}
        onClick={handleSubmit}
      >
        Import
      </Button>
    </div>
  );
};
 
export default UploadComponent;
 