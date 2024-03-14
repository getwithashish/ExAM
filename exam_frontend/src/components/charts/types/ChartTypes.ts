export interface AssetCountData {
  total_assets: number;
  asset_status: {
    [key: string]: number;
  };
};
export interface AssetDetailStatus{
  total_assets: number;
  asset_detail_status:{
    [key: string]: number;
  }
}
export interface AssignDetailStatus{
  assign_status:{
    [key: string]: number;
  }
}




export type ChartData = {
  label: string;
  value: number;
};
export type ChartDetailData = {
  label: string;
  value: number;
};
export type ChartAssignData = {
  label: string;
  value: number;
}



export interface PieChartGraphProps {
  selectedAssetType: string;
  type: string; // Add the type prop here
}
export interface PieChartAssetGraphProps{
  selectedAssetType: string;
  type: string;
}
export interface PieChartAssignGraphProps{
  selectedAssetType: string;
  type: string;
}




export interface AssetTypeData {
  id: number;
  asset_type_name: string;
}
export interface AssetDetailStatusData {
  id: number,
  asset_detail_status: string;
  asset_type_name: string;
}
export interface AssignDetailStatusData {
  id: number,
  assign_status: string;
  asset_type_name: string;
}
