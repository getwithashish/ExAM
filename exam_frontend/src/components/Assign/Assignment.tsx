//src/components/Assign/Assignment.tsx
import axiosInstance from '../../config/AxiosConfig'; // Import your Axios instance
import { useQuery } from '@tanstack/react-query'; // Import
import styles from './Assignment.module.css'
import { ApiResponse, EmployeeDetails } from './types';
import { useState } from 'react';
import Item from 'antd/es/list/Item';

export const Assignment = () => {
  
  const [fetchData, setFetchData] = useState(true);
  const [query,setQuery] = useState("")
  const [value,setValue] = useState("")
  const { data, isError } = useQuery<ApiResponse>({
    queryKey: ['Assign'],
    enabled: fetchData && query.trim().length > 0,
    queryFn: (): Promise<ApiResponse> => axiosInstance.get(`/asset/employee?name=${query}`).then((res) => {
      console.log(res);
      console.log("res.data",res.data.data)
      setFetchData(false)
      return res.data.data;
      
    }),
  });

  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setQuery(inputValue);
    setValue(inputValue)
    if (inputValue.trim().length > 0) {
      setFetchData(true);
    }
  };

    // Define loading and error states
   
    if (isError) return <div>Error fetching data</div>;
  
  return (
    <div className={styles['square-box']}>
        <div className={styles['info']}>Selected Asset name </div>
        <div className={styles['info']}> asset type </div>
        <div className={styles['info']}> asset id </div>
        <div className={styles['info']}>Asset Cateogry </div>
        <div className={styles['info']}>Asset Model Number </div>
        <div className={styles['info']}>Version </div>

        <input type='text' name={"employee"} className={styles['search-input']} placeholder='employee id' onInput={handleInputChange}/>
        <div className={value ? styles['info'] : styles['result']}>
        {data && data.map((employee:EmployeeDetails) => (
          <div key={employee.id}>{employee.employee_name}</div>
        ))}
      </div>
        <button className={styles['assign-button']} onClick={() => {
  if (data != null) {
  
  } else {
    console.log("No employee data available");
  }
}}>
  Assign
</button>
    </div>
  )
}

