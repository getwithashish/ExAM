import Carousel from './carousel';
import PieChartGraph from './PieChartGraph';

export const Statistics = () => {
  const items = [
    <div>
      <div className="rounded-lg bg-white p-8 shadow dark:bg-gray-800 m:p-10 xl:p-12 h-full mx-10 my-10 ">
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
        <PieChartGraph type="hardware" />
      </div>
    </div>,
    <div>
      <div className="rounded-lg bg-white p-2 shadow dark:bg-gray-800 m:p-10 xl:p-12 h-full mx-10 my-10">
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
        <PieChartGraph type="software" />
      </div>
    </div>
  ];

  return (
    <Carousel items={items} />
  );
};
