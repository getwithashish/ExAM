import { DataType } from "../../AssetTable/types/index";

export interface CardType {
  data?: DataType;
  statusOptions?: string[];
  businessUnitOptions?: string[];
  locations?: string[];
  memoryData?: string[];
  assetTypeData?: string[];
  onUpdate?: (updatedData: DataType) => void;
  asset_uuid?: string;
  selectedAssetId?: any;
  isMyApprovalPage?: boolean;
  selectedRow?: string;
  onDelete?: any;
  onClose?: any;
  formattedExpiryDate?: string;
  setDrawerVisible?: (flag: boolean) => void;
  assetDataRefetch?:any;
}
