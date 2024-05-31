import axiosInstance from "../../../config/AxiosConfig";

export const getAssetLifecycleLogs = async (assetUuid: string) => {
  try {
    const response = await axiosInstance.get(`/asset/asset_lifecycle/${assetUuid}`);
    if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data.logs)
    ) {
      return response.data.data.logs;
    } else {
      throw new Error("Invalid response data format");
    }
  } catch (error) {
    console.error("Error fetching asset logs", error);
    throw error;
  }
};