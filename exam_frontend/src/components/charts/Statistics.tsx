import React from 'react';
import PieChartGraph from "./PieChartGraph";
import { PieChartGraphProps } from './types/ChartTypes';

export const Statistics: React.FC = () => {
  // Define your props here
  const props: PieChartGraphProps = {
    selectedAssetType: 'yourSelectedAssetType',
    type: 'yourType',
    // Add other required props here
  };

  return (
    <div>
      {/* Your navigation component */}
      <nav className="flex mx-2 my-2" aria-label="Breadcrumb">
        {/* Your navigation items */}
        <ol className="inline-flex items-center space-x-1 md:space-x-3 rtl:space-x-reverse">
          <li className="inline-flex items-center">
            <a href="#" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
              <svg className="w-4 h-4 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
              </svg>
              <span className="text-md font-display">
                Dashboard
              </span>
            </a>
          </li>
        </ol>
      </nav>
      
      {/* Your content */}
      <div className="rounded-lg bg-white shadow-sm dark:bg-gray-800 xl:p-5 mx-2 my-2">
        <div className="mb-3 flex items-center justify-between">
          {/* Your content heading */}
          <div className="shrink-0 my-3 mx-1">
            <span className="text-md font-bold font-display mx-3 leading-none text-gray-900 dark:text-white text-xl">
              Asset Status Overview
            </span>
          </div>
        </div>
        
        {/* Render the PieChartGraph component with props */}
        <div className="mx-3">
          <PieChartGraph {...props} />
        </div>        
      </div>
    </div>
  );
};
