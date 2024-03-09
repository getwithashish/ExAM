
import React, { ReactNode } from 'react';

interface SideDrawerProps {
  buttonTextDefault: string;
  children: ReactNode;
  displayDrawer:boolean;
}

export default SideDrawerProps;

export type EmployeeDetails={
  id:BigInteger;
	employee_name:string;
  employee_department:string;
	employee_designation:string;
}

export type ApiResponse={
  message:string;
  data:EmployeeDetails[];
}