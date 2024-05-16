import axiosInstance from "../../../config/AxiosConfig";

const getUserOptions = () => {
    const res = axiosInstance.get("/user").then((res) => {
      console.log("User Data Returned: ", res.data.data);
      return res.data.data;
    });
    return res;
  };
  
  export { getUserOptions };
