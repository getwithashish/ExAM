import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../config/AxiosConfig";
import { AssetResult } from "../types";

const getAssetDetails = async (queryParam="") => {
  try {
    const res = await axiosInstance.get(`/asset/?limit=20${queryParam}`);
    console.log("Returned Data: ", res.data.data.results);
    return res.data.data;
  } catch (error) {
    console.error("Error fetching asset details:", error);
    return [];
  }
};

export { getAssetDetails };

const getLocationOptions = () => {
  const res = axiosInstance.get("/asset/location").then((res) => {
    console.log("Location Data Returned: ", res.data.results);
    return res.data.results;
  });
  return res;
};

export { getLocationOptions };

const getAssetTypeOptions = () => {
  const res = axiosInstance.get("/asset/asset_type").then((res) => {
    console.log("Asset Type Data Returned: ", res.data.data);
    return res.data.data;
  });
  return res;
};

export { getAssetTypeOptions };

const getMemoryOptions = () => {
  const res = axiosInstance.get("/asset/memory_list").then((res) => {
    console.log("Memory Data Returned: ", res.data.data);
    return res.data.data;
  });
  return res;
};

export { getMemoryOptions };
