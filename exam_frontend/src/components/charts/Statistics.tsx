import { PieChartAssetDetailGraph } from './PieChartAssetDetailGraph';
import { PieChartAssignDetailGraph } from './PieChartAssignDetailGraph';
import { PieChartStatusGraph} from './PieChartStatusGraph';

export const Statistics = () => {
  return (
    <div>
      <div className="rounded-lg bg-white shadow-sm dark:bg-gray-800 xl:p-5 mx-10 my-10">
        <div className="mb-3 flex items-center justify-between">
          <div className="shrink-0">
            <span className="text-x1 font-semibold leading-none text-gray-900 dark:text-white sm:text-3xl">
              Asset Status Overview
            </span>
          </div>
        </div>
        <div className="flex mx-10 gap-20">
          <PieChartStatusGraph selectedAssetType="asset_status" type="asset"/>
          <PieChartAssetDetailGraph selectedAssetType="asset_detail_status" type="asset_status" />
          <PieChartAssignDetailGraph selectedAssetType="assign_status" type="assign"/>
        </div>        
      </div>
    </div>
  )
}
  
