
import React, { ReactNode } from 'react';

interface AssignDrawerProps {
  closeAssignDrawer:()=>void
  children: ReactNode;
  isAssign:boolean;

}

export default AssignDrawerProps;

export type EmployeeDetails = {
  id: number; 
  employee_name: string;
  employee_department: string;
  employee_designation: string;
}

export type ApiResponse = {
  message: string;
  data: EmployeeDetails[];
}

export type AssignmentProps ={
  uuid:string
}

export type AssetTableOneProps = {
  showAssignDrawer: (record: any) => void; // Replace 'any' with the appropriate type of record
};