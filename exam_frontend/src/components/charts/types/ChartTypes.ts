// types.ts

export interface AssetCountData {
  total_assets: number;
  asset_status: {
    [key: string]: number;
  
  };
  asset_detail_status:{
    [key: string]: number;
  
  };
  assign_status:{
    [key: string]: number;
  
  };
};

export type ChartData = {
  label: string;
  value: number;
};

export interface PieChartGraphProps {
  selectedAssetType: string;
  type: string; // Add the type prop here
}
export interface AssetTypeData {
  id: number;
  asset_type_name: string;
}
