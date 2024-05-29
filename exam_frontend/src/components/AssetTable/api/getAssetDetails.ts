import axiosInstance from "../../../config/AxiosConfig";

export const getAssetDetails = async (queryParam="") => {
  try {
    const res = await axiosInstance.get(`/asset/?limit=20${queryParam}`);
    return res.data.data;
  } catch (error) {
    console.error("Error fetching asset details:", error);
    return [];
  }
};

export const getLocationOptions = () => {
  const res = axiosInstance.get("/asset/location").then((res) => {
    return res.data.results;
  });
  return res;
};

export const getAssetTypeOptions = () => {
  const res = axiosInstance.get("/asset/asset_type").then((res) => {
    return res.data.data;
  });
  return res;
};


export const getMemoryOptions = () => {
  const res = axiosInstance.get("/asset/memory_list").then((res) => {
    return res.data.data;
  });
  return res;
};
