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
import AssetTable from '../components/AssetTable';
import { Assignment } from "../components/Assign/Assignment";
import { Statistics } from "../components/charts/piechartBody";


const DashboardPage: FC = function () {
  return (
    <NavbarSidebarLayout>
      <div>
  
        <Statistics />        
        
        {/* <Addasset/> */}
        <AddAsset/>
      
        <AssetTable />
     
        <div>
      
        </div>
      </div>
    </NavbarSidebarLayout>
  );
};



export default DashboardPage;
