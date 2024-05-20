import axiosInstance from "../../../config/AxiosConfig";

const createAssetType = (requestBody) => {
    const res = axiosInstance.post("/asset/asset_type", requestBody).then((res) => {
      console.log("Asset Type Data Returned: ", res.data.data);
      return res.data.data;
    });
    return res;
  };
  
  export { createAssetType };

  const createLocation = (requestBody) => {
    const res = axiosInstance.post("/asset/location", requestBody).then((res) => {
      console.log("Location Data Returned: ", res.data.data);
      return res.data.data;
    });
    return res;
  };
  
  export { createLocation };

  const createBusinessUnit = (requestBody) => {
    const res = axiosInstance.post("/asset/business_unit", requestBody).then((res) => {
      console.log("Business Unit Data Returned: ", res.data.data);
      return res.data.data;
    });
    return res;
  };
  
  export { createBusinessUnit };

  const createMemory = (requestBody) => {
    const res = axiosInstance.post("/asset/memory_list", requestBody).then((res) => {
      console.log("Memory Data Returned: ", res.data.data);
      return res.data.data;
    });
    return res;
  };
  
  export { createMemory };
