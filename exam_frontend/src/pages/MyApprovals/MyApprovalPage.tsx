import React from 'react'
import AssetTableHandler from '../../components/AssetTable/AssetTableHandler';


const MyApprovalPage = () => {
    
    const decodeJWT = (token: string) => {
        try {
          const base64Url = token.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
              })
              .join("")
          );
          return JSON.parse(jsonPayload);
        } catch (error) {
          console.error("Error decoding JWT:", error);
          return null;
        }
      };
    
      const getUserId = () => {
        const jwtToken = localStorage.getItem("jwt");
        console.log(jwtToken);
        if (jwtToken) {
          const payload = decodeJWT(jwtToken);
          return payload.user_id
        }
      };
    
      let queryParamProp =
        `&asset_detail_status=CREATED|UPDATED&assign_status=ASSIGNED|UNASSIGNED&approved_by_id=${getUserId()}`;
      let heading = "My approved Request";
    
      return (
      

        <div className='bg-white'>
            <nav className="flex mb-4 mx-4 py-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 rtl:space-x-reverse">
            <li className="inline-flex items-center font-display">
              <a href="#" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                </svg>
                  Dashboard
                </a>
              </li>
              <li>
            <div className="flex items-center">
              <svg className="w-3 h-3 text-gray-400 mx-1 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
              </svg>
                <a href="#" className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white font-display">My Approval History</a>
              </div>
            </li>
          </ol>
        </nav>
          <AssetTableHandler
            isRejectedPage={false}
            queryParamProp={queryParamProp}
            heading={heading}
          />
        </div>
        
      );
    };
    

export default MyApprovalPage
