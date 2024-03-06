/* eslint-disable jsx-a11y/anchor-is-valid */
import { Badge, Dropdown, useTheme } from "flowbite-react";
import type { FC } from "react";
import NavbarSidebarLayout from "../layouts/navbar-sidebar";
// import Addasset from '../components/Addasset'
import AddAsset from "../components/AddAsset/AddAsset";

// import { FaFilter } from "react-icons/fa";
import { Drawer, Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import React, { useState, useEffect } from 'react';
import AssetTable from '../components/AssetTable/AssetTable'
import { Assignment } from "../components/Assign/Assignment";
import { Statistics } from "../components/charts/piechartBody";
// import AddAssetSideDrawer from "../components/SideDrawerComponent/AddAssetSideDrawer";
import SideDrawerComponent from "../components/SideDrawerComponent/SideDrawerComponent";
import { SidebarHandler } from "../components/sidebar/SidebarHandler";
import AssignmentDrawer from "../components/Assign/AssignmentDrawer";


const DashboardPage: FC = function () {
const [displaydrawer,setDisplayDrawer] = useState(false)

  const showDefaultDrawer =()=>{
    setDisplayDrawer(true)
  }
  return (
    <NavbarSidebarLayout>
      <div>
        <SidebarHandler />
        <Statistics />        
     
        
       <AssignmentDrawer buttonTextDefault="Add an asset" displayDrawer={displaydrawer} >
        <Assignment />
       </AssignmentDrawer>
          
        
     
        <AssetTable  showDrawer={showDefaultDrawer}/> 

        <SideDrawerComponent buttonTextDefault="Add an asset" buttonTextLarge="Add an asset">

        <AddAsset/>
        </SideDrawerComponent>
     
        <div>
      
        </div>
      </div>
    </NavbarSidebarLayout>
  );
};



export default DashboardPage;
