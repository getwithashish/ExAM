/* eslint-disable jsx-a11y/anchor-is-valid */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { FC } from "react";
import NavbarSidebarLayout from "../layouts/navbar-sidebar";
import AddAsset from "../components/AddAsset/AddAsset";
import AssetTable from '../components/AssetTable/AssetTable'
import { Statistics } from "../components/Charts/Statistics";
import SideDrawerComponent from "../components/SideDrawerComponent/SideDrawerComponent";
import { SidebarHandler } from "../components/sidebar/SidebarHandler";
// import { Badge, Dropdown, useTheme } from "flowbite-react";
// import Addasset from '../components/Addasset';
// import { FaFilter } from "react-icons/fa";
// import { Drawer, Table } from 'antd';
// import type { TableColumnsType, TableProps } from 'antd';
// import React, { useState, useEffect } from 'react';
// import { Assignment } from "../components/Assign/Assignment";
// import AddAssetSideDrawer from "../components/SideDrawerComponent/AddAssetSideDrawer";

// const queryClient = new QueryClient();


const DashboardPage: FC = function () {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <NavbarSidebarLayout>
        <div>
          <SidebarHandler />
            <Statistics />        
                {/* <Addasset/> */}
                  {/* {/* <AddAsset/> */}
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
