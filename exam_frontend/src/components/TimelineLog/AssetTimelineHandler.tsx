import axiosInstance from "../../config/AxiosConfig";
import { useState, useEffect } from "react";
import { Timeline } from "flowbite-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation, faSpinner } from "@fortawesome/free-solid-svg-icons";

export const AssetTimelineHandler = ({ assetUuid }: { assetUuid: string }) => {
  const [assetLogs, setAssetLogs] = useState<any>(null);
  const [updatedFields, setUpdatedFields] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!assetUuid) return;

    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `/asset/asset_lifecycle/${assetUuid}`
        );
        console.log(response.data.data.logs)
        if (
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data.logs)
        ) {
          const filteredLogs = response.data.data.logs.map((log: any) => {
            const filteredChanges = Object.entries(log.changes).filter(
              ([key, _]: [string, any]) =>
                key !== "updated_at" && key !== "asset_detail_status"
            );
            return { ...log, changes: Object.fromEntries(filteredChanges) };
          });

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
          filteredLogs.forEach((log: any) => {
            Object.entries(log.changes).forEach(
              ([key, value]: [string, any]) => {
                if (fields.includes(key)) {
                  console.log(
                    `Field: ${key}, Old Value: ${value.old_value}, New Value: ${value.new_value}`
                  );
                }
              }
            );
          });

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

    fetchData();
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
                        {Object.entries(log.changes).map(([key, value]: [string, any]) => (
                          <li key={key}>
                            {key === "requester_id" ? (
                              <span>Requester: {value.old_value}</span> // Display only the old value for requester
                            ) : key === "custodian" ? (
                              <>
                                {value.old_value !== "None" && (
                                  <span>Prev custodian: {value.old_value}</span>
                                )}
                                {value.new_value && (
                                  <p>New custodian: {value.new_value}</p>
                                )}
                              </>
                            ) : (
                              <>
                                {value.old_value !== "None" && value.new_value !== "None" ? (
                                  <>
                                    {key}: {value.old_value} to {value.new_value}
                                  </>
                                ) : value.old_value !== "None" ? (
                                  <>
                                    {key}: {value.old_value} (removed)
                                  </>
                                ) : (
                                  <>
                                    {key}: {value.new_value} (added)
                                  </>
                                )}
                              </>
                            )}
                          </li>
                        ))}

                      </ul>
                    </Timeline.Body>
                  </Timeline.Content>
                </Timeline.Item>
              )
          )}
        </Timeline>
      ) : (
        <div className="flex">
          <FontAwesomeIcon className="mt-3" icon={faExclamation} size="2x" />
          <span className="m-3 text-lg font-display font-semibold">
            NO LOGS AVAILABLE
          </span>
        </div>
      )}
    </>
  );
};

export default AssetTimelineHandler;




