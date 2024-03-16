import axiosInstance from '../../../config/AxiosConfig';
import { useQuery, useMutation } from '@tanstack/react-query';
import styles from './Assignment.module.css';
import { ApiResponse, EmployeeDetails } from './types';
import { useState } from 'react';
import { DataType } from '../AssetTable/types';

interface AssignmentProps {
  record: DataType;
}

export const Assignment: React.FC<AssignmentProps> = ({ record }) => {
  const [query, setQuery] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [fetchData, setFetchData] = useState<boolean>(false); // Initialize as false
  const [employeeId, setEmployeeId] = useState<number>();
  

  const { data, isLoading, isError } = useQuery<ApiResponse>({
    queryKey: ['Assign'],
    enabled: fetchData && query.trim().length > 0,
    queryFn: (): Promise<ApiResponse> => axiosInstance.get(`/asset/employee?name=${query}`).then((res) => {
      console.log(res);
      console.log("res.data", res.data.data);
      return res.data;
    }),
    onSuccess: () => {
      
    },
    onError: () => {
      // Reset the states in case of error
      setValue("");
      setEmployeeId(undefined);
    }
  });

  const mutation = useMutation(
    (requestData: any) => axiosInstance.post('/asset/assign_asset', requestData),
    {
      onSuccess: () => {
        alert("successfully assigned")
      },
      onError: (error) => {
        alert("unsuccessful, try again")
        console.log(error)
      }
    }
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    console.log("in the handleinputchange " ,inputValue)
    setQuery(inputValue);
    setValue(inputValue);
    if (inputValue.trim().length > 0) {
      console.log("input value > 0")
      setFetchData(true);
    }
  };

  const handleNameClick = (name: string, id: number) => {
    setValue(name);
    
    setEmployeeId(id);
  };

  const handleAssign = () => {
    if (data != null && !record.custodian) {
      const requestBody = {
        id: employeeId,
        asset_uuid: record.key
      };
      console.log(requestBody);
      mutation.mutate(requestBody);
    } else {
      alert("Cannot assign since there is a custodian");
    }
  };

  return (
    <div className={styles['square-box']}>
      <div className={styles['info']}>Asset Name: {record.product_name}</div>
      <div className={styles['info']}>Asset Type: {record.asset_type}</div>
      <div className={styles['info']}>Configuration: {record.configuration}</div>
      <div className={styles['info']}>Asset Serial Number: {record.serial_number}</div>
      <div className={styles['info']}>Asset Model Number: {record.model_number}</div>
      <div className={styles['info']}>Version: {record.version}</div>

      <input type='text' name={"employee"} className={styles['search-input']} placeholder='employee id' onChange={handleInputChange } value={value} />
      <div className={value ? styles['info'] : styles['result']}>
        {isLoading ? <div>Loading...</div>: isError ? <div>Error Fetching data </div> : data && data.data.map((employee: EmployeeDetails) => (
          <div key={employee.id} onClick={() => handleNameClick(employee.employee_name, employee.id)}>{employee.employee_name}</div>
        ))}
      </div>
      <button className={styles['assign-button']} onClick={handleAssign}>
        Assign
      </button>
    </div>
  );
};
