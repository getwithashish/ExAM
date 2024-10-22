import axiosInstance from "../../../config/AxiosConfig";

const getAssetDetails = async (queryParam: any) => {
  try {
    const res = await axiosInstance.get(`/asset/${queryParam}`);
    return res.data.data;
  } catch (error) {
    console.error("Error fetching asset details:", error);
    return [];
  }
};

export { getAssetDetails };

const getLocationOptions = () => {
  const res = axiosInstance.get("/asset/location").then((res) => {
    return res.data.data.filter(location => location.location_name.trim() !== "");
  });
  return res;
};

export { getLocationOptions };

const getAssetTypeOptions = () => {
  const res = axiosInstance.get("/asset/asset_type").then((res) => {
    return res.data.data;
  });
  return res;
};

export { getAssetTypeOptions };

const getMemoryOptions = () => {
  const res = axiosInstance.get("/asset/memory_list").then((res) => {
    return res.data.data;
  });
  return res;
};

export { getMemoryOptions };

const getBusinessUnitOptions = () => {
  const res = axiosInstance.get("/asset/business_unit").then((res) => {
    return res.data.data;
  });
  return res;
};

export { getBusinessUnitOptions };
