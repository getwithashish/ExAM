import { AxiosInstance } from 'axios';
import { AssetData } from '../types/ChartTypes';

let axiosInstance: AxiosInstance | null = null;

const initializeAxiosInstance = async () => {
  if (!axiosInstance) {
    const { default: instance } = await import('../../../config/AxiosConfig');
    axiosInstance = instance;
    return axiosInstance;
  } else {
    return Promise.resolve(axiosInstance);
  }
};

export const fetchAssetData = async (): Promise<AssetData> => {
  const instance = await initializeAxiosInstance();
  const res = await instance.get('/asset/asset_count');
  console.log(res.data.data, 'assetCount')
  return res.data.data;
};

export const fetchAssetTypeData = async (): Promise<any> => { 
  const instance = await initializeAxiosInstance();
  const res = await instance.get('/asset/asset_type');
  return res.data.data;
};
