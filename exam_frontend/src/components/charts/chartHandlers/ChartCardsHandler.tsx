import { useState, useEffect } from "react";
import { fetchAssetData } from "../api/ChartApi";
import "./styles.css";
import { Skeleton } from "@mui/material";
import { motion } from "framer-motion";

const AssetCountComponent = ({ triggerRefresh }) => {
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalAssetTypes, setTotalAssetTypes] = useState(0);
  const [assetTypes, setAssetTypes] = useState<string[]>([]);
  const [currentAssetIndex, setCurrentAssetIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeAssets, setActiveAssets] = useState(0);
  const [stockAssets, setStockAssets] = useState(0);
  const [assignCount, setAssignCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const assetCountData = await fetchAssetData();
      setTotalAssets(assetCountData.total_assets || 0);
      const types = Object.keys(assetCountData.asset_type_counts || {});
      setTotalAssetTypes(types.length);
      const assignedAssets = assetCountData.assign_status["ASSIGNED"] || 0;
      const inStoreCount = assetCountData.status_counts["STOCK"] || 0;
      const inUseCount = assetCountData.status_counts["USE"] || 0;
      const sumActiveAssets = inStoreCount + inUseCount;
      setActiveAssets(sumActiveAssets);
      setStockAssets(inStoreCount);
      setAssignCount(assignedAssets);
      setAssetTypes(types);
      setLoading(false);
    } catch (error) {
      setError("Error fetching asset count data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentAssetIndex((prevIndex) => (prevIndex + 1) % totalAssetTypes);
    }, 2000);

    return () => clearInterval(intervalId);
  }, [totalAssetTypes]);

  const handleRefreshOnClick = () => {
    setLoading(true);
    setTimeout(() => {
      fetchData();
    }, 2000);
  };

  useEffect(() => {
    handleRefreshOnClick();
  }, [triggerRefresh]);

  // if (error) {
  //   return <div>Error fetching data...</div>;
  // }

  return (
    <div>
      <div className="grid grid-cols-2 gap-8 w-fit px-auto">
        {[
          {
            label: "Asset count",
            value: totalAssets,
            gradient: "from-purple-800 to-purple-800",
          },
          {
            label: "Inventory",
            value: assetTypes[currentAssetIndex],
            gradient: "from-teal-600 to-teal-800",
          },
          {
            label: "Asset types",
            value: totalAssetTypes,
            gradient: "from-cyan-700 to-cyan-700",
          },
          {
            label: "Active Assets",
            value: activeAssets,
            gradient: "from-indigo-700 to-indigo-700",
          },
          {
            label: "Stock Assets",
            value: stockAssets,
            gradient: "from-blue-700 to-blue-700",
          },
          {
            label: "Assigned Assets",
            value: assignCount,
            gradient: "from-green-500 to-green-500",
          },
        ].map((item, index) =>
          loading || error ? (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15, delay: index * 0.15 }}
            >
              <Skeleton
                animation="wave"
                variant="circular"
                width={120}
                height={120}
              />
            </motion.div>
          ) : (
            <div
              key={index}
              className={`relative font-bold text-white rounded-full bg-gradient-to-r ${item.gradient} hover:from-purple-600 hover:to-purple-700 flex items-center justify-center`}
              style={{
                height: "8rem",
                width: "8rem",
                boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)",
                animation: "glow-purple 1.5s ease-in-out infinite",
              }}
            >
              <div
                className="absolute inset-0 rounded-full bg-custom-400"
                style={{ clipPath: "circle(45%)" }}
              ></div>
              <div className="relative flex flex-col items-center justify-center z-10">
                <div className="text-white text-xs font-display font-light text-center">
                  {item.label}
                </div>
                <div
                  className={`text-white ${
                    item.label === "Inventory" &&
                    item.value?.toString().length > 9
                      ? "text-sm"
                      : "text-lg"
                  } font-display font-semibold text-center m-2`}
                >
                  {item.value}
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AssetCountComponent;
