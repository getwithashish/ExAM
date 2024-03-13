import axiosInstance from "../../../config/AxiosConfig";

const getAssetLog=async (selectedAssetId:string|null) => {
    
        console.log("selected", selectedAssetId)
        if (selectedAssetId) {
          try {
            const response = await axiosInstance.get(`asset/asset_logs/${selectedAssetId}`);
            console.log('Returned Log Data: ', response.data.data.data.logs);
            return response.data.data.logs;
          } catch (error) {
            console.error('Error fetching asset logs:', error);
            throw new Error('Failed to fetch asset logs');
          }
        } else {
          return []; 
        }
      }

      export {getAssetLog}


