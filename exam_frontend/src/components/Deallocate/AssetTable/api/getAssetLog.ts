import { AxiosError } from "axios";
import axiosInstance from "../../../../config/AxiosConfig";
import { LogData } from "../types";

const getAssetLog=async (selectedAssetId:string|null):Promise<LogData[]> => {
        
       
        
            const response = await axiosInstance.get(`asset/asset_logs/${selectedAssetId}`);
            console.log('Returned Log Data: ', response.data.data.logs);
            return response.data.data.logs;
      }

      export {getAssetLog}


