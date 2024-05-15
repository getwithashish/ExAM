import axiosInstance from "../../../config/AxiosConfig";

const getAssetTypeOptions = () => {
    const res = axiosInstance.post("/asset/asset_type").then((res) => {
      console.log("Asset Type Data Returned: ", res.data.data);
      return res.data.data;
    });
    return res;
  };
  
  export { getAssetTypeOptions };