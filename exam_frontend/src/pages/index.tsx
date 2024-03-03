/* eslint-disable jsx-a11y/anchor-is-valid */
import { Badge, Dropdown, useTheme } from "flowbite-react";
import type { FC } from "react";
import Chart from "react-apexcharts";
import NavbarSidebarLayout from "../layouts/navbar-sidebar";
// import { FaFilter } from "react-icons/fa";
import { Drawer, Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import React, { useState, useEffect } from 'react';
import AssetTable from '../components/AssetTable';

const DashboardPage: FC = function () {




return (
  <>
    <AssetTable />
    </>
);
};

export default DashboardPage;
