/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useState } from "react";
import { Statistics } from "../components/charts/Statistics";
import DashboardAssetHandler from "../components/DashboardAssetTable/DashboardAssetHandler";

const DashboardPage: FC = function () {

  const [selectedTypeId, setSelectedTypeId] = useState<number>(0);
  const [_assetState, setAssetState] = useState<string | null>(null);
  const [_detailState, setDetailState] = useState<string | null>(null);
  const [_assignState, setAssignState] = useState<string | null>(null);
  


  return (
    <div className="bg-white">
   <Statistics setSelectedTypeId={setSelectedTypeId} setAssetState={setAssetState} setDetailState={setDetailState} setAssignState={setAssignState} />
      <DashboardAssetHandler selectedTypeId={selectedTypeId} assetState={_assetState} detailState={_detailState} assignState={_assignState} />
    </div>
  );
};

export default DashboardPage;
