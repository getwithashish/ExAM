// charts/types.ts

export type AssetCountData = {
    status: string;
    count: number;
  };
  
  export type PieChartGraphProps = {
    type: 'hardware' | 'software';
  };
  
  export type ApiResponse = {
    hardware: AssetCountData[];
    software: AssetCountData[];
  };
  
  export type ChartData = {
    label: string;
    value: number;
  };
  
  export interface CheckboxChangeEvent {
    target: {
      checked: boolean;
    };
  }

  