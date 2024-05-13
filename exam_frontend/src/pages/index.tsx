/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC } from "react";
import { Statistics } from "../components/charts/Statistics";
import DashboardAssetHandler from "../components/DashboardAssetTable/DashboardAssetHandler";

const DashboardPage: FC = function () {
  return (
    <div className="bg-white">
      <Statistics />
      <DashboardAssetHandler />
    </div>
  );
};

export default DashboardPage;
