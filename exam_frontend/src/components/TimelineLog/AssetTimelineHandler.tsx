import React, { useState, useEffect, useMemo, useCallback } from "react";
import axiosInstance from "../../config/AxiosConfig";
import { Timeline } from "flowbite-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Log, Props } from "./types/types";
import { motion } from "framer-motion";

const FILTERED_KEYS = ["updated_at", "asset_detail_status"];

const useAssetLogs = (assetUuid: string) => {
  const [assetLogs, setAssetLogs] = useState<Log[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!assetUuid) return;

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

  const splitAndCapitalizeWords = (assetFieldName: string) => {
    return assetFieldName
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

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
            value.old_value !== "None" && value.old_value !== value.new_value
        )
        .map(([key, _]) => key)
    );
  }, [filteredLogs]);

  const findKeyName = (key: string) => {
    const fieldKeys = ["asset_type", "business_unit"];
    if (fieldKeys.includes(key)) {
      return `${key}_name`;
    } else if (key === "location" || key === "invoice_location") {
      return `location_name`;
    } else if (key === "memory") {
      return `${key}_space`;
    }
    return key;
  };

  const findFieldValue = (key: string, value: any) => {
    const keyName = findKeyName(key);
    if (keyName === key) {
      return value?.toString();
    } else {
      return JSON.parse(value)[keyName].toString();
    }
  };

  const renderChangeValue = useCallback((key: string, value: any) => {
    if (key === "is_deleted") {
      return;
    }
    if (key === "requester_id") {
      return <span>Requester: {value.old_value}</span>;
    }
    if (key === "custodian") {
      return (
        <>
          {value.old_value && value.old_value != "None" && (
            <span>
              Prev custodian: {JSON.parse(value.old_value).employee_name}
            </span>
          )}
          {value.new_value && value.new_value != "None" && (
            <p>New custodian: {JSON.parse(value.new_value).employee_name}</p>
          )}
        </>
      );
    }
    if (key === "business_unit") {
      return (
        <>
          {value.old_value && value.old_value != "None" && (
            <span>
              Prev Business Unit:{" "}
              {JSON.parse(value.old_value).business_unit_name}
            </span>
          )}
          {value.new_value && value.new_value != "None" && (
            <p>
              New Business Unit:{" "}
              {JSON.parse(value.new_value).business_unit_name}
            </p>
          )}
        </>
      );
    }
    if (value.old_value == value.new_value) {
      return <></>;
    }
    if (
      value.old_value &&
      value.old_value !== "None" &&
      value.new_value &&
      value.new_value !== "None"
    ) {
      return (
        <>
          {splitAndCapitalizeWords(key)}: {findFieldValue(key, value.old_value)}{" "}
          to {findFieldValue(key, value.new_value)}
        </>
      );
    }
    if (value.old_value !== "None") {
      return (
        <>
          {splitAndCapitalizeWords(key)}: {findFieldValue(key, value.old_value)}{" "}
          (removed)
        </>
      );
    }
    return (
      <>
        {splitAndCapitalizeWords(key)}: {findFieldValue(key, value.new_value)}{" "}
        (added)
      </>
    );
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
        (log: Log, index: number) =>
          Object.keys(log.changes).length > 0 && (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Timeline.Item key={log.id}>
                <Timeline.Point />
                <Timeline.Content>
                  <Timeline.Time>{log.timestamp}</Timeline.Time>
                  <Timeline.Title>
                    <span className="text-white">{log.operation}</span>
                  </Timeline.Title>
                  <Timeline.Body>
                    <ul>
                      {Object.entries(log.changes).map(([key, value]) => (
                        <li key={key}>{renderChangeValue(key, value)}</li>
                      ))}
                    </ul>
                  </Timeline.Body>
                </Timeline.Content>
              </Timeline.Item>
            </motion.div>
          )
      )}
    </Timeline>
  );
};

export default AssetTimelineHandler;
