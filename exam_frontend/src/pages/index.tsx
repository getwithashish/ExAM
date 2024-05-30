/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useState, useRef } from "react";
import { Statistics } from "../components/charts/Statistics";
import DashboardAssetHandler from "../components/DashboardAssetTable/DashboardAssetHandler";

const DashboardPage: FC = function () {
  const [selectedTypeId, setSelectedTypeId] = useState<number>(0);
  const [_assetState, setAssetState] = useState<string | null>(null);
  const [_detailState, setDetailState] = useState<string | null>(null);
  const [_assignState, setAssignState] = useState<string | null>(null);
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
    <div className="bg-white pt-20">
     <Statistics
        setSelectedTypeId={setSelectedTypeId}
        setAssetState={setAssetState}
        setDetailState={setDetailState}
        setAssignState={setAssignState}
        onClick={() => handleScroll(95)}
      />
      <div ref={dashboardAssetRef}>
        <DashboardAssetHandler
          selectedTypeId={selectedTypeId}
          assetState={_assetState}
          detailState={_detailState}
          assignState={_assignState}
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
