import { useEffect, useRef, useState } from "react";
import AssetCountComponent from "./chartHandlers/ChartCardsHandler";
import ChartHandlers from "./chartHandlers/PieChartHandlers/ChartHandlers";
import { fetchAssetData } from "./api/ChartApi";
import BarChartHandler from "./chartHandlers/BarChartHandler";
import { RefreshTwoTone } from "@mui/icons-material";

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
  onClick,
}: StatisticsProps) => {
  const [assetCountData, setAssetCountData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [triggerRefresh, setTriggerRefresh] = useState<number>(0);

  useEffect(() => {
    fetchAssetData()
      .then((assetCountData) => {
        setAssetCountData(assetCountData);
        setLoading(false);
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching asset count data:", error);
        setError("Error fetching asset count data");
        setLoading(false);
      });
  }, []);

  const handleRefreshOnClick = () => {
    setTriggerRefresh(triggerRefresh + 1);
  };

  const childRef = useRef(null);

  const handleAssetTypeSelect = (id) => {
    if (childRef.current) {
      childRef.current.handleSelectChange({
        target: { value: id.toString() },
      } as React.ChangeEvent<HTMLSelectElement>);
    }
  };

  return (
    <div className="rounded-xl bg-white dark:bg-custom-400 pt-10 sm:mx-6 ">
      {error ? (
        <div>Error: {error}</div>
      ) : (
        <>
          <div className="">
            <span className="font-bold font-display dark:text-white m-10 text-grey-900 text-xl">
              Asset Overview
              <span className="items-center justify-end mx-2">
                <RefreshTwoTone
                  onClick={handleRefreshOnClick}
                  className="dark:text-white"
                  style={{
                    cursor: "pointer",
                    marginLeft: "10px",
                    width: "25px",
                    height: "20px",
                  }}
                />
              </span>
            </span>
          </div>
          <div className="border-t-4 dark:border-gray-600 rounded-xl m-8"></div>
          <div className="xl:p-2 mx-6 py-2">
            <div className="flex mx-auto">
              <div className="">
                <AssetCountComponent triggerRefresh={triggerRefresh} />
              </div>
              <div className="border-l-4 border-gray-600 h-full rounded-xl m-8"></div>
              <div className="flex flex-col flex-1 w-1/2">
                <div className="bg-transparent rounded-lg shadow-md ">
                  <BarChartHandler
                    triggerRefresh={triggerRefresh}
                    handleBarItemClick={handleAssetTypeSelect}
                  />
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
                    onClick={onClick}
                    triggerRefresh={triggerRefresh}
                    ref={childRef}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
