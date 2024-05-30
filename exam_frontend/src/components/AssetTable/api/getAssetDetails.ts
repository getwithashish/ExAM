import axiosInstance from "../../../config/AxiosConfig";

export const getAssetDetails = async (queryParam = "") => {
  try {
    const res = await axiosInstance.get(`/asset/?limit=20${queryParam}`);
    return res.data.data || [];
  } catch (error) {
    console.error("Error fetching asset details:", error);
    return [];
  }
};

export const getLocationOptions = async () => {
  try {
    const res = await axiosInstance.get("/asset/location");
    return res.data.results || [];
  } catch (error) {
    console.error("Error fetching location options:", error);
    return [];
  }
};

export const getAssetTypeOptions = async () => {
  try {
    const res = await axiosInstance.get("/asset/asset_type");
    return res.data.data || [];
  } catch (error) {
    console.error("Error fetching asset type options:", error);
    return [];
  }
};

export const getMemoryOptions = async () => {
  try {
    const res = await axiosInstance.get("/asset/memory_list");
    return res.data.data || [];
  } catch (error) {
    console.error("Error fetching memory options:", error);
    return [];
  }
};
