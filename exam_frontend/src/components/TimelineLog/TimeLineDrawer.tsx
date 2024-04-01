import React, { FC, useState } from 'react';
import { Drawer } from 'antd';
import type { DrawerProps } from 'antd';
import AssetTimelineHandler from './AssetTimelineHandler'; // Import your AssetTimelineHandler component

interface TimelineDrawerProps extends DrawerProps {
    title: string;
    onClose: () => void; 
    assetUuid: string; // Add assetUuid as a prop
}

const TimelineDrawer: FC<TimelineDrawerProps> = ({ visible, title, onClose, assetUuid }) => {
    const [assetLogsVisible, setAssetLogsVisible] = useState<boolean>(false); // State to manage visibility of asset logs
    
    // Handler function to toggle visibility of asset logs
    const toggleAssetLogsVisibility = () => {
        setAssetLogsVisible(!assetLogsVisible);
    };

    return (
        <>
            <Drawer
                title={title}
                onClose={onClose}
                visible={visible}
                width={1200}
            >
                {/* Render AssetTimelineHandler component only when asset logs visibility is true */}
                {assetLogsVisible && <AssetTimelineHandler assetUuid={assetUuid} />}
                {/* Button to toggle visibility of asset logs */}
                <button onClick={toggleAssetLogsVisibility}>
                    {assetLogsVisible ? 'Hide Asset Logs' : 'Show Asset Logs'}
                </button>
            </Drawer>
        </>
    );
};

export default TimelineDrawer;
