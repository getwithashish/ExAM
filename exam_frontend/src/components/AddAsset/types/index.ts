export interface AssetData {
    category: string;
    assetID: string;
    version: number;
    assetType: string;
    productName: string;
    modelNumber: string;
    serialNumber: string;
    owner: string;
    custodianName: string;
    purchaseDate: Date;
    warrantyPeriod: number;
    productLocation: string;
    invoiceLocation: string;
    businessUnit: string;
    os: string;
    osVersion: string;
    mobileOS: string;
    processor: number;
    processorGeneration: string;
    memory: string;
    storage: number;
    configuration: number;
    accessories: number;
    status: string;
    notes: string;
    approvalStatus: string;
    message: string;
  }
  
  export interface MemoryListItem {
    id: number;
    memory_space: number;
  }