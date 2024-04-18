export interface AssetData{
  total_assets: number;
  status_counts: { [key: string]: number };
    asset_detail_status:{
      [key: string]: number;
    };
    assign_status:{
      [key: string]: number;
    };
    asset_type_counts: Record<string, number>;
}

export interface PieChartGraphProps {
  selectedAssetType?: string;
  type?: string;
}

export interface AssetDetailData{
  id: number;
  asset_type_name: string;
  asset_detail_status_name: string;
  assign_status_name: string;
}

export type ChartData = {
  label: string;
  value: number;
  color?: string;
};