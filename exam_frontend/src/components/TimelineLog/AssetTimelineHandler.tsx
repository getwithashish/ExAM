import axiosInstance from "../../config/AxiosConfig";
import { useState, useEffect } from "react";
import { Timeline } from "flowbite-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

export const AssetTimelineHandler = ({ assetUuid }: { assetUuid: string }) => {
    const [assetLogs, setAssetLogs] = useState<any>(null);
    const [updatedFields, setUpdatedFields] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await axiosInstance.get(
            `/asset/asset_lifecycle/${assetUuid}`
            );
            if (
            response.data &&
            response.data.data &&
            Array.isArray(response.data.data.logs)
            ) {
            const filteredLogs = response.data.data.logs.map(
                (log: any, index: number) => {
                const filteredChanges = Object.entries(log.changes).filter(
                    ([key, value]: [string, any]) => key !== "updated_at"
                );
                if (index === 0 && log.operation === "UPDATED") {
                    log.operation = "CREATED";
                }
                return { ...log, changes: Object.fromEntries(filteredChanges) };
                }
            );

            const fields = filteredLogs.flatMap((log: any) =>
                Object.entries(log.changes)
                    .filter(
                        ([_, value]: [string, any]) =>
                            value.old_value !== "None" &&
                            value.old_value !== value.new_value
                    )
                    .map(([key, _]: [string, any]) => key)
            );

            setUpdatedFields(fields);
            console.log(`Updated fields for assetUuid ${assetUuid}:`, fields);

            setAssetLogs(filteredLogs); 
            } else {
            console.error("Invalid response data format");
            }
        } catch (error) {
            console.error("Error fetching asset logs", error);
        } finally {
            setIsLoading(false);
        }
        };
        if (assetUuid) {
        fetchData();
        }
    }, [assetUuid]);

    return (
        <>
        {isLoading ? (
            <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        ) : assetLogs && assetLogs.length > 0 ? (
            <Timeline>
            {assetLogs.map(
                (log: any) =>
                Object.keys(log.changes).length > 0 && (
                    <Timeline.Item key={log.id}>
                    <Timeline.Point />
                    <Timeline.Content>
                        <Timeline.Time>{log.timestamp}</Timeline.Time>
                        <Timeline.Title>{log.operation}</Timeline.Title>
                        <Timeline.Body>
                        <ul>
                            {Object.entries(log.changes).map(
                            ([key, value]: [string, any]) =>
                                value.old_value !== "None" && (
                                <li key={key}>
                                    {key}:{value.old_value} to {value.new_value}
                                </li>
                                )
                            )}
                        </ul>
                        </Timeline.Body>
                    </Timeline.Content>
                    </Timeline.Item>
                )
            )}
            </Timeline>
        ) : (
            <div className="flex">
            <FontAwesomeIcon
                className="mt-3"
                icon={faExclamationCircle}
                size="2x"
            />
            <span className="m-3 text-lg font-display font-semibold">
                NO LOGS AVAILABLE
            </span>
            </div>
        )}
        </>
    );
    };

export default AssetTimelineHandler;
