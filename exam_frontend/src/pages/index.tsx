/* eslint-disable jsx-a11y/anchor-is-valid */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type FC } from "react";
import NavbarSidebarLayout from "../layouts/navbar-sidebar";
import AddAsset from "../components/AddAsset/AddAsset";
import AssetTable from '../components/AssetTable/AssetTable'
import { Statistics } from "../components/charts/Statistics";
import SideDrawerComponent from "../components/SideDrawerComponent/SideDrawerComponent";
import { SidebarHandler } from "../components/Sidebar/SidebarHandler";
import AssignmentDrawer from "../components/Assign/AssignmentDrawer";
import { Assignment } from "../components/Assign/Assignment";


const DashboardPage: FC = function () {
  const [displaydrawer,setDisplayDrawer] = useState(false)
 
  
    const showDefaultDrawer =()=>{
      setDisplayDrawer(true)
      console.log("displaydrawer value is ",displaydrawer)
    }
   const closeDrawer = ()=> {
    setDisplayDrawer(false)
    console.log("displaydrwer value is " ,displaydrawer)
   }
  
  

  return (
   
      <NavbarSidebarLayout>
        <div>
          <SidebarHandler addAsset={showDefaultDrawer} />
            <Statistics />        
                
        

                    <AssetTable  />

                  <SideDrawerComponent  displayDrawer={displaydrawer} closeDrawer={closeDrawer}>
                    <AddAsset/>
                  </SideDrawerComponent>   

            <div>      
          </div>
        </div>
      </NavbarSidebarLayout>
    
  );
};

export default DashboardPage;
