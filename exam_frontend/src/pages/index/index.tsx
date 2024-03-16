/* eslint-disable jsx-a11y/anchor-is-valid */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type FC } from "react";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import AddAsset from "../../components/AddAsset/AddAsset";
import AssetTable from '../../components/AssetTable/AssetTable'
import SideDrawerComponent from "../../components/SideDrawerComponent/SideDrawerComponent";
import { SidebarHandler } from "../../components/sidebar/SidebarHandler";
import AssignmentDrawer from "../../components/Assign/AssignmentDrawer";
import { Assignment } from "../../components/Assign/Assignment";
// import { Statistics } from "../../components/charts/Statistics";
import { RecordProps } from "./types";
import ExportButton from "../../components/Export/Export";
import { DataType } from "../../components/AssetTable/types";


const DashboardPage: FC = function () {
const [displaydrawer,setDisplayDrawer] = useState(false)
const [isAssign,setIsAssign] = useState(false)
const [record,setRecord] = useState<DataType>()

  const showDefaultDrawer =()=>{
    setDisplayDrawer(true)
    console.log("displaydrawer value is ",displaydrawer)
  }
 const closeDrawer = ()=> {
  setDisplayDrawer(false)
  console.log("displaydrwer value is " ,displaydrawer)
 }

 const showAssignDrawer =(record:DataType)=>{
  console.log("uuid",record)
  setRecord(record)
  setIsAssign(true)
  console.log("displaydrawer value is ",displaydrawer)
}
const closeAssignDrawer = ()=> {
setIsAssign(false)
console.log("displaydrwer value is " ,displaydrawer)
}
  
  return (
    <QueryClientProvider client={new QueryClient()}>
      <NavbarSidebarLayout>
        <div>
           
        <ExportButton />
          <SidebarHandler addAsset={showDefaultDrawer} />
            {/* <Statistics />         */}
            
            
            {record && (
        <AssignmentDrawer closeAssignDrawer={closeAssignDrawer} isAssign={isAssign}>
           <Assignment record={record} />
        </AssignmentDrawer>
)}

                    <AssetTable />

                  <SideDrawerComponent  displayDrawer={displaydrawer} closeDrawer={closeDrawer}>
                    <AddAsset/>
                  </SideDrawerComponent>   

            <div>      
          </div>
        </div>
        
      </NavbarSidebarLayout>
    </QueryClientProvider>   
  );
};

export default DashboardPage;
