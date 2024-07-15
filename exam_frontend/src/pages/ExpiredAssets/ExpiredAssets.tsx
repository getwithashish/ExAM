import { Spin } from "antd";
import React, { useEffect, useState } from "react";
import AssetTableHandler from "../../components/AssetTable/AssetTableHandler";
import { getAssetDetails } from "../../components/DashboardAssetTable/api/getDashboardAssetDetails";

const ExpiredAssets = () => {
  const [expiredAssets, setExpiredAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const queryParamProp = "&expired=true";
  const heading = "Expired Assets";

  // useEffect(() => {
  //   // Fetch asset details
  //   const fetchData = async () => {
  //     try {
  //       const currentDate = new Date().toISOString().split("T")[0];
  //       const assetData = await getAssetDetails(`expiry_date=${currentDate}`);
  //       setExpiredAssets(assetData.results);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching asset details:", error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  return (
    <div >
       <div className="pt-8">
        {loading ? (
          <Spin size="large" />
        ) : (
          <AssetTableHandler
            isRejectedPage={false}
            queryParamProp={queryParamProp}
            heading={heading}
            isMyApprovalPage={true}
            // It seems like the below assets is not used, remove if not used
            assets={expiredAssets} // Pass the expired assets to the handler
          />
        )}
      </div>
    </div>
  );
};

export default ExpiredAssets;
