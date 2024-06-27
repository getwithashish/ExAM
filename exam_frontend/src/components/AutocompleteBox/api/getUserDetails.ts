import axiosInstance from "../../../config/AxiosConfig";

const getUserOptions = () => {
    const res = axiosInstance.get("/user").then((res) => {
      return res.data.data;
    });
    return res;
  };
  
  export { getUserOptions };
