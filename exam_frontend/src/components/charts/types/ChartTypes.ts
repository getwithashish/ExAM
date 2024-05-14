export interface AssetData {
  total_assets: number;
  status_counts: { [key: string]: number };
  asset_detail_status: {
    [key: string]: number;
  };
  assign_status: {
    [key: string]: number;
  };
  asset_type_counts: Record<string, number>;
}
export interface PieChartGraphProps {
  assetCountData: {
    total_assets: number;
    status_counts: { [key: string]: number };
    asset_detail_status: { [key: string]: number };
    assign_status: { [key: string]: number };
    asset_type_counts: { [key: string]: number };
  };
  selectedAssetType?: string;
  type?: string;
  selectedTypeId: number;
  setSelectedTypeId: (id: number) => void;
  setAssetState: React.Dispatch<React.SetStateAction<string | null>>;
  setDetailState: React.Dispatch<React.SetStateAction<string | null>>;
  setAssignState: React.Dispatch<React.SetStateAction<string | null>>;
}
export interface AssetDetailData {
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
