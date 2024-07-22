import { useEffect, useState } from "react";
import AssetCountComponent from "./chartHandlers/ChartCardsHandler";
import ChartHandlers from "./chartHandlers/PieChartHandlers/ChartHandlers";
import { fetchAssetData } from "./api/ChartApi";
import BarChartHandler from "./chartHandlers/BarChartHandler";

interface StatisticsProps {
  selectedTypeId?: number;
  assetState?: string | null;
  detailState?: string | null;
  assignState: string | null;
  setSelectedTypeId: (id: number) => void;
  setAssetState: React.Dispatch<React.SetStateAction<string | null>>;
  setDetailState: React.Dispatch<React.SetStateAction<string | null>>;
  setAssignState: React.Dispatch<React.SetStateAction<string | null>>;
  onClick: () => void;
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
    <div className="rounded-xl bg-custom-400 pt-10 sm:mx-6 ">
      <div className="">
        <span className="font-bold font-display text-white m-10 text-grey-900 text-xl">
          Asset Overview
        </span>
      </div>
      <div className="border-t-4 border-gray-600 rounded-xl m-8"></div>
      <div className="xl:p-2 mx-6 py-2">
        <div className="mx-auto">
          <AssetCountComponent />
          <div className="border-t-4 border-gray-600 rounded-xl m-2 mt-24"></div>          
          <div className="w-full my-14">
            <div className="bg-custom-500 rounded-lg shadow-md m-2" style={{ boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)" }}>
              <BarChartHandler />
            </div>
          </div>
          <div className="border-t-4 border-gray-600 rounded-xl m-2 mb-16"></div>
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
              onClick={onClick}
            />
          </div>
          <div className="border-t-4 border-gray-600 rounded-xl my-16"></div>
        </div>
      </div>
    </div>
  );
};
