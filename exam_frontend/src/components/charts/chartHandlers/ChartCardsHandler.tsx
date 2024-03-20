import { useState, useEffect } from 'react';
import { fetchAssetData } from '../api/ChartApi';

const AssetCountComponent = () => {
    const [totalAssets, setTotalAssets] = useState(0);
    const [totalAssetTypes, setTotalAssetTypes] = useState(0);
    const [assetTypes, setAssetTypes] = useState<string[]>([]);
    const [currentAssetIndex, setCurrentAssetIndex] = useState(0);
    const [pendingAssetsCount, setPendingAssetsCount] = useState(0);
    const [pendingAssignsCount, setPendingAssignsCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const assetCountData = await fetchAssetData();
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

                setLoading(false);
            } catch (error) {
                setError("Error fetching asset count data");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentAssetIndex(prevIndex => (prevIndex + 1) % totalAssetTypes);
        }, 2000); 

        return () => clearInterval(intervalId);
    }, [totalAssetTypes]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return ( 
        <div className="grid grid-cols-2 gap-8 py-10 px-4">
            <div className="bg-gradient-to-r from-purple-600 to-purple-600 hover:from-purple-700 hover:to-purple-700 rounded-3xl p-4 shadow-md" style={{boxShadow:'0 0 5px rgba(0, 0, 0, 0.5)'}}>
                <div className="text-white text-2xl font-bold mb-6 text-center">Asset count:</div>
                <div className="text-white text-4xl font-bold m-8 text-center">{totalAssets}</div>
            </div>
            <div className="bg-gradient-to-r from-green-400 to-green-400 hover:from-green-500 hover:to-green-500 rounded-3xl p-4 shadow-md" style={{boxShadow:'0 0 5px rgba(0, 0, 0, 0.5)'}}>
                <div className="text-white text-2xl font-bold mb-10 text-center">Inventory:</div>
                <div className="text-white text-2xl font-bold mt-2 text-center">{assetTypes[currentAssetIndex]}</div>
            </div>
            <div className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 rounded-3xl p-4 shadow-md" style={{boxShadow:'0 0 5px rgba(0, 0, 0, 0.5)'}}>
                <div className="text-white text-2xl font-bold mb-6 text-center">Asset Types:</div>
                <div className="text-white text-4xl font-bold mt-8 text-center">{totalAssetTypes}</div>
            </div>            
            <div className="bg-gradient-to-r from-blue-500 to-blue-500 hover:from-blue-600 hover:to-indigo-500 rounded-3xl p-4 shadow-md"style={{boxShadow:'0 0 5px rgba(0, 0, 0, 0.5)'}}>
                <div className="text-white text-2xl font-bold mb-6 text-center">Pending Approvals:</div>
                <div className="text-white text-lg font-bold mx-4 text-center">
                    Assets: {pendingAssetsCount}
                    <br />
                    Assigns: {pendingAssignsCount}
                </div>
            </div>
        </div> 
        
        
    );
};

export default AssetCountComponent;