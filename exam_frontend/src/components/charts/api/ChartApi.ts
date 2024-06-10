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

export const fetchAssetData = async(): Promise<AssetData> => {
  return initializeAxiosInstance().then(async (instance) => {
    const res = await instance.get('/asset/asset_count');
    if(res.status !== 200){
      throw new Error("Asset Count fetch unsuccessful")
    }
    return res.data.data;
  });
};  

export const fetchAssetTypeData = async(): Promise<any> => { 
  return initializeAxiosInstance().then(async (instance) => {
    const res = await instance.get('/asset/asset_type');
    if(res.status !== 200){
      throw new Error("Asset type fetch unsuccessful")
    }
    return res.data.data;
  });
};