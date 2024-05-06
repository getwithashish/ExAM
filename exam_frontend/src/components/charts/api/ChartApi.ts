import { AssetData } from '../types/ChartTypes';
import axiosInstance from '../../../config/AxiosConfig'; // Assuming AxiosConfig is an ES6 module

let axiosInstanceInitialized = false;

const initializeAxiosInstance = () => {
  if (!axiosInstanceInitialized) {
    axiosInstanceInitialized = true;
  }
};

export const fetchAssetData = (): Promise<AssetData> => {
  initializeAxiosInstance();
  return axiosInstance.get('/asset/asset_count').then((res: any) => res.data.data);
};

export const fetchAssetTypeData = () => {
  initializeAxiosInstance();
  return axiosInstance.get('/asset/asset_type').then((res: any) => res.data.data);
}