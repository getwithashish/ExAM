import { useState, useEffect } from "react";
import { fetchAssetData } from "../api/ChartApi";
import './styles.css'
import { RefreshTwoTone } from "@mui/icons-material";

const AssetCountComponent = () => {
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalAssetTypes, setTotalAssetTypes] = useState(0);
  const [assetTypes, setAssetTypes] = useState<string[]>([]);
  const [currentAssetIndex, setCurrentAssetIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeAssets, setActiveAssets] = useState(0)
  const [stockAssets, setStockAssets] = useState(0)
  const [assignCount, setAssignCount] = useState(0)
  const [error, setError] = useState<string | null>(null);

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
      setLoading(false);
    } catch (error) {
      setError("Error fetching asset count data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentAssetIndex((prevIndex) => (prevIndex + 1) % totalAssetTypes);
    }, 2000);

    return () => clearInterval(intervalId);
  }, [totalAssetTypes]);

  const handleRefreshOnClick = () => {
    setLoading(true)
    setTimeout(()=>
      {
        fetchData()
      }, 2000);

  }

  if (loading) {

    return (
      <div className="xl:p-2 mx-6 py-2 lg:h-72">
        <div className="flex items-center justify-center h-full">
          <div className="flex items-center justify-center">
            <svg
              aria-hidden="true"
              className="w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="ml-2 text-gray-200">Please wait. Data is loading...</span>
          </div>
        </div>

      </div>

    );

  }

  if (error) {
    return <div>Error fetching data...</div>;
  }

  return (
    <div>
      <div className="flex items-end justify-end">
        <RefreshTwoTone
          onClick={() => {
            handleRefreshOnClick();
          }}
          style={{
            cursor: "pointer",
            marginLeft: "10px",
            width: "30px",
            height: "40px",
            color: '#ffffff'
          }}
        />
      </div>
      <div className="flex flex-wrap mx-auto px-auto items-center justify-center lg:gap-10 lg:px-16 lg:my-10 md:gap-20 lg:px-8 lg:my-5 sm:gap-20 sm:px-4 sm:my-2 ">
        <div className="relative font-bold text-white rounded-full bg-gradient-to-r from-purple-800 to-purple-800 hover:from-purple-600 hover:to-purple-700 flex items-center justify-center"
          style={{ height: '13rem', width: '13rem', boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)", animation: "glow-purple 1.5s ease-in-out infinite" }}>
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
      {/* <div className="w-full mt-14">
        <div className="bg-custom-500 rounded-lg shadow-md m-2" style={{ boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)" }}>
          <BarChartHandler />
        </div>
      </div> */}
    </div>

  );
};

export default AssetCountComponent;
