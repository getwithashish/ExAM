import React, { useState, useEffect } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload as AntUpload, Button } from "antd";
import { UploadProps, UploadFile } from "antd/lib/upload";
import axiosInstance from "../../config/AxiosConfig";

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
    beforeUpload: (file) => {
      // Prevent default upload behavior
      return false;
    },
    onChange(info) {
      setFileList(info.fileList);
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const handleSubmit = async () => {
    if (fileList.length === 0) {
      message.warning("Please select at least one file to upload.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    let fileExtension = "";

    fileList.forEach((file) => {
      if (file.originFileObj) {
        const fileName = file.originFileObj.name;
        fileExtension = fileName.split(".").pop() || "";
        formData.append("file", file.originFileObj);
      }
    });

    if (!token) {
      message.error("Authentication token not available. Please log in again.");
      setUploading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/asset/import-csv/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        params: {
          file_type: fileExtension,
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
      console.error("Error submitting files:", error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          message.error(`Error: ${error.response.data.message || 'Failed to submit files. Please try again.'}`);
        } else if (error.request) {
          message.error("Network error. Please check your connection and try again.");
        } else {
          message.error("An unexpected error occurred. Please try again.");
        }
      } else {
        message.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setUploading(false);
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
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "import_status.zip");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ height: "70vh" }}>
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click here to upload a csv file</p>
        <p className="ant-upload-hint">Support for a single or bulk upload.</p>
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
