// ParentFolder/api/AssetApi.ts
import axiosInstance from '../../../config/AxiosConfig';

export const fetchAssetData = (): Promise<any> => {
    return axiosInstance.get('/asset/asset_count').then((res) => {
        return res.data.data;
    });
};
