import React, { useState, useEffect } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload as AntUpload, Button } from "antd";
import { UploadProps, UploadFile } from "antd/lib/upload";
import axiosInstance from "../../config/AxiosConfig";
import axios, { AxiosError } from "axios";
import { ErrorResponse } from "./types/types";

const { Dragger } = AntUpload;

const UploadComponent: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile<any>[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("jwt");
    if (storedToken) {
      setToken(storedToken);
      console.log("Token retrieved from localStorage");
    } else {
      console.warn("No token found in localStorage");
    }
  }, []);

  const props: UploadProps<any> = {
    name: "file",
    multiple: true,
    fileList,
    beforeUpload: () => false,
    onChange: (info) => {
      setFileList(info.fileList);
    },
    onDrop: (e) => {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const handleSubmit = async () => {
    if (fileList.length === 0) {
      message.warning("Please select at least one file to upload.");
      return;
    }

    if (!token || token.trim() === "") {
      message.error("Invalid authentication token. Please log in again.");
      return;
    }

    setUploading(true);
    const formData = new FormData();

    fileList.forEach((file) => {
      if (file.originFileObj) {
        formData.append("file", file.originFileObj);
      }
    });

    console.log("Submitting files:", fileList);
    console.log("File type:", getFileExtension());

    try {
      const response = await axiosInstance.post("/asset/import-csv/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        params: {
          file_type: getFileExtension(),
        },
      });

      console.log("Submission response:", response);

      if (response.status >= 200 && response.status < 300) {
        message.success(response.data.message);
        console.log("Response data:", response.data);
        
        if (response.data.zip_file) {
          downloadZipFile(response.data.zip_file);
        } else {
          console.warn("No zip file data received");
        }
        
        setFileList([]);
      } else {
        console.warn("Unexpected response status:", response.status);
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      handleUploadError(error);
    } finally {
      setUploading(false);
    }
  };

  const getFileExtension = () => {
    const firstFile = fileList[0];
    if (!firstFile || !firstFile.originFileObj) {
      console.warn("No file selected or file object missing");
      return "";
    }
    const fileName = firstFile.originFileObj.name;
    const extension = fileName.split(".").pop() || "";
    console.log("File extension:", extension);
    return extension;
  };

  const handleUploadError = (error: any) => {
    console.error("Error submitting files:", error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response) {
        console.error("Response data:", axiosError.response.data);
        console.error("Response status:", axiosError.response.status);
        const responseData = axiosError.response.data;
        message.error(`Error: ${responseData.message || 'Failed to submit files. Please try again.'}`);
      } else if (axiosError.request) {
        console.error("Request error:", axiosError.request);
        message.error("Network error. Please check your connection and try again.");
      } else {
        console.error("Error message:", axiosError.message);
        message.error("An unexpected error occurred. Please try again.");
      }
    } else {
      console.error("Non-Axios error:", error);
      message.error("An unexpected error occurred. Please try again.");
    }
  };

  const downloadZipFile = (data: string) => {
    if (!data) {
      console.error("No data received for zip file download");
      message.error("Failed to generate download file. Please try again.");
      return;
    }

    try {
      const binaryData = atob(data);
      const byteNumbers = new Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        byteNumbers[i] = binaryData.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/zip" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'import_results.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error processing zip file data:", error);
      message.error("Failed to process download file. Please try again.");
    }
  };

  return (
    <div style={{ height: "70vh" }}>
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click here to upload a CSV file</p>
        <p className="ant-upload-hint">Support for single or bulk upload.</p>
      </Dragger>
      <Button
        style={{ marginTop: 20 }}
        onClick={handleSubmit}
        loading={uploading}
        disabled={fileList.length === 0}
      >
        Import
      </Button>
    </div>
  );
};

export default UploadComponent;