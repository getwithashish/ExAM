/* eslint-disable jsx-a11y/anchor-is-valid */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { FC } from "react";
import NavbarSidebarLayout from "../layouts/navbar-sidebar";
import AddAsset from "../components/AddAsset/AddAsset";
import AssetTable from '../components/AssetTable/AssetTable'
import { Statistics } from "../components/charts/piechartBody";
import SideDrawerComponent from "../components/SideDrawerComponent/SideDrawerComponent";
import { SidebarHandler } from "../components/sidebar/SidebarHandler";
import AssignmentDrawer from "../components/Assign/AssignmentDrawer";


const DashboardPage: FC = function () {
const [displaydrawer,setDisplayDrawer] = useState(false)

  const showDefaultDrawer =()=>{
    setDisplayDrawer(true)
  }
  return (
    <QueryClientProvider client={new QueryClient()}>
      <NavbarSidebarLayout>
        <div>
          <SidebarHandler />
            <Statistics />        
                
            <AssignmentDrawer buttonTextDefault="Add an asset" displayDrawer={displaydrawer} >
        <Assignment />
       </AssignmentDrawer>
                    <AssetTable />
                  <SideDrawerComponent buttonTextDefault="Add an asset" buttonTextLarge="Add an asset">
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
