/* eslint-disable jsx-a11y/anchor-is-valid */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type FC, useContext } from "react";
import NavbarSidebarLayout from "../layouts/navbar-sidebar";
import AddAsset from "../components/AddAsset/AddAsset";
import AssetTable from '../components/AssetTable/AssetTable'
import { Statistics } from "../components/charts/Statistics";
import SideDrawerComponent from "../components/SideDrawerComponent/SideDrawerComponent";
import { SidebarHandler } from "../components/Sidebar/SidebarHandler";
import AssignmentDrawer from "../components/Assign/AssignmentDrawer";
import { Assignment } from "../components/Assign/Assignment";
import TableNavbar from "../components/TableNavBar/TableNavbar";
// import Upload from "antd/es/upload/Upload";
import { Upload } from "antd";
import {styles} from '../components/SideDrawerComponent/SideDrawerComponent.module.css'
import UploadComponent from "../components/Upload/UploadComponent";
import SidebarComponentNew from "../components/sidebar/SidebarComponentNew";


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
  
   

 const toggleDrawer = () => {
  setDisplayDrawer(!displaydrawer);
};




  return (
   
      
        <div>
          {/* <SidebarHandler addAsset={showDefaultDrawer} /> */}
            <Statistics />        
            
          
       


        
                    <AssetTable showDrawer={showDefaultDrawer} />
                    

                  {/* <SideDrawerComponent  displayDrawer={displaydrawer} closeDrawer={closeDrawer}>
                    <AddAsset/>
                  </SideDrawerComponent>    */}

                    

                  {/* <AssignmentDrawer buttonTextDefault="Import" displayDrawer={showUpload} >
                    <UploadComponent/>
                  </AssignmentDrawer> */}

                  {/* <SideDrawerComponent  displayDrawer={displaydrawer} closeDrawer={toggleDrawer}>
                  <div className="{styles.small-upload}">
                  <UploadComponent />
                  </div>
                  </SideDrawerComponent>  */}

            <div>      
          </div>
        </div>
    
  );
};

export default DashboardPage;
