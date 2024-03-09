export interface DataType {
  key: React.Key;
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
  approval_status:string;
  conceder:string;
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