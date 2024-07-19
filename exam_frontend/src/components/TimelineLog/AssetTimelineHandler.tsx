import React, { useState, useEffect, useMemo, useCallback } from "react";
import axiosInstance from "../../config/AxiosConfig";
import { Timeline } from "flowbite-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Log, Props } from "./types/types";

const FILTERED_KEYS = ['updated_at', 'asset_detail_status'];

const useAssetLogs = (assetUuid: string) => {
  const [assetLogs, setAssetLogs] = useState<Log[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!assetUuid) return;

    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/asset/asset_lifecycle/${assetUuid}`);
        if (response.data && response.data.data && Array.isArray(response.data.data.logs)) {
          setAssetLogs(response.data.data.logs);
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

  return { assetLogs, isLoading };
};

export const AssetTimelineHandler = ({ assetUuid }: Props) => {
  const { assetLogs, isLoading } = useAssetLogs(assetUuid);

  const filteredLogs = useMemo(() => {
    if (!assetLogs) return [];
    return assetLogs.map((log: Log) => {
      const filteredChanges = Object.entries(log.changes).filter(
        ([key, _]) => !FILTERED_KEYS.includes(key)
      );
      return { ...log, changes: Object.fromEntries(filteredChanges) };
    });
  }, [assetLogs]);

  const updatedFields = useMemo(() => {
    return filteredLogs.flatMap((log: Log) =>
      Object.entries(log.changes)
        .filter(
          ([_, value]) =>
            value.old_value !== "None" &&
            value.old_value !== value.new_value
        )
        .map(([key, _]) => key)
    );
  }, [filteredLogs]);

  const renderChangeValue = useCallback((key: string, value: any) => {
    if (key === "requester_id") {
      return <span>Requester: {value.old_value}</span>;
    }
    if (key === "custodian") {
      return (
        <>
          {value.old_value !== "None" && <span>Prev custodian: {value.old_value}</span>}
          {value.new_value && <p>New custodian: {value.new_value}</p>}
        </>
      );
    }
    if (value.old_value !== "None" && value.new_value !== "None") {
      return <>{key}: {value.old_value} to {value.new_value}</>;
    }
    if (value.old_value !== "None") {
      return <>{key}: {value.old_value} (removed)</>;
    }
    return <>{key}: {value.new_value} (added)</>;
  }, []);

  if (isLoading) {
    return <FontAwesomeIcon icon={faSpinner} spin size="3x" />;
  }

  if (!filteredLogs || filteredLogs.length === 0) {
    return (
      <div className="flex">
        <FontAwesomeIcon className="mt-3" icon={faExclamation} size="2x" />
        <span className="m-3 text-lg font-display text-white font-semibold">
          NO LOGS AVAILABLE
        </span>
      </div>
    );
  }

  return (
    <Timeline>
      {filteredLogs.map(
        (log: Log) =>
          Object.keys(log.changes).length > 0 && (
            <Timeline.Item key={log.id}>
              <Timeline.Point />
              <Timeline.Content>
                <Timeline.Time>{log.timestamp}</Timeline.Time>
                <Timeline.Title><span className="text-white">{log.operation}</span></Timeline.Title>
                <Timeline.Body>
                  <ul>
                    {Object.entries(log.changes).map(([key, value]) => (
                      <li key={key}>{renderChangeValue(key, value)}</li>
                    ))}
                  </ul>
                </Timeline.Body>
              </Timeline.Content>
            </Timeline.Item>
          )
      )}
    </Timeline>
  );
};

export default AssetTimelineHandler;