/* eslint-disable jsx-a11y/anchor-is-valid */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type FC } from "react";
import NavbarSidebarLayout from "../layouts/navbar-sidebar";
import AddAsset from "../components/AddAsset/AddAsset";
import AssetTable from '../components/AssetTable/AssetTable'
import { Statistics } from "../components/charts/piechartBody";
import SideDrawerComponent from "../components/SideDrawerComponent/SideDrawerComponent";
import { SidebarHandler } from "../components/sidebar/SidebarHandler";
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
    <QueryClientProvider client={new QueryClient()}>
      <NavbarSidebarLayout>
        <div>
          <SidebarHandler addAsset={showDefaultDrawer} />
            <Statistics />        
                
        <AssignmentDrawer buttonTextDefault="Assign" displayDrawer={displaydrawer} >
          <Assignment />
        </AssignmentDrawer>

                    <AssetTable showDrawer={showDefaultDrawer} />

                  <SideDrawerComponent  buttonTextLarge="Add an asset" displayDrawer={displaydrawer} closeDrawer={closeDrawer}>
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
