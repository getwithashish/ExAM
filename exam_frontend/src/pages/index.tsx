import { FC, useState, useRef } from "react";
import { Statistics } from "../components/charts/Statistics";
import DashboardAssetHandler from "../components/DashboardAssetTable/DashboardAssetHandler";
import { motion } from "framer-motion";

const DashboardPage: FC = function () {
  const [selectedTypeId, setSelectedTypeId] = useState<number>(0);
  const [assetState, setAssetState] = useState<string | null>(null);
  const [detailState, setDetailState] = useState<string | null>(null);
  const [assignState, setAssignState] = useState<string | null>(null);
  const dashboardAssetRef = useRef<HTMLDivElement>(null);

  const handleScroll = (percentage: number) => {
    const windowHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;
    const targetScrollPosition =
      (scrollHeight - windowHeight) * (percentage / 100);
    window.scrollTo({
      top: targetScrollPosition,
      behavior: "smooth",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        style={{ padding: "0 14px 0 7px", borderRadius: "10px" }}
      >
        <Statistics
          selectedTypeId={selectedTypeId}
          assetState={assetState}
          detailState={detailState}
          assignState={assignState}
          setSelectedTypeId={setSelectedTypeId}
          setAssetState={setAssetState}
          setDetailState={setDetailState}
          setAssignState={setAssignState}
          onClick={() => handleScroll(95)}
        />
      </motion.div>

      <motion.div
        ref={dashboardAssetRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ padding: "0 14px 0 10px", borderRadius: "10px", height: "fit-content(20)" }}
      >
        <DashboardAssetHandler
          selectedTypeId={selectedTypeId}
          assetState={assetState}
          detailState={detailState}
          assignState={assignState}
          setSelectedTypeId={setSelectedTypeId}
          setAssetState={setAssetState}
          setDetailState={setDetailState}
          setAssignState={setAssignState}
        />
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;
