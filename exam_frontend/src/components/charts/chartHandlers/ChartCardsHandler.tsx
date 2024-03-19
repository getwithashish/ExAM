import { useState, useEffect } from 'react';
import axiosInstance from '../../../config/AxiosConfig';

const AssetCountComponent = () => {
    const [totalAssets, setTotalAssets] = useState(0);
    const [totalAssetTypes, setTotalAssetTypes] = useState(0);
    const [assetTypes, setAssetTypes] = useState<string[]>([]);
    const [currentAssetIndex, setCurrentAssetIndex] = useState(0);
    const [pendingAssetsCount, setPendingAssetsCount] = useState(0);
    const [pendingAssignsCount, setPendingAssignsCount] = useState(0);
    
    useEffect(() => {
        axiosInstance.get(`/asset/asset_count`)
            .then((res) => {
                const assetCountData = res.data.data;
                setTotalAssets(assetCountData.total_assets || 0);
                const types = Object.keys(assetCountData.asset_type_counts || {});
                setTotalAssetTypes(types.length);
                setAssetTypes(types);

                let pendingAssetsCount = 0;
                const detailStatus = assetCountData.asset_detail_status;
                if (detailStatus) {
                    pendingAssetsCount += (detailStatus["CREATE_PENDING"] || 0) + (detailStatus["UPDATE_PENDING"] || 0);
                }
                setPendingAssetsCount(pendingAssetsCount);

                let pendingAssignsCount = 0;
                const assignStatus = assetCountData.assign_status;
                if (assignStatus) {
                    pendingAssignsCount = assignStatus["ASSIGN_PENDING"] || 0;
                }
                setPendingAssignsCount(pendingAssignsCount);

            })
            .catch(error => {
                console.error("Error fetching asset count data:", error);
            });
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentAssetIndex(prevIndex => (prevIndex + 1) % totalAssetTypes);
        }, 2000); 
        return () => {
            clearInterval(intervalId); 
        };
    }, [totalAssetTypes]);
    
        return (
            <div className='flex flex-wrap'>
                <div className='flex-1'>
                    <div className='flex-1 bg-gradient-to-r from-purple-500 to-purple-500 hover:from-purple-600 hover:to-purple-700 ... rounded-lg scale-90 bg-white hover:scale-100 py-2' style={{boxShadow:'0 0 20px rgba(0, 0, 0, 0.2)'}}>
                        <div className="font-bold text-white font-display mx-8 mt-6 text-grey-900 dark:text-white text-xl ">                
                            Total Assets
                            <div className="font-bold font-display mx-8 mt-6 pb-8 text-7xl">
                                {totalAssets}
                            </div>
                        </div>
                    </div>
                    <div className='flex-1 bg-gradient-to-r from-blue-500 to-blue-500 hover:from-blue-600 hover:to-indigo-500 ... rounded-lg scale-90 bg-white hover:scale-100 py-2' style={{boxShadow:'0 0 20px rgba(0, 0, 0, 0.2)'}}>
                        <div className="font-bold text-white font-display mx-8 mt-6 text-grey-900 dark:text-white text-xl ">                
                            Asset Types:
                            <div className="font-bold font-display mx-8 mt-6 pb-8 text-7xl">
                                {totalAssetTypes}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex-1'>
                <div className='flex-1 bg-gradient-to-r from-green-500 to-green-500 hover:from-green-600 hover:to-green-700 ... rounded-lg scale-90 bg-white hover:scale-100 py-2' style={{boxShadow:'0 0 20px rgba(0, 0, 0, 0.2)'}}>
                        <div className="font-bold text-white font-display mx-8 mt-6 text-grey-900 dark:text-white text-xl ">                
                            Available asset types:
                            <div className="font-bold font-display my-11 mx-4 text-4xl">
                                {assetTypes[currentAssetIndex]}
                            </div>
                        </div>
                    </div>
                    <div className='flex-1 bg-gradient-to-r from-orange-500 to-orange-500 hover:from-orange-600 hover:to-orange-600 ... rounded-lg scale-90 bg-white hover:scale-100 py-2' style={{boxShadow:'0 0 20px rgba(0, 0, 0, 0.2)'}}>
                        <div className="font-bold text-white font-display mx-8 mt-6 text-grey-900 dark:text-white text-xl ">                
                            Pending approvals:
                            <div className="font-bold font-display mx-14 mt-3 pb-4 text-3xl">
                                Assets : {pendingAssetsCount}
                            </div>
                            <div className="font-bold font-display mx-10 mt-3 pb-4 text-3xl">
                                Assigns : {pendingAssignsCount}
                            </div>
                        </div>
                    </div>
                    </div>                
                </div>            
        );
    };

export default AssetCountComponent;
