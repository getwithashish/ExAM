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
    },
  };

  const handleSubmit = async () => {
    if (fileList.length === 0) {
      message.warning("Please select at least one file to upload.");
      return;
    }

    setUploading(true);
    const formData = new FormData();

    fileList.forEach((file) => {
      if (file.originFileObj) {
        formData.append("file", file.originFileObj);
      }
    });

    try {
      if (!token) {
        throw new Error("Authentication token not available. Please log in again.");
      }

      const response = await axiosInstance.post("/asset/import-csv/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        params: {
          file_type: getFileExtension(),
        },
      });

      if (response.status === 200) {
        message.success("Files successfully submitted.");
        downloadZipFile(response.data);
        setFileList([]);
      } else {
        throw new Error("Unexpected response status");
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
      return "";
    }
    const fileName = firstFile.originFileObj.name;
    return fileName.split(".").pop() || "";
  };

  const handleUploadError = (error: any) => {
    console.error("Error submitting files:", error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        const responseData = axiosError.response.data as ErrorResponse;
        message.error(`Error: ${responseData.message || 'Failed to submit files. Please try again.'}`);
      } else if (axiosError.request) {
        message.error("Network error. Please check your connection and try again.");
      } else {
        message.error("An unexpected error occurred. Please try again.");
      }
    } else {
      message.error("An unexpected error occurred. Please try again.");
    }
  };

  const downloadZipFile = (data: string) => {
    const byteCharacters = atob(data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/zip" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
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
