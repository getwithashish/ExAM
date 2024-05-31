import { DataType } from "../../../../AssetTable/types";

export interface LocationType {
    id: string;
    location_name: string;
}

export interface CardType {
    data: DataType;
    statusOptions: string[];
    businessUnitOptions: string[];
    locations: LocationType[];
    memoryData: string[];
    assetTypeData: string[];
    onUpdate: (updatedData: DataType) => void;
    asset_uuid: string;
    selectedAssetId: string;
}

