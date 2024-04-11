import { useState, useEffect } from "react";
import "react-querybuilder/dist/query-builder.css";
import axiosInstance from "../../../config/AxiosConfig";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ApiResponse } from "./types";
import { DataType } from "../../AssetTable/types";
import { message, Spin } from "antd";
import { Assignment } from "./Assignment";

interface AssignmentHandlerProps {
  record: DataType | null;
  closeAssignDrawer: () => void;
}

export const AssignmentHandler: React.FC<AssignmentHandlerProps> = ({
  record,
  closeAssignDrawer,
}) => {
  const [query, setQuery] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [fetchData, setFetchData] = useState<boolean>(false); // Initialize as false
  const [employeeId, setEmployeeId] = useState<number>();
  const [divVisible, setdivVisible] = useState<boolean>(false);
  const [employeeDepartment, setEmployeeDepartment] = useState<string>("");
  const [employeeDesignation, setEmployeeDesignation] = useState<string>("");
  const [employeeName, setEmployeeName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  const { data } = useQuery<ApiResponse>({
    queryKey: ["Assign"],
    enabled: fetchData && query.trim().length > 0,
    queryFn: (): Promise<ApiResponse> =>
      axiosInstance.get(`/asset/employee?name=${query}`).then((res) => {
        console.log(res);
        console.log("res.data", res.data.data);
        return res.data;
      }),
    onSuccess: () => {
      console.log("success");
      setFetchData(false);
    },
    onError: () => {
      // Reset the states in case of error
      setValue("");
      setEmployeeId(undefined);
    },
  });

  const mutation = useMutation(
    (requestData: any) =>
      axiosInstance.post("/asset/assign_asset", requestData),
    {
      onSuccess: () => {
        message.success("successfully assigned");
        setLoading(false);
        closeAssignDrawer();
      },
      onError: (error) => {
        message.error("unsuccessful, the asset may be already assigned");
        setLoading(false);
        console.log(error);
        closeAssignDrawer();
      },
    }
  );

  useEffect(() => {
    if (value == "") {
      setEmployeeId(undefined);
    }
    return () => {};
  }, [value]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(value, "value", name, "name");
    setdivVisible(true);
    const inputValue = event.target.value;
    console.log("in the handleinputchange ", inputValue.trim().length);
    setQuery(inputValue);
    setValue(inputValue);
    if (inputValue.trim().length > 0) {
      console.log("input value > 0", inputValue);
      setFetchData(true);
    }
    if (value != employeeName) setEmployeeId(undefined);
  };

  const handleNameClick = (
    name: string,
    id: number,
    department: string,
    designation: string
  ) => {
    setValue(name);
    setEmployeeName(name);

    setEmployeeId(id);
    setdivVisible(false);
    setEmployeeDepartment(department);
    setEmployeeDesignation(designation);
    console.log("handle name clck worked");
  };

  const handleAssign = () => {
    setValue("");
    setLoading(true);

    if (data != null && record) {
      const requestBody = {
        id: employeeId,
        asset_uuid: record.key,
      };
      console.log(requestBody);
      mutation.mutate(requestBody);
    } else {
      alert("Please select an employee");
    }
  };

  return (
    <>
      <Spin spinning={loading}>
        <Assignment
          value={value}
          employeeId={employeeId}
          divVisible={divVisible}
          employeeDepartment={employeeDepartment}
          employeeDesignation={employeeDesignation}
          employeeName={employeeName}
          data={data}
          handleInputChange={handleInputChange}
          handleNameClick={handleNameClick}
          handleAssign={handleAssign}
          record={record}
        />
      </Spin>
    </>
  );
};
