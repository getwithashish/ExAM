import { useState, useEffect } from "react";
import { fetchAssetData } from "../api/ChartApi";
import BarChartHandler from "./BarChartHandler";
import './styles.css'

const AssetCountComponent = () => {
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalAssetTypes, setTotalAssetTypes] = useState(0);
  const [assetTypes, setAssetTypes] = useState<string[]>([]);
  const [currentAssetIndex, setCurrentAssetIndex] = useState(0);
  const [pendingAssetsCount, setPendingAssetsCount] = useState(0);
  const [pendingAssignsCount, setPendingAssignsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeAssets, setActiveAssets] = useState(0)
  const [stockAssets, setStockAssets] = useState(0)
  const [assignCount, setAssignCount] = useState(0)
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const assetCountData = await fetchAssetData();
        setTotalAssets(assetCountData.total_assets || 0);
        const types = Object.keys(assetCountData.asset_type_counts || {});
        setTotalAssetTypes(types.length);
        const assignedAssets = assetCountData.assign_status["ASSIGNED"] || 0;
        const inStoreCount = assetCountData.status_counts["IN STORE"] || 0;
        const inUseCount = assetCountData.status_counts["IN USE"] || 0;
        const sumActiveAssets = inStoreCount + inUseCount;
        setActiveAssets(sumActiveAssets)
        setStockAssets(inStoreCount)
        setAssignCount(assignedAssets)
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
    <>
      <div className="flex flex-wrap lg:gap-10 lg:px-16 lg:my-10 md:gap-20 lg:px-8 lg:my-5 sm:gap-20 sm:px-4 sm:my-2 ">
        <div className="relative font-bold text-white rounded-full bg-gradient-to-r from-purple-800 to-purple-800 hover:from-purple-600 hover:to-purple-700 flex items-center justify-center" style={{ height: '13rem', width: '13rem', boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)", animation: "glow-purple 1.5s ease-in-out infinite" }}>
          <div className="absolute inset-0 rounded-full bg-custom-400" style={{ clipPath: "circle(45%)" }}></div>
          <div className="relative flex flex-col items-center justify-center z-10">
            <div className="text-white text-sm sm:text-sm md:text-sm lg:text-sm xl:text-base font-display font-light text-left">
              Asset count
            </div>
            <div className="text-white text-lg sm:text-lg md:text-xl lg:text-xl xl:text-2xl font-display font-semibold text-right m-4">
              {totalAssets}
            </div>
          </div>
        </div>
        <div className="relative font-bold text-white rounded-full bg-gradient-to-r from-teal-600 to-teal-800 hover:from-teal-800 hover:to-teal-800 flex items-center justify-center" style={{ height: '13rem', width: '13rem', boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)", animation: "glow-teal 1.5s ease-in-out infinite" }}>
          <div className="absolute inset-0 rounded-full bg-custom-400" style={{ clipPath: "circle(45%)" }}>  </div>
          <div className="relative flex flex-col items-center justify-center z-10">
            <div className="text-white text-sm sm:text-sm md:text-sm lg:text-sm xl:text-base font-display font-light text-left">
              Inventory
            </div>
            <div className="text-white text-lg sm:text-lg md:text-xl lg:text-xl xl:text-2xl font-display font-semibold text-right m-4">
              {assetTypes[currentAssetIndex]}
            </div>
          </div>
        </div>
        <div className="relative font-bold text-white rounded-full bg-gradient-to-r from-cyan-700 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 flex items-center justify-center" style={{ height: '13rem', width: '13rem', boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)", animation: "glow-cyan 1.5s ease-in-out infinite" }}>
          <div className="absolute inset-0 rounded-full bg-custom-400" style={{ clipPath: "circle(45%)" }}>  </div>
          <div className="relative flex flex-col items-center justify-center z-10">
            <div className="text-white text-sm sm:text-sm md:text-sm lg:text-sm xl:text-base font-display font-light text-left">
              Asset types
            </div>
            <div className="text-white text-lg sm:text-lg md:text-xl lg:text-xl xl:text-2xl font-display font-bold text-right m-4">
              {totalAssetTypes}
            </div>
          </div>
        </div>
        <div className="relative font-bold text-white rounded-full bg-gradient-to-r from-indigo-700 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 flex items-center justify-center" style={{ height: '13rem', width: '13rem', boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)", animation: "glow-indigo 1.5s ease-in-out infinite" }}>
          <div className="absolute inset-0 rounded-full bg-custom-400" style={{ clipPath: "circle(45%)" }}>  </div>
          <div className="relative flex flex-col items-center justify-center z-10">
            <div className="text-white text-sm sm:text-sm md:text-sm lg:text-sm xl:text-base font-display font-light text-left">
              Active Assets
            </div>
            <div className="text-white text-lg sm:text-lg md:text-xl lg:text-xl xl:text-2xl font-display font-bold text-right m-4">
              {activeAssets}
            </div>
          </div>
        </div>
        <div className="relative font-bold text-white rounded-full bg-gradient-to-r from-blue-700 to-blue-700 hover:from-blue-500 hover:to-blue-600 flex items-center justify-center" style={{ height: '13rem', width: '13rem', boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)", animation: "glow-blue 1.5s ease-in-out infinite" }}>
          <div className="absolute inset-0 rounded-full bg-custom-400" style={{ clipPath: "circle(45%)" }}>  </div>
          <div className="relative flex flex-col items-center justify-center z-10">
            <div className="text-white text-sm sm:text-sm md:text-sm lg:text-sm xl:text-base font-display font-light text-left">
              Stock Assets
            </div>
            <div className="text-white text-lg sm:text-lg md:text-xl lg:text-xl xl:text-2xl font-display font-bold text-right m-4">
              {stockAssets}
            </div>
          </div>
        </div>
        <div className="relative font-bold text-white rounded-full bg-gradient-to-r from-green-500 to-green-500 hover:from-green-400 hover:to-green-400 flex items-center justify-center" style={{ height: '13rem', width: '13rem', boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)", animation: "glow-green 1.5s ease-in-out infinite" }}>
          <div className="absolute inset-0 rounded-full bg-custom-400" style={{ clipPath: "circle(45%)" }}>  </div>
          <div className="relative flex flex-col items-center justify-center z-10">
            <div className="text-white text-sm sm:text-sm md:text-sm lg:text-sm xl:text-base font-display font-light text-left">
              Assigned Assets
            </div>
            <div className="text-white text-lg sm:text-lg md:text-xl lg:text-xl xl:text-2xl font-display font-bold text-right m-4">
              {assignCount}
            </div>
          </div>
        </div>
      </div >
      <div className="w-full mt-14">
        <div className="bg-custom-500 rounded-lg shadow-md m-2" style={{ boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)" }}>
          <BarChartHandler />
        </div>
      </div>
    </>

  );
};

export default AssetCountComponent;
