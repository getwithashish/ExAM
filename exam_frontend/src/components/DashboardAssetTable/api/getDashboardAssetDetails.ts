import axiosInstance from "../../../config/AxiosConfig";

const getAssetDetails = async (query_params="") => {
  try {
    const res = await axiosInstance.get(`/asset/?limit=20${query_params}`);
    return res.data.data;
  } catch (error) {
    console.error("Error fetching asset details:", error);
    return [];
  }
};

export { getAssetDetails };

const getLocationOptions = async () => {
  try {
    const res = await axiosInstance.get("/asset/location");
    return res.data.results;
  } catch (error) {
    console.error("Error fetching location options:", error);
    return [];
  }
};

export { getLocationOptions };

const getAssetTypeOptions = async () => {
  try {
    const res = await axiosInstance.get("/asset/asset_type");
    return res.data.data;
  } catch (error) {
    console.error("Error fetching asset type options:", error);
    return [];
  }
};

export { getAssetTypeOptions };

const getMemoryOptions = async () => {
  try {
    const res = await axiosInstance.get("/asset/memory_list");
    return res.data.data;
  } catch (error) {
    console.error("Error fetching memory options:", error);
    return [];
  }
};

export { getMemoryOptions };
