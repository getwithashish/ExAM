import axiosInstance from '../../../config/AxiosConfig';
import { useQuery, useMutation } from '@tanstack/react-query';
import styles from './Assignment.module.css';
import { ApiResponse, EmployeeDetails } from './types';
import { useState, useEffect} from 'react';
import { DataType } from '../AssetTable/types';
import { message } from 'antd';


interface AssignmentProps {
  record: DataType;
}

export const Assignment: React.FC<AssignmentProps> = ({ record }) => {
  const [query, setQuery] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [fetchData, setFetchData] = useState<boolean>(false); // Initialize as false
  const [employeeId, setEmployeeId] = useState<number>();
  const [divVisible,setdivVisible] = useState<boolean>(false)
  const [employeeDepartment,setEmployeeDepartment]=useState<string>("")
  const [employeeDesignation,setEmployeeDesignation] = useState<string>("")
  const [employeeName,setEmployeeName] = useState<string>("")

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
        message.success("successfully assigned")
      },
      onError: (error) => {
        message.error("unsuccessful, the asset may be already assigned")
        console.log(error)
      }
    }
  );

  useEffect(() => {
    
    if(value=="")
    {
      setEmployeeId(undefined)
      

    }
    return () => {
      
    };
  }, [value]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(value,"value",name,"name")
    setdivVisible(true)
    const inputValue = event.target.value;
    console.log("in the handleinputchange " ,inputValue.trim().length)
    setQuery(inputValue);
    setValue(inputValue);
    if (inputValue.trim().length > 0) {
      console.log("input value > 0",inputValue)
      setFetchData(true);
    }
    if(value!=employeeName)
     setEmployeeId(undefined)
  };

  const handleNameClick = (name: string, id: number, department:string, designation:string,) => {
    setValue(name);
    setEmployeeName(name)
    setShowEmployee(false)
    setEmployeeId(id);
    setdivVisible(false)
    setEmployeeDepartment(department)
    setEmployeeDesignation(designation)
    console.log("handle name clck worked")
    
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
<div>
 <div>
  <form >
    <div className="grid font-display grid-cols-2 gap-3 lg:grid-cols-5 my-3 text-sm">
      <div>
        <label htmlFor="productName">ASSET NAME:</label>
        <input type="text" id="productName" value={record.product_name} className='mt-1 font-display rounded-lg'  disabled/>
      </div>
      <div>
        <label htmlFor="assetType">ASSET TYPE:</label>
        <input type="text" id="assetType" value={record.asset_type} className='mt-1 font-display rounded-lg' disabled/>
      </div>
      <div>
        <label htmlFor="configuration">CONFIGURATION:</label>
        <input type="text" id="configuration" value={record.configuration} className='mt-1 font-display rounded-lg'  disabled/>
      </div>  
    <div>
      <label htmlFor="location">LOCATION:</label>
      <input type="text" id="location" value={record.location} className='mt-1 font-display rounded-lg' disabled />
    </div>
    <div>
      <label htmlFor="serialNumber">ASSET SERIAL NUMBER:</label>
      <input type="text" id="serialNumber" value={record.serial_number} className='mt-1 font-display rounded-lg' disabled/>
    </div>
    <div>
      <label htmlFor="modelNumber">ASSET MODEL NUMBER:</label>
      <input type="text" id="modelNumber" value={record.model_number} className='mt-1 font-display rounded-lg' disabled />
    </div>
    <div>
      <label htmlFor="version">VERSION:</label>
      <input type="text" id="version" value={record.version} className='mt-1 font-display rounded-lg' disabled />
    </div>
    <div>
      <label htmlFor="version">VERSION:</label>
      <input type="text" id="version" value={record.version} className='mt-1 font-display rounded-lg' disabled />
    </div>
    <div>
      <label htmlFor="version">VERSION:</label>
      <input type="text" id="version" value={record.version} className='mt-1 font-display rounded-lg' disabled />
    </div>
    <div>
      <label htmlFor="version">VERSION:</label>
      <input type="text" id="version" value={record.version} className='mt-1 font-display rounded-lg' disabled />
    </div>
    </div>
  </form>
 </div>

      <input type='text' name={"employee"} className={styles['search-input']}  placeholder='employee name' onChange={handleInputChange } value={value} />
      <div className={divVisible?styles['']:styles['result']}>
        <div className={value&&data? styles[''] : styles['result']}>
          { data?.data.length?data.data.map((employee: EmployeeDetails) => (
            <div className={styles['resultBox']}key={employee.id} onClick={() => handleNameClick(employee.employee_name, employee.id,employee.employee_department,employee.employee_designation)}>{employee?employee.employee_name:"sorry no employee not found"}</div>
          )):<div>{"No employee available"}</div>}
        </div>
      </div>
      <div>
      <button className={styles['assign-button']} onClick={handleAssign}>
        Assign
      </button>
      </div>

      <div className={employeeName==value&&value?styles['employeeBox']:styles['result']}>
            {
              <div>
              <div>employee id :{employeeId}</div>
              <div>employee designation : {employeeDesignation}</div>
              <div>employee department : {employeeDepartment}</div>
              </div>
            }
    </div>

      
</div>
  );
};
