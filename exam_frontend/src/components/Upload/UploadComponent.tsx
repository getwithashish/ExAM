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
      console.error("Dropped files", e.dataTransfer.files);
    },
  };

  const handleSubmit = () => {
    const formData = new FormData();
    let fileExtension = "";

    fileList.forEach((file) => {
      if (file.originFileObj) {
        const fileName = file.originFileObj.name;
        fileExtension = fileName.split(".").pop();
        formData.append("file", file.originFileObj);
      }
    });
    
    if (token) {
      axiosInstance
        .post("/asset/import-csv/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, 
          },
          params: {
            file_type: fileExtension,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            message.success("Files successfully submitted.");
            const byteCharacters = atob(response.data);
            const byteNumbers = Array.from(byteCharacters, (char) =>
              char.charCodeAt(0)
            );
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: "application/zip" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "import_status.zip"); 
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
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
        <p className="ant-upload-hint">Support for a single or bulk upload.</p>
      </Dragger>
      <Button
        style={{
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
