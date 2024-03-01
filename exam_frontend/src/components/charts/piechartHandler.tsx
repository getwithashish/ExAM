import type { FC } from "react";
import PieChart from "./piechart-hardware"
import PieChart2 from "./piechart-software"



export const Statistics: FC = function () {
    return (
      <div className="flex gap-10">
      <div className="rounded-lg bg-white p-2 shadow dark:bg-gray-800 m:p-10 xl:p-12">
          <div className="mb-3 flex items-center justify-between">
              <div className="shrink-0">
                  <span className="text-2xl font-bold leading-none text-gray-900 dark:text-white sm:text-3xl">
                      Hardware Asset Overview
                  </span>
                  <h3 className="text-base font-normal text-gray-600 dark:text-gray-400">
                      Status wise Report
                  </h3>
              </div>
          </div>
          <PieChart/>
      </div>
      <div className="rounded-lg bg-white p-2 shadow dark:bg-gray-800 m:p-10 xl:p-12">
          <div className="mb-3 flex items-center justify-between">
              <div className="shrink-0">
                  <span className="text-2xl font-bold leading-none text-gray-900 dark:text-white sm:text-3xl">
                      Software Asset Overview
                  </span>
                  <h3 className="text-base font-normal text-gray-600 dark:text-gray-400">
                      Status wise Report
                  </h3>
              </div>
          </div>
          <PieChart2/>
      </div>
  </div>       
    );
  };