/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useState } from "react";
import { Statistics } from "../components/charts/Statistics";
import DashboardAssetHandler from "../components/DashboardAssetTable/DashboardAssetHandler";

const DashboardPage: FC = function () {
  const [selectedType, setSelectedType] = useState<string>("");

  const handleTypeSelection = (selectedType: string) => {
    setSelectedType(selectedType);
  };


  return (
    <div className="bg-white">
      <Statistics onSelectAssetType={handleTypeSelection} />
      <DashboardAssetHandler selectedType={selectedType} />
    </div>
  );
};

export default DashboardPage;
