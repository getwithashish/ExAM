import axiosInstance from '../../config/AxiosConfig';
import { useState, useEffect } from 'react';
import { Timeline } from "flowbite-react";

const AssetTimelineHandler = ({ assetUuid }: { assetUuid: string }) => {
    const [assetLogs, setAssetLogs] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`/asset/asset_lifecycle/${assetUuid}`);
                console.log("response data", response.data);
                if (response.data && response.data.data && Array.isArray(response.data.data.logs)) {
                    const filteredLogs = response.data.data.logs.map((log: any, index: number) => {
                        const filteredChanges = Object.entries(log.changes).filter(([key, value]: [string, any]) => key !== 'updated_at');
                        if (index === 0 && log.operation === 'UPDATED') {
                            log.operation = 'CREATED';
                        }
                        return { ...log, changes: Object.fromEntries(filteredChanges) };
                    });
                    setAssetLogs(filteredLogs);
                } else {
                    console.error('Invalid response data format');
                }
            } catch (error) {
                console.error('Error fetching asset logs', error);
            }
        };
        if (assetUuid) {
            fetchData();
        }
    }, [assetUuid]);

    return (
        <>
            {assetLogs && assetLogs.some((log: any) => Object.keys(log.changes).length > 0) && (
                <Timeline>
                    {assetLogs.map((log: any) => (
                        Object.keys(log.changes).length > 0 && (
                            <Timeline.Item key={log.id}>
                                <Timeline.Point />
                                <Timeline.Content>
                                    <Timeline.Time>{log.timestamp}</Timeline.Time>
                                    <Timeline.Title>{log.operation}</Timeline.Title>
                                    <Timeline.Body>
                                        <ul>
                                            {Object.entries(log.changes).map(([key, value]: [string, any]) => (
                                                (value as { old_value : string; new_value : string }).old_value !== 'None' && (
                                                    <li key={key}>
                                                        {key }:{(value as { old_value : string; new_value : string }).old_value} to {(value as { old_value : string; new_value : string }).new_value} 
                                                    </li>
                                                )
                                            ))}
                                        </ul>
                                    </Timeline.Body>
                                </Timeline.Content>
                            </Timeline.Item>
                        )
                    ))}
                </Timeline>
            )}
        </>
    );
};

export default AssetTimelineHandler;
