/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, FC } from "react";
import { Statistics } from "../components/charts/Statistics";
import DasboardAssetHandler from '../components/DashboardAssetTable/DasboardAssetHandler'

const DashboardPage: FC = function () {
  
  return (
    <div className="bg-white">
      <Statistics />
      <DasboardAssetHandler />
      
    </div>
  );
};

export default DashboardPage;
