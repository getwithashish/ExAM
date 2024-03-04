import React, { useState } from 'react';
import { Button, Input, Space, Table, TableColumnsType } from 'antd';
import DrawerComponent from './DrawerComponent';
import { SearchOutlined } from '@ant-design/icons';
import './AssetTable.css';
import CardComponent from './CardComponent';


export interface DataType {
  key: React.Key;
  AssetId: string;
  AssetCategory: string;
  AssetType: string;
  Version:number;
  Status:string;
  Location:string;
  InVoiceLocation:string,
  BusinessUnit:string;
  Os:string;
  OsVersion:string;
  MobileOs:string;
  Processor:string;
  Generation:string;
  Accessories:string;
  DateOfPurchase:Date;
  WarrantyPeriod:number;
  ApprovalStatus:string;
  Approver:string;
  AssignAsset:string;
  ModelNumber:string;
  SerialNumber:string;
  Custodian:string;
  ProductName:string;
  Memory:string;
  Storage:string;
  Configuration:string;
  Owner:string;
  Requester:string;
  Comments:string;
}

const AssetTable = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  

  const handleRowClick = (record: React.SetStateAction<null>) => {
    setSelectedRow(record);
    setDrawerVisible(true);
  };

  const onCloseDrawer = () => {
    setDrawerVisible(false);
  };

 
  <div><h1>Asset Overview</h1></div>
  const columns: TableColumnsType<DataType> = [
    {
      title: 'Product Name',
      dataIndex: 'ProductName',
      fixed:'left',
      filterIcon: <SearchOutlined rev={undefined} />,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Product Name"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm(null)}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <button
              type="button"
              onClick={confirm}
              
              style={{ width: 90,fontSize:'16px' }}
            >
              Search
            </button>
            <button
              type="button"
              onClick={clearFilters}
              style={{ width: 90,fontSize:'16px' }}
            >
              Reset
            </button>
          </Space>
        </div>
      ),
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.ProductName);
        }
        return record.ProductName.indexOf(value.toString()) === 0;
      },


  
    },

    {
      title: 'Asset Id',
      dataIndex: 'AssetId',
      fixed:'left',
      responsive: ['md'],
      filters: [
        {
          text: 'AC101',
          value: 'AC101',
        },
        {
          text: 'AC102',
          value: 'AC102',
        },
        
      ],
      // Specify the condition of filtering result
      // Here is that finding the name started with `value`
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.AssetId);
        }
        return record.AssetId.indexOf(value.toString()) === 0;
      },
  
      sorter: (a, b) => a.AssetId.localeCompare(b.AssetId),
      sortDirections: ['ascend', 'descend'],
      // sorter: (a, b) => a.AssetId.length - b.AssetId.length,
      // sortDirections: ['descend'],
    },
   
    {
      title: 'Asset Category',
      dataIndex: 'AssetCategory',
      defaultSortOrder: 'descend',
      responsive: ['md'],
      filters:[
        {
          text: 'Software',
          value: 'Software',
        },
        {
          text: 'Hardware',
          value: 'Hardware',
        },
  
      ],
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.AssetCategory);
        }
        return record.AssetCategory.indexOf(value.toString()) === 0;
      },
  
    },
  
    {
      title: 'Asset Type',
      dataIndex: 'AssetType',
      responsive: ['md'],
      filters: [
        {
          text: 'Laptop',
          value: 'Laptop',
        },
        {
          text: 'Monitor',
          value: 'Monitor',
        },
      ],
      
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.AssetType);
        }
        return record.AssetType.indexOf(value.toString()) === 0;
      },
    },
    {
      title: 'Version',
      dataIndex: 'Version',
      responsive: ['md'],
      filters: [
        {
          text: 1,
          value: 1,
        },
        {
          text: 2,
          value: 2,
        },
      ],
      onFilter: (value, record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.Version);
        }
        return record.Version === value;
      },
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      responsive: ['md'],
      filters: [
        {
          text: 'In Use ',
          value: 'In Use',
        },
        {
          text: 'In Store',
          value: 'In Store',
        },
      ],
     
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
     
        if (Array.isArray(value)) {
          return value.includes(record.Status);
        }
        return record.Status.indexOf(value.toString()) === 0;
      },
    },
    {
      title: 'Location',
      dataIndex: 'Location', // Corrected dataIndex
      responsive: ['md'],
      filters: [
        {
          text: 'Kochi ',
          value: 'Kochi',
        },
        {
          text: 'Trivandrum',
          value: 'Trivandrum',
        },
      ],
     
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.Location);
        }
        return record.Location.indexOf(value.toString()) === 0;
      },
    },
    
    {
      title: 'Invoice Location',
      dataIndex: 'InVoiceLocation',
      responsive: ['md'],
      filters: [
        {
          text: 'Kochi ',
          value: 'Kochi',
        },
        {
          text: 'Trivandrum',
          value: 'Trivandrum',
        },
      ],
     
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.InVoiceLocation);
        }
        return record.InVoiceLocation.indexOf(value.toString()) === 0;
      },
    },
    {
      title: 'Business Unit',
      dataIndex: 'BusinessUnit',
      responsive: ['md'],
      filters: [
        {
          text: 'du1 ',
          value: 'du1',
        },
        {
          text: 'du2',
          value: 'du2',
        },
        {
          text: 'du3 ',
          value: 'du3',
        },
        {
          text: 'du4',
          value: 'du4',
        },
      ],
     
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.BusinessUnit);
        }
        return record.BusinessUnit.indexOf(value.toString()) === 0;
      },
    },
    {
      title: 'Os',
      dataIndex: 'Os',
      responsive: ['md'],
      filters: [
        {
          text: 'Linux ',
          value: 'Linux',
        },
        {
          text: 'Windows',
          value: 'Windows',
        },
      ],
     
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.Os);
        }
        return record.Os.indexOf(value.toString()) === 0;
      },
    },
    {
      title: 'Os Version',
      dataIndex: 'OsVersion',
      responsive: ['md'],
      filters: [
        {
          text: '11',
          value: '11',
        },
        {
          text: '12',
          value: '12',
        }
      ],
     
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.OsVersion);
        }
        return record.OsVersion.indexOf(value.toString()) === 0;
      },
    },
    {
      title: 'Mobile Os',
      dataIndex: 'MobileOs',
      responsive: ['md'],
      filters: [
        {
          text: 'iOS',
          value: 'iOS',
        },
        {
          text: 'Android',
          value: 'Android',
        },
      ],
     
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.MobileOs);
        }
        return record.MobileOs.indexOf(value.toString()) === 0;
      },
    },
    {
      title: 'Processor',
      dataIndex: 'Processor',
      responsive: ['md'],
      filters: [
        {
          text: 'i5',
          value: 'i5',
        },
        {
          text: 'i3',
          value: 'i3',
        },
      ],
     
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.Processor);
        }
        return record.Processor.indexOf(value.toString()) === 0;
      },
    },
    {
      title: 'Generation',
      dataIndex: 'Generation',
      responsive: ['md'],
      filters: [
        {
          text: 'In Use ',
          value: 'In Use',
        },
        {
          text: 'In Store',
          value: 'In Store',
        },
      ],
     
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.Generation);
        }
        return record.Generation.indexOf(value.toString()) === 0;
      },
    },
    {
      title: 'Accessories',
      dataIndex: 'Accessories',
      responsive: ['md'],
      filters: [
        {
          text: 'In Use ',
          value: 'In Use',
        },
        {
          text: 'In Store',
          value: 'In Store',
        },
      ],
     
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.Accessories);
        }
        return record.Accessories.indexOf(value.toString()) === 0;
      },
    },
    {
      title: 'Date Of Purchase',
      dataIndex: 'DateOfPurchase',
      responsive: ['md'],
      filters: [
        {
          text: '02/03/24 ',
          value: '02/03/24 ',
        },
        {
          text: '03/03/24 ',
          value: '03/03/24 ',
        },
      ],
     
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        const dateValue = new Date(value as string).getTime(); // Convert filter value to timestamp
    
        // Convert record's DateOfPurchase to timestamp
        const recordDate = new Date(record.DateOfPurchase).getTime();
    
        if (Array.isArray(value)) {
            // If value is an array, check if record's DateOfPurchase is included
            return value.some(val => new Date(val).getTime() === recordDate);
        } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            // If value is a string, number, or boolean, perform strict comparison
            return recordDate === dateValue;
        } else {
            return false; // Return false for other types of value
        }
    },
    
    },
    {
      title: 'Warranty Period',
      dataIndex: 'WarrantyPeriod',
      responsive: ['md'],
      filters: [
        {
          text: ' 2Years',
          value: '2Years',
        },
        {
          text: '3Years',
          value: '3Years',
        },
      ],
     
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.WarrantyPeriod);
        }
        return record.WarrantyPeriod.toString().indexOf(value.toString()) === 0;
      },
    },
    {
      title: 'Warranty Countdown',
      dataIndex: 'WarrantyPeriod',
      responsive: ['md'],
      filters: [
        {
          text: ' 2Years',
          value: '2Years',
        },
        {
          text: '3Years',
          value: '3Years',
        },
      ],
     
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.WarrantyPeriod);
        }
        return record.WarrantyPeriod.toString().indexOf(value.toString()) === 0;
      },
    },
    {
      title: 'Approval Status',
      dataIndex: 'ApprovalStatus',
      responsive: ['md'],
      filters: [
        {
          text: 'Approved ',
          value: 'Approved',
        },
        {
          text: 'Rejected',
          value: 'Rejected',
        },
        {
          text: 'Pending',
          value: 'Pending',
        },
      ],
     
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.ApprovalStatus);
        }
        return record.ApprovalStatus.indexOf(value.toString()) === 0;
      },
    },
    {
      title: 'Approver',
      dataIndex: 'Approver',
      responsive: ['md'],
      filters: [
        {
          text: 'Sfm Lead',
          value: 'Sfm Lead',
        },
        {
          text: 'Sfm Manager',
          value: 'Sfm Manager',
        },
      ],
     
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.Approver);
        }
        return record.Approver.indexOf(value.toString()) === 0;
      },
    },


    {
      title: 'Model Number',
      dataIndex: 'ModelNumber', // Corrected dataIndex
      responsive: ['md'],
      filterIcon: <SearchOutlined rev={undefined} />,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Model Number"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm(null)}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <button
              type="button"
              onClick={confirm}
              
              style={{ width: 90 ,fontSize:'16px'}}
            >
              Search
            </button>
            <button
              type="button"
              onClick={clearFilters}
              
              style={{ width: 90 ,fontSize:'16px' }}
            >
              Reset
            </button>
          </Space>
        </div>
      ),
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.ModelNumber);
        }
        return record.ModelNumber.indexOf(value.toString()) === 0;
      },
    },
    
    
     
  
    {
      title: 'Serial Number',
      dataIndex: 'SerialNumber',
      responsive: ['md'],

      filterIcon: <SearchOutlined rev={undefined} />,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Serial Number"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm(null)}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <button
              type="button"
              onClick={confirm}
              style={{ width: 90,fontSize:'16px' }}
            >
              Search
            </button>
            <button
              type="button"
              onClick={clearFilters}
              style={{ width: 90,fontSize:'16px' }}
            >
              Reset
            </button>
          </Space>
        </div>
      ),
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.SerialNumber);
        }
        return record.SerialNumber.indexOf(value.toString()) === 0;
      },
      
    
    
    },
    {
      title: 'Memory',
      dataIndex: 'Memory',
      responsive: ['md'],
      filters: [
        {
          text: '16Gb',
          value: '16Gb',
        },
        {
          text: '128Gb',
          value: '128Gb',
        },
      ],
      
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.Memory);
        }
        return record.Memory.indexOf(value.toString()) === 0;
      },
    },
    {
      title: 'Storage',
      dataIndex: 'Storage',
      responsive: ['md'],
      filters: [
        {
          text: '16Gb',
          value: '16Gb',
        },
        {
          text: '128Gb',
          value: '128Gb',
        },
      ],
      
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.Storage);
        }
        return record.Storage.indexOf(value.toString()) === 0;
      },
    },
    {
      title: 'Owner',
      dataIndex: 'Owner',
      responsive: ['md'],
  
    
    },
    {
      title: 'Requester',
      dataIndex: 'Requester',
      responsive: ['md'],
      filters: [
        {
          text: 'sfmManger',
          value: 'sfmManager',
        },
        {
          text: 'sfmLead',
          value: 'sfmLead',
        },
        {
          text: 'sfmSenior',
          value: 'sfmSenior',
        },
      ],
      
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.Requester);
        }
        return record.Requester.indexOf(value.toString()) === 0;
      },
  
    
    },
    {
      title: 'Configuration',
      dataIndex: 'Configuration',
      responsive: ['md'],
      filters: [
        {
          text: 'Intel Core i7-1165G7, 16GB RAM, 512GB SSD, 13.4"',
          value: 'Intel Core i7-1165G7, 16GB RAM, 512GB SSD, 13.4"',
        },
        {
          text: 'Intel Core i5-1165G7, 128GB RAM, 512GB SSD, 13.4" ',
          value: 'Intel Core i5-1165G7, 128GB RAM, 512GB SSD, 13.4" ',
        },
      ],
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.Configuration);
        }
        return record.Configuration === value;
      },
    },
    {
      title: 'Custodian',
      dataIndex: 'Custodian',
      responsive: ['md'],
      fixed:'right',
      filterIcon: <SearchOutlined rev={undefined} />,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Custodian"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm(null)}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <button
              type="button"
              onClick={confirm}
              style={{ width: 90 ,fontSize:'16px'}}
            >
              Search
            </button>
            <button
              type="button"
              onClick={clearFilters}
              style={{ width: 90 ,fontSize:'16px'}}
            >
              Reset
            </button>
          </Space>
        </div>
      ),
      onFilter: (value: string | number | boolean | React.ReactText[], record: DataType) => {
        if (Array.isArray(value)) {
          return value.includes(record.Custodian);
        }
        return record.Custodian.indexOf(value.toString()) === 0;
      },
      
    
    

  
    },
    {
      title: 'Comments',
      dataIndex: 'Comments',
      
      // render: () => (
      //   <span>
      //     <FontAwesomeIcon icon={faPlus} className="plus-icon" /> {/* Plus button icon */}
      //   </span>
      // ),
    
    },
    {
      title: 'Assign Asset',
      dataIndex: 'AssignAsset',
      fixed:'right',
      
      // render: () => (
      //   <span>
      //     <FontAwesomeIcon icon={faPlus} className="plus-icon" /> {/* Plus button icon */}
      //   </span>
      // ),
    
    },
  ];
  
  const data = [
    {
      key: '1',
      AssetId: 'AC104',
      AssetCategory: "Software",
      AssetType: 'Laptop',
      Version:1,
      Status:'In Store',
      Location:'Kochi',
      InVoiceLocation:'Trivandrum',
      BusinessUnit:'du1',
      Os:'Linux',
      OsVersion:'11',
      MobileOs:'iOS',
      Processor:'i5',
      Generation:'cjah',
      Accessories:'Bag,Charger',
      DateOfPurchase:'02/03/2024',
      WarrantyPeriod:'2Years',
      ApprovalStatus:'Approved',
      Approver:'Sfm Lead ',
      ModelNumber:'MN001',
      SerialNumber:'Asset001',
      Memory:'16Gb',
      Storage:'16Gb',
      Configuration:'Intel Core i7-1165G7, 16GB RAM, 512GB SSD, 13.4"',

      Custodian:'Asima',
      ProductName:'Dell XPS 15 Laptop',
      Owner:'Experion',
      Requester:'sfmManager'
    },
    {
      key: '2',
      AssetId: 'AC105',
      AssetCategory: "Hardware",
      AssetType: 'Laptop',
      Version:2,
      Status:'In Use',
      Location:'Trivandrum',
      InVoiceLocation:'Trivandrum',
      BusinessUnit:'du1',
      Os:'Windows',
      OsVersion:'11',
      MobileOs:'iOS',
      Processor:'i3',
      Generation:'cjah',
      Accessories:'Bag,Charger',
      DateOfPurchase:'02/03/2024',
      WarrantyPeriod:'2Years',
      ApprovalStatus:'Approved',
      Approver:'Sfm Lead',
      ModelNumber:'MN001',
      SerialNumber:'Asset002',
      Memory:'16Gb',
      Storage:'16Gb',
      Configuration:'Intel Core i7-1165G7, 16GB RAM, 512GB SSD, 13.4" ',

      Custodian:'Aidrin',
      ProductName:'Apple iPhone 12 Pro',
      Owner:'Experion',
      Requester:'sfmLead'
    },
    {
      key: '3',
      AssetId: 'AC103',
      AssetCategory: "Software",
      AssetType: 'Monitor',
      Version:1,
      Status:'Expired',
      Location:'Trivandrum',
      InVoiceLocation:'Trivandrum',
      BusinessUnit:'du1',
      Os:'Linux',
      OsVersion:'11',
      MobileOs:'Android',
      Processor:'i3',
      Generation:'cjah',
      Accessories:'Bag,Charger',
      DateOfPurchase:'02/03/2024',
      WarrantyPeriod:'3Years',
      ApprovalStatus:'Pending',
      Approver:'Sfm Manager',
      ModelNumber:'MN002',
      SerialNumber:'Asset003',
      Memory:'17Gb',
      Storage:'17Gb',
      Configuration:'Intel Core i5-1165G7, 128GB RAM, 512GB SSD, 13.4"',

      Custodian:'Ashish',
      ProductName:'Dell XPS 15 Laptop',
      Owner:'Experion',
      Requester:'sfmLead'
    },
    {
      key: '4',
      AssetId: 'AC101',
      AssetCategory: "Hardware",
      AssetType: 'Monitor',
      Version:1,
      Status:'In Use',
      Location:'Kochi',
      InVoiceLocation:'Trivandrum',
      BusinessUnit:'du1',
      Os:'Linux',
      OsVersion:'11',
      MobileOs:'Android',
      Processor:'i5',
      Generation:'cjah',
      Accessories:'Bag,Charger',
      DateOfPurchase:'02/03/2024',
      WarrantyPeriod:'3Years',
      ApprovalStatus:'Rejected',
      Approver:'Sfm Manager',
      ModelNumber:'MN002',
      SerialNumber:'Asset004',
      Memory:'17Gb',
      Storage:'17Gb',
      Configuration:'Intel Core i5-1165G7, 128GB RAM, 512GB SSD, 13.4"',
      Custodian:'Ananthan',
      ProductName:'Apple iPhone 12 Pro',
      Owner:'Experion',
      Requester:'sfmSenior'
    },
  ];
  
  const drawerTitle = "Asset Details";
  const button = (
    <Button type="primary" ghost size="large">
            Update
          </Button>
  );

  return (
    <>
      <div className='mainHeading'>
        <h1>Asset Overview</h1>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
        scroll={{ x: 'max-content' }}
        className="mainTable"
        pagination={false}
        style={{
          borderRadius: 10,
          padding: 20,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          fontSize: "50px"
        }}
      />
      <DrawerComponent
        visible={drawerVisible}
        onClose={onCloseDrawer}
        selectedRow={selectedRow}
        title={drawerTitle}
        button={button}
      >
      {selectedRow && (
          <div>
            <h2 className='drawerHeading'>{selectedRow.ProductName}</h2>
            <p className='drawerSubHeading'>Asset Id: {selectedRow.AssetId}</p>
          </div>
        )}
        
        
        {selectedRow && <CardComponent data={selectedRow} />}
        {button && (
              <div style={{ 
                marginBottom: '20px',
                marginLeft:'1150px',
                marginTop:'60px',
              }}>{button}</div>
            )}
            
      </DrawerComponent>
    </>
  );
};

export default AssetTable;


