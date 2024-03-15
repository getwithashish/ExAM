import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload as AntUpload, Button } from 'antd';
import { UploadProps, UploadFile } from 'antd/lib/upload';
import axios from 'axios';

const { Dragger } = AntUpload;

const UploadComponent: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile<any>[]>([]);

  const props: UploadProps<any> = {
    name: 'file',
    multiple: true,
    fileList,
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
      setFileList(info.fileList); // Update fileList state
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const handleSubmit = () => {
    const formData = new FormData();

    fileList.forEach(file => {
      if (file.originFileObj) {
        formData.append('file', file.originFileObj);
      }
    });

    axios.post('http://localhost:8000/api/v1/asset/import-csv/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      if (response.status === 200) {
        console.log('Files successfully submitted.');
        message.success('Files successfully submitted.');
        setFileList([]);
      } else {
        console.error('Failed to submit files.');
        message.error('Failed to submit files.');
      }
    })
    .catch(error => {
      console.error('Error submitting files:', error);
      message.error('Error submitting files.');
    });
  };

  return (
    <div>
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click here to upload a csv file</p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibited from uploading company data or other
          banned files.
        </p>
      </Dragger>
      <Button type="primary" onClick={handleSubmit}>Submit</Button>
    </div>
  );
};

export default UploadComponent;
