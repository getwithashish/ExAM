import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { PieChart } from "@mui/x-charts/PieChart";
import Stack from "@mui/material/Stack";
import { fetchAssetData, fetchAssetTypeData } from "../../api/ChartApi";
import {
  AssetData,
  AssetDetailData,
  ChartData,
  PieChartGraphProps,
} from "../../types/ChartTypes";
import axiosInstance from "../../../../config/AxiosConfig";
import NoData from "../../../NoData/NoData";
import { Typography } from "@mui/material";
import { statusColors } from "./StatusColors";
import { statusMapping } from "./statusMapping";

const ChartHandlers: React.FC<PieChartGraphProps> = () => {
  const [assetTypeData, setAssetTypeData] = useState<AssetDetailData[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedTypeId, setSelectedTypeId] = useState<number>(null);
  const [assetChartData, setAssetChartData] = useState<ChartData[]>([]);
  const [assetFilteredChartData, setAssetFilteredChartData] = useState<
    ChartData[]
  >([]);
  const [assignChartData, setAssignChartData] = useState<ChartData[]>([]);
  const [assignFilteredChartData, setAssignFilteredChartData] = useState<
    ChartData[]
  >([]);
  const [detailChartData, setDetailChartData] = useState<ChartData[]>([]);
  const [detailFilteredChartData, setDetailFilteredChartData] = useState<
    ChartData[]
  >([]);
  const [assetState, setAssetState] = useState<ChartData | null>(null); //query as &status=IN USE/IN STORE/IN REPAIR/EXPIRED/DISPOSED
  const [detailState, setDetailState] = useState<ChartData | null>(null); //query as &asset_detail_status=
  const [assignState, setAssignState] = useState<ChartData | null>(null); //query as &assign_status=
  const {
    data: _assetData,
    isLoading: assetLoading,
    isError: assetError,
  } = useQuery<AssetData>({
    queryKey: ["assetData"],
    queryFn: fetchAssetData,
  });

  useEffect(() => {
    fetchAssetTypeData()
      .then((data) => {
        console.log("Asset types", data);
        setAssetTypeData(data);
      })
      .catch((error) => {
        console.error("Error fetching asset data:", error);
      });
  }, []);

  useEffect(() => {
    fetchAssetData()
      .then((assetCountData) => {
        console.log("assetCountData", assetCountData);
        const assetTypeData = Object.entries(
          assetCountData?.status_counts ?? {}
        ).map(([label, value]) => ({
          label: statusMapping[label] ?? label,
          value: value as number,
          color: statusColors[label],
        }));
        setAssetChartData(assetTypeData);
        setAssetFilteredChartData(assetTypeData);
      })
      .catch((error) => {
        console.error("Error fetching asset count data:", error);
        setAssetFilteredChartData([]);
      });
    return () => {};
  }, []);

  const handleAssetItemClick = (_event: React.MouseEvent, params: any) => {
    const chartLabel = assetFilteredChartData[params["dataIndex"]]?.label;
    console.log("Clicked Asset Chart Label: ", chartLabel);
    setAssetState(chartLabel ?? null);
    // if (
    //   params &&
    //   assetChartData.length > 0 &&
    //   params.index < assetChartData.length
    // ) {
    //   const { index } = params;
    //   const AssetStatus = assetChartData[index];
    //   if (AssetStatus !== undefined) {
    //     setAssetState(AssetStatus);
    //   } else {
    //     setAssetState(null);
    //   }
    // }

  };
  
  useEffect(() => {
    console.log("assetState:", assetState);
  }, [assetState]);

  
  const handleDetailItemClick = (_event: React.MouseEvent, params: any) => {
    const chartLabel = detailFilteredChartData[params["dataIndex"]]?.label;
    console.log("Clicked Detail Chart Label: ", chartLabel);
    setDetailState(chartLabel?? null)

    // if (
    //   params &&
    //   detailChartData.length > 0 &&
    //   params.index < detailChartData.length
    // ) {
    //   const { index } = params;
    //   const detailStatus = detailChartData[index];
    //   if (detailStatus !== undefined) {
    //     setDetailState(detailStatus);
    //   } else {
    //     setDetailState(null);
    //   }
    // }

  };

    
  useEffect(() => {
    console.log("detailState:", detailState);
  }, [detailState]);

  const handleAssignItemClick = (_event: React.MouseEvent, params: any) => {
    const chartLabel = assignFilteredChartData[params["dataIndex"]]?.label;
    console.log("Clicked Assign Chart Label: ", chartLabel);
    setAssignState(chartLabel?? null)

    // if (
    //   params &&
    //   assignChartData.length > 0 &&
    //   params.index < assignChartData.length
    // ) {
    //   const { index } = params;
    //   const assignStatus = assignChartData[index];
    //   if (assignStatus !== undefined) {
    //     setAssignState(assignStatus);
    //   } else {
    //     setAssignState(null);
    //   }
    // }

  };

  useEffect(() => {
    console.log("assignState:", assignState);
  }, [assignState]);

  useEffect(() => {
    fetchAssetData()
      .then((res) => {
        const assetDetailData = res.asset_detail_status;
        console.log("response data", assetDetailData);

        const mergedStatusData = Object.entries(assetDetailData ?? {}).reduce(
          (acc, [label, value]) => {
            const mappedLabel = statusMapping[label] ?? label;

            if (mappedLabel === "REJECTED" || mappedLabel === "PENDING") {
              if (acc[mappedLabel]) {
                acc[mappedLabel].value += value;
              } else {
                acc[mappedLabel] = {
                  label: mappedLabel,
                  value: value,
                  color: statusColors[mappedLabel],
                };
              }
            } else if (
              ![
                "UPDATE_PENDING",
                "CREATE_PENDING",
                "UPDATE_REJECTED",
                "CREATE_REJECTED",
              ].includes(mappedLabel)
            ) {
              if (acc[mappedLabel]) {
                acc[mappedLabel].value += value;
              } else {
                acc[mappedLabel] = {
                  label: mappedLabel,
                  value: value,
                  color: statusColors[label],
                };
              }
            }

            return acc;
          },
          {} as { [key: string]: ChartData }
        );

        if (mergedStatusData["REJECTED"]) {
          mergedStatusData["REJECTED"].value +=
            mergedStatusData["UPDATE_REJECTED"]?.value ?? 0;
          mergedStatusData["REJECTED"].value +=
            mergedStatusData["CREATE_REJECTED"]?.value ?? 0;
          delete mergedStatusData["UPDATE_REJECTED"];
          delete mergedStatusData["CREATE_REJECTED"];
        }
        if (mergedStatusData["PENDING"]) {
          mergedStatusData["PENDING"].value +=
            mergedStatusData["UPDATE_PENDING"]?.value ?? 0;
          mergedStatusData["PENDING"].value +=
            mergedStatusData["CREATE_PENDING"]?.value ?? 0;
          delete mergedStatusData["UPDATE_PENDING"];
          delete mergedStatusData["CREATE_PENDING"];
        }

        const mergedStatusArray: ChartData[] = Object.values(mergedStatusData);

        setDetailChartData(mergedStatusArray);
        setDetailFilteredChartData(mergedStatusArray);
      })
      .catch((error) => {
        console.error("Error fetching asset details data:", error);
        setDetailFilteredChartData([]);
      });
  }, []);

  useEffect(() => {
    fetchAssetData()
      .then((assetAssignData) => {
        const assetAssignStatusData = Object.entries(
          assetAssignData?.assign_status ?? {}
        ).map(([label, value]) => ({
          label: statusMapping[label] ?? label,
          value: value as number,
          color: statusColors[label],
        }));
        setAssignChartData(assetAssignStatusData);
        setAssignFilteredChartData(assetAssignStatusData);
      })
      .catch((error) => {
        console.error("Error fetching assign details data:", error);
        setAssignFilteredChartData([]);
      });
  }, []);

  useEffect(() => {
    console.log("Selected Asset Type ID:", selectedTypeId);
  }, [selectedTypeId]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("assetTypeData", assetTypeData);
    const assetTypeValue = parseInt(e.target.value);

    if (assetTypeValue === 0) {
      console.log("Selected Asset Type: None");
      setSelectedTypeId(0);
    }

    const selectedAssetType = assetTypeData.find(
      (assetType) => assetType.id === assetTypeValue
    );
    console.log("selectedAssetType", selectedAssetType);

    if (selectedAssetType) {
      console.log("Selected Asset Type:", selectedAssetType.asset_type_name);
      setSelectedTypeId(selectedAssetType.id);
      setSelectedType(assetTypeValue.toString());
    } else {
      console.log("Selected asset type not found.");
    }

    //     selectedAssetType
    //     Object { id: 1, asset_type_name: "Laptop" }
    //     ChartHandlers.tsx:237:12
    //     Selected Asset Type: Laptop ChartHandlers.tsx:240:14
    //     Selected Asset Type ID: 1
    //     Clicked Asset Chart Label:  IN USE

    //selectedAssetType undefined ChartHandlers.tsx:237:12
    // Selected asset type not found.

    if (assetTypeValue === 0) {
      setAssetFilteredChartData(assetChartData);
      setDetailFilteredChartData(detailChartData);
      setAssignFilteredChartData(assignChartData);
    } else {
      axiosInstance
        .get(`/asset/asset_count?asset_type=${assetTypeValue}`)
        .then((assetRes) => {
          const assetCountData = assetRes.data.data;
          console.log("assetCountData: ", assetCountData);
          const assetFilteredData = Object.entries(
            assetCountData?.status_counts ?? {}
          ).map(([label, value]) => ({
            label,
            value: value as number,
            color: statusColors[label],
          }));
          setAssetFilteredChartData(assetFilteredData);
        })
        .catch((error) => {
          console.error("Error fetching asset data:", error);
          setAssetFilteredChartData([]);
        });

      axiosInstance
        .get(`/asset/asset_count?asset_type=${assetTypeValue}`)
        .then((detailRes) => {
          const detailCountData = detailRes.data.data;
          const detailFilteredData = Object.entries(
            detailCountData?.asset_detail_status ?? {}
          ).map(([label, value]) => ({
            label: statusMapping[label] ?? label,
            value: value as number,
            color: statusColors[label],
          }));
          setDetailFilteredChartData(detailFilteredData);
        })
        .catch((error) => {
          console.error("Error fetching detail data:", error);
          setDetailFilteredChartData([]);
        });

      axiosInstance
        .get(`/asset/asset_count?asset_type=${assetTypeValue}`)
        .then((assignRes) => {
          const assignCountData = assignRes.data.data;
          const assignFilteredData = Object.entries(
            assignCountData?.assign_status ?? {}
          ).map(([label, value]) => ({
            label: statusMapping[label] ?? label,
            value: value as number,
            color: statusColors[label],
          }));
          setAssignFilteredChartData(assignFilteredData);
        })
        .catch((error) => {
          console.error("Error fetching assign data:", error);
          setAssignFilteredChartData([]);
        });
    }
  };

  if (assetLoading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
      </div>
    );

  if (assetError) return <div>Error fetching data</div>;

  return (
    <Stack>
      <div className="flex justify-end">
        <select
          className="block bg-transparent font-display text-xs text-black-500 appearance-none dark:text-gray-400 dark:border-gray-200 focus:outline-none rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={handleSelectChange}
        >
          <option
            value="0"
            className="text-xs text-black font-display bg-white "
          >
            Select an asset type
          </option>
          {assetTypeData.map((assetType) => (
            <option
              key={assetType.id}
              value={assetType.id}
              className="text-xs text-black border-0 border-b-2 bg-white font-display"
            >
              {assetType.asset_type_name}
            </option>
          ))}
        </select>
      </div>
      <div className="items-center justify-center mx-auto">
        <Stack
          direction="row"
          spacing={1}
          sx={{ flexWrap: "wrap" }}
          className="ml-6"
        >
          {assetFilteredChartData.length === 0 &&
          detailFilteredChartData.length === 0 &&
          assignFilteredChartData.length === 0 ? (
            <div className="flex justify-center items-center h-full w-full">
              <NoData />
            </div>
          ) : (
            <>
              <div className=" pt-6 mt-4">
                <div className="text-center">
                  <span className="font-semibold font-display leading-none text-gray-900 dark:text-white text-lg">
                    Asset Status
                  </span>
                </div>
                <PieChart
                  margin={{ top: 10, bottom: 0, left: 10, right: 0 }}
                  series={[
                    {
                      data: assetFilteredChartData,
                      innerRadius: 60,
                      outerRadius: 140,
                      paddingAngle: 1,
                      cornerRadius: 10,
                      startAngle: 0,
                      endAngle: 360,
                      cx: 160,
                      cy: 160,
                      highlightScope: { faded: "global", highlighted: "item" },
                      faded: {
                        innerRadius: 75,
                        additionalRadius: -40,
                        color: "grey",
                      },
                    },
                  ]}
                  onClick={handleAssetItemClick}
                  width={350}
                  height={370}
                  slotProps={{
                    legend: {
                      direction: "row",
                      position: { vertical: "bottom", horizontal: "middle" },
                      hidden: false,
                      labelStyle: {
                        fontSize: 11,
                      },
                      itemMarkWidth: 8,
                      itemMarkHeight: 12,
                      markGap: 2,
                      itemGap: 8,
                    },
                  }}
                />
                {/* <div>
                  {assetCountData && (
                    <div>
                      <Typography>Status Counts:</Typography>
                      <pre>
                        {JSON.stringify(assetCountData.status_counts, null, 2)}
                      </pre>
                    </div>
                  )}
                  {clickedData && (
                    <div>
                      <Typography>Clicked Data:</Typography>
                      <pre>{JSON.stringify(clickedData, null, 2)}</pre>
                    </div>
                  )}
                </div> */}
              </div>
              <div className="item pt-6 mt-4">
                <div className="text-center">
                  <span className="font-semibold font-display leading-none text-gray-900 dark:text-white text-lg">
                    Approval Status
                  </span>
                </div>
                <PieChart
                  margin={{ top: 10, bottom: 0, left: 10, right: 0 }}
                  series={[
                    {
                      data: detailFilteredChartData,
                      innerRadius: 60,
                      outerRadius: 140,
                      paddingAngle: 1,
                      cornerRadius: 10,
                      startAngle: 0,
                      endAngle: 360,
                      cx: 160,
                      cy: 160,
                      highlightScope: { faded: "global", highlighted: "item" },
                      faded: {
                        innerRadius: 75,
                        additionalRadius: -40,
                        color: "grey",
                      },
                    },
                  ]}
                  onClick={handleDetailItemClick}
                  width={350}
                  height={370}
                  slotProps={{
                    legend: {
                      direction: "row",
                      position: { vertical: "bottom", horizontal: "middle" },
                      hidden: false,
                      labelStyle: {
                        fontSize: 11,
                      },
                      itemMarkWidth: 8,
                      itemMarkHeight: 12,
                      markGap: 2,
                      itemGap: 8,
                    },
                  }}
                />
              </div>
              <div className="item pt-6 mt-4">
                <div className="text-center">
                  <span className="font-semibold font-display leading-none text-gray-900 dark:text-white text-lg">
                    Allocation Status
                  </span>
                </div>
                <PieChart
                  margin={{ top: 10, bottom: 0, left: 10, right: 0 }}
                  series={[
                    {
                      data: assignFilteredChartData,
                      innerRadius: 60,
                      outerRadius: 140,
                      paddingAngle: 1,
                      cornerRadius: 10,
                      startAngle: 0,
                      endAngle: 360,
                      cx: 160,
                      cy: 160,
                      highlightScope: { faded: "global", highlighted: "item" },
                      faded: {
                        innerRadius: 75,
                        additionalRadius: -40,
                        color: "grey",
                      },
                    },
                  ]}
                  onClick={handleAssignItemClick}
                  width={350}
                  height={370}
                  slotProps={{
                    legend: {
                      direction: "row",
                      position: { vertical: "bottom", horizontal: "middle" },
                      hidden: false,
                      labelStyle: {
                        fontSize: 11,
                      },
                      itemMarkWidth: 8,
                      itemMarkHeight: 12,
                      markGap: 2,
                      itemGap: 8,
                    },
                  }}
                />
              </div>
            </>
          )}
        </Stack>
      </div>
    </Stack>
  );
};

export default ChartHandlers;
