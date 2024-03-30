export interface DataType {
    asset_uuid: any;
    key: string;
    asset_id: string;
    asset_category: string;
    asset_type: string;
    version:number;
    status:string;
    location:string;
    invoice_location:string,
    business_unit:string;
    os:string;
    os_version:string;
    mobile_os:string;
    processor:string;
    Generation:string;
    accessories:string;
    date_of_purchase:Date;
    warranty_period:number;
    WarrantyCountdown:number;
    approval_status:string;
    approved_by:string;
    AssignAsset:string;
    model_number:string;
    serial_number:string;
    custodian:string;
    product_name:string;
    memory:string;
    storage:string;
    configuration:string;
    owner:string;
    requester:string;
    notes:string;
    created_at:Date;
    updated_at:Date;
    
  }
   export interface ColumnFilterItem {
    text: React.ReactNode;
    value: string | number | boolean;
  }
  export interface AssetResult {
    status: string; 
    business_unit:string;
    location:string;
  
  }
  
  export interface FilterDropdownProps {
    setSelectedKeys: (keys: React.ReactText[]) => void;
    selectedKeys: React.ReactText[];
    confirm: () => void;
    clearFilters: () => void;
  }
  
  interface Location {
    id: number;
    location_name: string;
  }
  
  interface BusinessUnit {
    id: number;
    business_unit_name: string;
  }
  
  interface AssetType {
    id: number;
    asset_type_name: string;
  }
  
  interface InvoiceLocation {
    id: number;
    invoice_location_name: string;
  }
  
  interface Custodian {
    id: number;
    employee_name: string;
  }
  
  interface Requester {
    id: number;
    requester_name: string;
  }
  
  interface AssetLog {
    id:string,
    accessories: string | null;
    approval_status_message: string | null;
    approved_by_id: number | null;
    asset_category: string;
    asset_detail_status: string;
    asset_id: string;
    assign_status: string;
    configuration: string | null;
    created_at: string;
    date_of_purchase: string;
    is_deleted: boolean;
    mobile_os: string | null;
    model_number: string;
    notes: string | null;
    os: string;
    os_version: string;
    owner: string;
    processor: string | null;
    processor_gen: string | null;
    product_name: string;
    serial_number: string;
    status: string;
    storage: string | null;
    updated_at: string;
    version: number;
    warranty_period: number;
    location: Location;
    business_unit: BusinessUnit;
    asset_type: AssetType;
    invoice_location: InvoiceLocation;
    custodian: Custodian;
    requester: Requester;
  }
  
  export interface LogData {
    id:number,
    asset_uuid: string;
    timestamp: string;
    asset_log: AssetLog;
  }
  export interface AssetTableProps {
    logsData: LogData[] | undefined;
    isLoading: boolean;
    isSuccess: boolean;
    selectedAssetId: string | null;
    setSelectedAssetId: React.Dispatch<React.SetStateAction<string | null>>;
    handleRowClick: (record: any) => void;
    onCloseDrawer: () => void;
    selectedRow: any;
    drawerVisible: boolean;
    assetData: any;
    columns:any;
    expandedRowRender?: (assetId: string) => JSX.Element | null;
    statusOptions: string[],
    businessUnitOptions: string[],
    locations:string[],
    memoryData:string[],
    assetTypeData:string[],
    handleUpdateData: (updatedData: {
      key: any;
  }) => void,
    drawerTitle:string
    asset_uuid: string;
  }
  
  