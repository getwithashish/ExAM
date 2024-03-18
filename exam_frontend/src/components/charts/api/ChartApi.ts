import axiosInstance from '../../../config/AxiosConfig';
import { AssetData } from '../types/ChartTypes';

export const fetchAssetData = (): Promise<AssetData> => // Function to fetch asset data/ asset count from the server
    axiosInstance.get('/asset/asset_count').then((res) => res.data.data);
