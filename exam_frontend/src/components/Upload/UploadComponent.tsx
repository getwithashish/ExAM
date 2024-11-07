import React, { useState, useEffect } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload as AntUpload, Button, Modal, Card } from "antd";
import { UploadProps, UploadFile } from "antd/lib/upload";
import axiosInstance from "../../config/AxiosConfig";
import axios, { AxiosError } from "axios";
import { ErrorResponse } from "./types/types";
import { motion } from "framer-motion";
import { useUploading } from "./UploadContext";

const { Dragger } = AntUpload;

const UploadComponent: React.FC = ({ initial_import = false }) => {
  const [fileList, setFileList] = useState<UploadFile<any>[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const { uploading, setUploading } = useUploading();

  const [modalVisible, setModalVisible] = useState(false);
  const [importSummary, setImportSummary] = useState({});

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
      const response = await axiosInstance.post(
        `${initial_import ? "/asset/import/initial" : "/asset/import/"}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          params: {
            file_type: getFileExtension(),
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        setImportSummary(response.data.data.import_summary);
        setModalVisible(true);

        if (response.status == 200) {
          message.error(response.data?.message);
        } else if (response.status == 206) {
          message.warning(response.data?.message);
        } else if (response.status == 202) {
          message.success(response.data?.message);
          return;
        }

        if (response.data.data.encoded_zip) {
          downloadZipFile(response.data.data.encoded_zip);
        } else {
          console.warn("No zip file data received");
        }
      } else {
        console.warn("Unexpected response status:", response.status);
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      handleUploadError(error);
    } finally {
      setUploading(false);
      setFileList([]);
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
        message.error(
          `Error: ${
            responseData?.message || "Failed to submit files. Please try again."
          }`
        );
      } else if (axiosError.request) {
        console.error("Request error:", axiosError.request);
        message.error(
          "Network error. Please check your connection and try again."
        );
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
      const link = document.createElement("a");
      link.href = url;
      link.download = "import_results.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error processing zip file data:", error);
      message.error("Failed to process download file. Please try again.");
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  return (
    <div style={{ height: "70vh" }}>
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click here to upload a CSV or XLSX file
        </p>
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

      <Modal
        title="Status of Asset Import"
        open={modalVisible}
        onCancel={handleModalClose}
        footer={null}
        className="text-white p-6 rounded-lg shadow-lg"
        styles={{
          header: {
            borderRadius: 0,
            backgroundColor: "transparent",
          },
          mask: {
            backdropFilter: "blur(10px)",
          },
          content: {
            backgroundColor: "transparent",
            boxShadow: "0 0 5px #999",
          },
        }}
        width={700}
      >
        <div className="bg-transparent grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            {
              title: "Imported",
              count: importSummary["imported_assets_count"],
              colorClass: "text-green-500",
            },
            {
              title: "Duplicate",
              count: importSummary["skipped_assets_count"],
              colorClass: "text-blue-500",
            },
            {
              title: "Missing Fields",
              count: importSummary["missing_fields_assets_count"],
              colorClass: "text-orange-500",
            },
            {
              title: "Invalid Fields",
              count: importSummary["invalid_fields_assets_count"],
              colorClass: "text-red-500",
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: index * 0.2 }} // Delay based on index
              className="p-4 flex"
            >
              <Card
                className={`bg-custom-500 ${item.colorClass} flex-1 h-full rounded-lg shadow-md transition-transform transform hover:scale-105 flex flex-col justify-between`}
              >
                <div>
                  <h3 className="text-xl text-center font-bold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-2xl text-center font-bold pt-2">
                    {item.count}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default UploadComponent;
