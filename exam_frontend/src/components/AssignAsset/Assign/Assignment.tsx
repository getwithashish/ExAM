import axiosInstance from '../../../config/AxiosConfig';
import { useQuery, useMutation } from '@tanstack/react-query';
import styles from './Assignment.module.css';
import { ApiResponse, EmployeeDetails } from './types';
import { useState, useEffect} from 'react';
import { DataType } from '../AssetTable/types';


interface AssignmentProps {
  record: DataType;
}

export const Assignment: React.FC<AssignmentProps> = ({ record }) => {
  const [query, setQuery] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [fetchData, setFetchData] = useState<boolean>(false); // Initialize as false
  const [employeeId, setEmployeeId] = useState<number>();
  const [divVisible,setdivVisible] = useState<boolean>(false)
  const [showEmployee,setShowEmployee] = useState<boolean>(true)

  const { data, isLoading, isError } = useQuery<ApiResponse>({

    queryKey: ['Assign'],
    enabled: fetchData && query.trim().length > 0,
    queryFn: (): Promise<ApiResponse> => axiosInstance.get(`/asset/employee?name=${query}`).then((res) => {
      console.log(res);
      console.log("res.data", res.data.data);
      return res.data;
    }),
    onSuccess: () => {
     console.log("success")
     setFetchData(false)
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
        alert("unsuccessful, the asset may be already assigned")
        console.log(error)
      }
    }
  );

  useEffect(() => {
    data?setShowEmployee(true):setShowEmployee(false)
    return () => {
      
    };
  }, [value]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setdivVisible(true)
    const inputValue = event.target.value;
    console.log("in the handleinputchange " ,inputValue.trim().length)
    setQuery(inputValue);
    setValue(inputValue);
    if (inputValue.trim().length > 0) {
      console.log("input value > 0",inputValue)
      setFetchData(true);
    }
  };

  const handleNameClick = (name: string, id: number) => {
    setValue(name);
    setShowEmployee(false)
    setEmployeeId(id);
    setdivVisible(false)
    
  };

  const handleAssign = () => {
    setValue("")
    setShowEmployee(true)
 
    if (data != null && !record.custodian) {
      const requestBody = {
        id: employeeId,
        asset_uuid: record.key
      };
      console.log(requestBody);
      mutation.mutate(requestBody);
    } else {
      alert("Please select an employee");
    }
  };



  return (
    <div className={styles['square-box']}>
      <div className={styles['info']}>Asset Name: {record.product_name}</div>
      <div className={styles['info']}>Asset Type: {record.asset_type}</div>
      <div className={styles['info']}>Configuration: {record.configuration}</div>
      <div className={styles['info']}>Location:{record.location}</div>
      <div className={styles['info']}>Asset Serial Number: {record.serial_number}</div>
      <div className={styles['info']}>Asset Model Number: {record.model_number}</div>
      <div className={styles['info']}>Version: {record.version}</div>

      <input type='text' name={"employee"} className={styles['search-input']} placeholder='employee name' onChange={handleInputChange } value={value} />
      <div className={divVisible?styles['info']:styles['result']}>
        <div className={value&&showEmployee ? styles['resultBox'] : styles['result']}>
          { data?.data.length?data.data.map((employee: EmployeeDetails) => (
            <div key={employee.id} onClick={() => handleNameClick(employee.employee_name, employee.id)}>{employee?employee.employee_name:"sorry no employee not found"}</div>
          )):<div>{"No employee available"}</div>}
        </div>
      </div>
      <button className={styles['assign-button']} onClick={handleAssign}>
        Assign
      </button>
    </div>
  );
};
