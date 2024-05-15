import { useState, useEffect } from "react";
import { fetchAssetData } from "../api/ChartApi";
import BarChartHandler from "./BarChartHandler";

const AssetCountComponent = () => {
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalAssetTypes, setTotalAssetTypes] = useState(0);
  const [assetTypes, setAssetTypes] = useState<string[]>([]);
  const [currentAssetIndex, setCurrentAssetIndex] = useState(0);
  const [pendingAssetsCount, setPendingAssetsCount] = useState(0);
  const [pendingAssignsCount, setPendingAssignsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const assetCountData = await fetchAssetData();
        setTotalAssets(assetCountData.total_assets || 0);
        const types = Object.keys(assetCountData.asset_type_counts || {});
        setTotalAssetTypes(types.length);
        setAssetTypes(types);

        let pendingAssetsCount = 0;
        const detailStatus = assetCountData.asset_detail_status;
        if (detailStatus) {
          pendingAssetsCount +=
            (detailStatus["CREATE_PENDING"] || 0) +
            (detailStatus["UPDATE_PENDING"] || 0);
        }
        setPendingAssetsCount(pendingAssetsCount);

        let pendingAssignsCount = 0;
        const assignStatus = assetCountData.assign_status;
        console.log("assignStatus: ", assignStatus);
        if (assignStatus) {
          pendingAssignsCount = assignStatus["ASSIGN_PENDING"] || 0;
        }
        setPendingAssignsCount(pendingAssignsCount);

        setLoading(false);
      } catch (error) {
        setError("Error fetching asset count data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentAssetIndex((prevIndex) => (prevIndex + 1) % totalAssetTypes);
    }, 2000);

    return () => clearInterval(intervalId);
  }, [totalAssetTypes]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <div className="w-auto">
        <div
          className="my-2 bg-gradient-to-r from-purple-800 to-purple-800 hover:from-purple-900 hover:to-purple-900 rounded-lg p-3 shadow-md xs:mt-0 min-h-24"
          style={{ boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)" }}
        >
          <div className="text-white text-xs sm:text-sm md:text-md lg:text-lg xl:text-xl font-display font-light text-left">
            Asset count
          </div>
          <div className="text-white text-xl sm:text-sm md:text-md lg:text-lg xl:text-xl font-display font-medium text-right">
            {totalAssets}
          </div>
        </div>
        <div
          className="my-2 bg-gradient-to-r from-teal-700 to-teal-700 hover:from-teal-800 hover:to-teal-800 rounded-lg p-3 shadow-md xs:mt-0 min-h-24"
          style={{ boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)" }}
        >
          <div className="text-white text-xs sm:text-sm md:text-md lg:text-lg xl:text-xl font-display font-light text-left">
            Inventory
          </div>
          <div className="text-white text-xl sm:text-sm md:text-md lg:text-lg xl:text-xl font-display font-medium text-right">
            {assetTypes[currentAssetIndex]}
          </div>
        </div>
        <div
          className="my-2 bg-gradient-to-r from-cyan-700 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 rounded-lg p-3 shadow-md xs:mt-0 min-h-24"
          style={{ boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)" }}
        >
          <div className="text-white text-xs sm:text-sm md:text-md lg:text-lg xl:text-xl font-display font-light text-left">
            Asset types
          </div>
          <div className="text-white text-xl sm:text-sm md:text-md lg:text-lg xl:text-xl font-display font-medium text-right">
            {totalAssetTypes}
          </div>
        </div>
      </div>
      {/* <div
        className=" my-2 py-4 items-center justify-center bg-gradient-to-r from-blue-800 to-blue-800 hover:from-blue-900 hover:to-blue-900 rounded-lg lg:p-6 md:p-4 sm:p-2 shadow-md"
        style={{ boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)" }}
      >
        <div className="text-white text-xs sm:text-sm md:text-md lg:text-lg xl:text-xl font-display font-light text-center">
          Remaining approvals
        </div>
        <div
          className=" font-semibold text-center flex-row gap-4"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div className="text-white text-xs sm:text-sm md:text-md lg:text-lg xl:text-xl font-display font-medium">
            Pending: <br />
            <div className="text-white text-xl sm:text-sm md:text-md lg:text-lg xl:text-xl font-display font-semibold">
              {pendingAssetsCount + pendingAssignsCount}
            </div>
          </div>
          <div className="text-white text-xs sm:text-sm md:text-md lg:text-lg xl:text-xl font-display font-medium">
            Asset approvals: <br />
            <div className="text-white text-xl sm:text-sm md:text-md lg:text-lg xl:text-xl font-display font-semibold">
              {pendingAssetsCount}
            </div>
          </div>
          <div className="text-white text-xs sm:text-sm md:text-md lg:text-lg xl:text-xl font-display font-medium">
            Assign approvals: <br />
            <div className="text-white text-xl sm:text-sm md:text-md lg:text-lg xl:text-xl font-display font-semibold">
              {pendingAssignsCount}
            </div>
          </div>
        </div>
      </div> */}
      <div
        className="col-span-3 rounded-lg shadow-md m-2"
        style={{ boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)" }}
      >
        <BarChartHandler />
      </div>
    </div>
  );
};

export default AssetCountComponent;
