import { Spin } from "antd";
import React, { useEffect, useState } from "react";
import AssetTableHandler from "../../components/AssetTable/AssetTableHandler";
import { getAssetDetails } from "../../components/DashboardAssetTable/api/getDasboardAssetDetails";

const ExpiredAssets = () => {
  const [expiredAssets, setExpiredAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const queryParamProp = "&status=IN STORE";
  const heading = "Expired Assets";

  useEffect(() => {
    // Fetch asset details
    const fetchData = async () => {
      try {
        const currentDate = new Date().toISOString().split("T")[0];
        const assetData = await getAssetDetails(`expiry_date=${currentDate}`);
        setExpiredAssets(assetData.results);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching asset details:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ background: "white" }}>
      <div className="bg-white font-display">
        <nav className="flex mb-4 mx-4 my-0 py-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 rtl:space-x-reverse">
            <li className="inline-flex items-center font-display">
              <a
                href="#"
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
              >
                <svg
                  className="w-3 h-3 me-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                </svg>
                Dashboard
              </a>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="w-3 h-3 text-gray-400 mx-1 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <a
                  href="#"
                  className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white font-display"
                >
                  Expired Assets
                </a>
              </div>
            </li>
          </ol>
        </nav>
        {loading ? (
          <Spin size="large" />
        ) : (
          <AssetTableHandler
            isRejectedPage={false}
            queryParamProp={queryParamProp}
            heading={heading}
            isMyApprovalPage={true}
            assets={expiredAssets} // Pass the expired assets to the handler
          />
        )}
      </div>
      <nav className="flex mb-4 mx-4 my-0 py-4" aria-label="Breadcrumb">
        {/* Breadcrumb navigation */}
      </nav>
    </div>
  );
};

export default ExpiredAssets;

// import { Spin } from 'antd';
// import React, { useEffect, useState } from 'react';
// import AssetTableHandler from '../../components/AssetTable/AssetTableHandler';
// import { getAssetDetails } from '../../components/DashboardAssetTable/api/getDasboardAssetDetails';

// const ExpiredAssets = () => {
//   const [expiredAssets, setExpiredAssets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   let queryParamProp =
//   "&status=IN STORE"
//   let heading = "Expired Assets";
//   useEffect(() => {
//     // Fetch asset details
//     const fetchData = async () => {
//       try {
//         const assetData = await getAssetDetails();
//         // Filter expired assets
//         const expiredAssets = assetData.results.filter(asset => {
//           const expiryDate = new Date(asset.expiry_date);
//           const currentDate = new Date();
//           return expiryDate < currentDate;
//         });
//         setExpiredAssets(expiredAssets);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching asset details:', error);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   return (

//     <div style={{ background: "white" }}>
//       <div className="bg-white font-display">
//       <nav className="flex mb-4 mx-4 my-0 py-4" aria-label="Breadcrumb">
//         <ol className="inline-flex items-center space-x-1 md:space-x-3 rtl:space-x-reverse">
//           <li className="inline-flex items-center font-display">
//             <a
//               href="#"
//               className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
//             >
//               <svg
//                 className="w-3 h-3 me-2.5"
//                 aria-hidden="true"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
//               </svg>
//               Dashboard
//             </a>
//           </li>
//           <li>
//             <div className="flex items-center">
//               <svg
//                 className="w-3 h-3 text-gray-400 mx-1 rtl:rotate-180"
//                 aria-hidden="true"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 6 10"
//               >
//                 <path
//                   stroke="currentColor"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="m1 9 4-4-4-4"
//                 />
//               </svg>
//               <a
//                 href="#"
//                 className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white font-display"
//               >
//                 Expired Assets
//               </a>
//             </div>
//           </li>
//         </ol>
//       </nav>
//       <AssetTableHandler
//         isRejectedPage={false}
//         queryParamProp={queryParamProp}
//         heading={heading}
//         isMyApprovalPage={true}
//       />
//     </div>
//       <nav className="flex mb-4 mx-4 my-0 py-4" aria-label="Breadcrumb">
//         {/* Breadcrumb navigation */}
//       </nav>

//     </div>
//   );
// }

// export default ExpiredAssets;