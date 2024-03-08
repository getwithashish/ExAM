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
  const { data, isLoading, isError } = useQuery<ApiResponse>({
    queryKey: ['Assign'],
    enabled: fetchData,
    queryFn: (): Promise<ApiResponse> => axiosInstance.get(`/asset/employee?query=${query}`).then((res) => {
      console.log(res);
      console.log("res.data",res.data.data)
      setFetchData(false)
      return res.data.data;
      
    }),
  });


    // Define loading and error states
    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching data</div>;
  
  return (
    <div className={styles['square-box']}>
        <div className={styles['info']}>Selected Asset name </div>
        <div className={styles['info']}> asset type </div>
        <div className={styles['info']}> asset id </div>
        <div className={styles['info']}>Asset Cateogry </div>
        <div className={styles['info']}>Asset Model Number </div>
        <div className={styles['info']}>Asset Serial Number </div>
        <div className={styles['info']}>Version </div>
        <div className={styles['info']}>Asset Location </div>
        <div className={styles['info']}>Asset Invoice Location </div>
        <div className={styles['info']}></div>
        <input type='text' name={"employee"} className={styles['search-input']} placeholder='employee id' onInput={(e)=>{const target = e.target as HTMLInputElement;setQuery(target.value); setFetchData(true)} }/>
        
        <button className={styles['assign-button']} onClick={() => {
  if (data != null) {
    console.log("employee name =", data[0].employee_name);
  } else {
    console.log("No employee data available");
  }
}}>
  Assign
</button>
    </div>
  )
}

