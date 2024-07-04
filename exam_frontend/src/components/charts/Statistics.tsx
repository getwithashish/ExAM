import { useEffect, useState } from "react";
import AssetCountComponent from "./chartHandlers/ChartCardsHandler";
import ChartHandlers from "./chartHandlers/PieChartHandlers/ChartHandlers";
import { fetchAssetData } from "./api/ChartApi";

interface StatisticsProps {
  selectedTypeId?:number;
  assetState?: string | null;  
  detailState?:string | null;
  assignState:string | null;
  setSelectedTypeId: (id: number) => void;
  setAssetState: React.Dispatch<React.SetStateAction<string | null>>;
  setDetailState: React.Dispatch<React.SetStateAction<string | null>>;
  setAssignState: React.Dispatch<React.SetStateAction<string | null>>;
  onClick: ()=>void;
}

export const Statistics = ({
  selectedTypeId,
  assetState,
  detailState,
  assignState,
  setSelectedTypeId,
  setAssetState,
  setDetailState,
  setAssignState,
  onClick
}: StatisticsProps) => {
  const [assetCountData, setAssetCountData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAssetData()
      .then((assetCountData) => {
        setAssetCountData(assetCountData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching asset count data:", error);
        setError("Error fetching asset count data");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-white">
      <div className="shrink-0 m-4">
        <span className="font-semibold font-display mx-6 text-grey-900 dark:text-white text-lg">
          Asset Overview
        </span>
      </div>
      <div
        className="rounded-lg bg-gray-50 shadow-md dark:bg-gray-800 xl:p-4 mx-10 py-2"
        style={{ boxShadow: "0 0 20px rgba(0, 0, 0, 0.2)" }}
      >
        <div className="mx-4">
          <div className="">
            <AssetCountComponent />
          </div>
          <div className="items-center justify-center">
            <ChartHandlers
              assetCountData={assetCountData}
              selectedTypeId={selectedTypeId}
              assetState={assetState}
              detailState={detailState}
              assignState={assignState}
              setSelectedTypeId={setSelectedTypeId}
              setAssetState={setAssetState}
              setDetailState={setDetailState}
              setAssignState={setAssignState}
              onClick = {onClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
