/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useState, useRef } from "react";
import { Statistics } from "../components/charts/Statistics";
import DashboardAssetHandler from "../components/DashboardAssetTable/DashboardAssetHandler";

const DashboardPage: FC = function () {
  const [selectedTypeId, setSelectedTypeId] = useState<number>(0);
  const [assetState, setAssetState] = useState<string | null>(null);
  const [detailState, setDetailState] = useState<string | null>(null);
  const [assignState, setAssignState] = useState<string | null>(null);
  const dashboardAssetRef = useRef<HTMLDivElement>(null);
  
  const handleScroll = (percentage: number) => {
    const windowHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;
    const targetScrollPosition = (scrollHeight - windowHeight) * (percentage / 100);

    window.scrollTo({
      top: targetScrollPosition,
      behavior: "smooth",
    });
  };
  return (
    <div className="bg-custom-500 lg:ml-60 mt-20">
     <Statistics
        selectedTypeId={selectedTypeId}
        assetState ={assetState}
        detailState={detailState}
        assignState={assignState}
        setSelectedTypeId={setSelectedTypeId}
        setAssetState={setAssetState}
        setDetailState={setDetailState}
        setAssignState={setAssignState}
        onClick={() => handleScroll(95)}
      />
      <div ref={dashboardAssetRef}>
        <DashboardAssetHandler
          selectedTypeId={selectedTypeId}
          assetState={assetState}
          detailState={detailState}
          assignState={assignState}
          setSelectedTypeId= {setSelectedTypeId}
          setAssetState={setAssetState}
          setDetailState={setDetailState}
          setAssignState={setAssignState}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
