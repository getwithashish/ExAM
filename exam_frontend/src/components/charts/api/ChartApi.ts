import { AxiosInstance } from 'axios';
import { AssetData } from '../types/ChartTypes';

let axiosInstance: AxiosInstance | null = null;

const initializeAxiosInstance = () => {
  if (!axiosInstance) {
    return import('../../../config/AxiosConfig').then(({ default: instance }) => {
      axiosInstance = instance;
      return axiosInstance;
    });
  } else {
    return Promise.resolve(axiosInstance);
  }
};

export const fetchAssetData = (): Promise<AssetData> => {
  return initializeAxiosInstance().then((instance) => {
    return instance.get('/asset/asset_count').then((res: any) => res.data.data);
  });
};

export const fetchAssetTypeData = (): Promise<any> => { 
  return initializeAxiosInstance().then((instance) => {
    return instance.get('/asset/asset_type').then((res: any) => res.data.data);
  });
};
