import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import Stack from "@mui/material/Stack";
import { fetchAssetData, fetchAssetTypeData } from "../../api/ChartApi";
import {
  AssetData,
  AssetDetailData,
  ChartData,
  PieChartGraphProps,
} from "../../types/ChartTypes";
import axiosInstance from "../../../../config/AxiosConfig";
import { NoData } from "../../../NoData/NoData";
import { statusColors } from "./StatusColors";
import { statusMapping } from "./statusMapping";
import { RefreshTwoTone } from "@mui/icons-material";


const ChartHandlers: React.FC<PieChartGraphProps> = ({
  selectedTypeId,
  assetState,
  detailState,
  assignState,
  setSelectedTypeId,
  setAssetState,
  setDetailState,
  setAssignState,
  onClick,
}) => {
  const [assetTypeData, setAssetTypeData] = useState<AssetDetailData[]>([]);
  const [_selectedType, setSelectedType] = useState<string>("");
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
        setAssetTypeData(data);
      })
      .catch((error) => {
        console.error("Error fetching asset data:", error);
      });
  }, []);

  useEffect(() => {
    fetchAssetData()
      .then((assetCountData) => {

        const statusCounts = assetCountData?.status_counts ?? {};
        const inUseCount = statusCounts["IN USE"] ?? 0;
        const inStoreCount = statusCounts["IN STORE"] ?? 0;
        const inServiceCount = inUseCount + inStoreCount;

        const inServiceData = {
          label: "IN SERVICE",
          value: inServiceCount,
          color: statusColors["IN SERVICE"],
        };

        const statusOrder = ["IN SERVICE", "IN USE", "IN STOCK", "EXPIRED"];
        console.log(assetCountData)
        const filteredAssetCountData = Object.entries(statusCounts)
          .filter(([label]) => label !== "DISPOSED")
          .map(([label, value]) => ({
            label: statusMapping[label] ?? label,
            value: value as number,
            color: statusColors[label],
          }));
        const assetTypeData = [...filteredAssetCountData, inServiceData];

        assetTypeData.sort((a, b) => {
          return statusOrder.indexOf(b.label) - statusOrder.indexOf(a.label);
        });

        setAssetChartData(assetTypeData);
        setAssetFilteredChartData(assetTypeData);
      })
      .catch((error) => {
        console.error("Error fetching asset count data:", error);
        setAssetFilteredChartData([]);
      });

    return () => { };
  }, []);

  const handleChartItemClick = (
    filteredChartData: any[],
    setChartState: React.Dispatch<React.SetStateAction<string | null>>,
    dataIndex: number,
    onClick: () => void
  ) => {
    const chartLabel = filteredChartData[dataIndex]?.label;
  
    if (chartLabel === "IN STOCK") {
      setChartState("IN STORE");
    } else if (chartLabel === "IN SERVICE") {
      setChartState("IN STORE|IN USE");
    } else if (chartLabel === "PENDING") {
      setChartState("UPDATE_PENDING|CREATE_PENDING");
    } else if (chartLabel === "REJECTED") {
      setChartState("CREATE_REJECTED|UPDATE_REJECTED");
    } else if (chartLabel === "PENDING") {
      setChartState("ASSIGN_PENDING");
    } else {
      setChartState(chartLabel ?? null);
    }  
    onClick();
  };
  
  const handleAssetItemClick = (_event: React.MouseEvent, params: any) => {
    handleChartItemClick(assetFilteredChartData, setAssetState, params.dataIndex, onClick);
  };
  
  const handleDetailItemClick = (_event: React.MouseEvent, params: any) => {
    handleChartItemClick(detailFilteredChartData, setDetailState, params.dataIndex, onClick);
  };
  
  const handleAssignItemClick = (_event: React.MouseEvent, params: any) => {
    handleChartItemClick(assignFilteredChartData, setAssignState, params.dataIndex, onClick);
  };
  
  useEffect(() => {
    fetchAssetData()
      .then((res) => {
        const assetDetailData = res.asset_detail_status;
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

        const statusOrder = ["CREATED", "UPDATED", "PENDING", "REJECTED"]

        const mergedStatusArray: ChartData[] = statusOrder
          .map(label => mergedStatusData[label])
          .filter((entry): entry is ChartData => entry !== undefined);

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
      const assetAssignStatusData = Object.entries(assetAssignData?.assign_status ?? {}).map(([label, value]) => ({
        label: statusMapping[label] ?? label,
        value: value as number,
        color: statusColors[label] ?? "", // Ensure color is always present
      }));

      const statusOrder = ["ASSIGNED", "UNASSIGNED", "PENDING", "REJECTED"];
      const sortedAssignStatusData = statusOrder.map((label) =>
        assetAssignStatusData.find((data) => data.label === label)
      ).filter((entry): entry is ChartData => entry !== undefined);

      setAssignChartData(sortedAssignStatusData);
      setAssignFilteredChartData(sortedAssignStatusData);
    })
    .catch((error) => {
      console.error("Error fetching assign details data:", error);
      setAssignFilteredChartData([]);
    });
}, []);

  useEffect(() => {
  }, [selectedTypeId]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const assetTypeValue = parseInt(e.target.value);
    if (assetTypeValue === 0) {
      setSelectedTypeId(0);
    }
    const selectedAssetType = assetTypeData.find(
      (assetType) => assetType.id === assetTypeValue
    );
    if (selectedAssetType) {
      setSelectedTypeId(selectedAssetType.id);
      setSelectedType(assetTypeValue.toString());
    }
    if (assetTypeValue === 0) {
      setAssetFilteredChartData(assetChartData);
      setDetailFilteredChartData(detailChartData);
      setAssignFilteredChartData(assignChartData);
    } else {

      axiosInstance
        .get(`/asset/asset_count?asset_type=${assetTypeValue}`)
        .then((assetRes) => {
          const assetCountData = assetRes.data.data;
          const assetFilteredData = Object.entries(assetCountData?.status_counts ?? {})
            .filter(([label, _]) => label !== "DISPOSED")
            .map(([label, value]) => ({
              label,
              value: value as number,
              color: statusColors[label],
            }));
          const inUseCount = assetFilteredData.find(item => item.label === 'IN USE')?.value ?? 0;
          const inStoreCount = assetFilteredData.find(item => item.label === 'IN STORE')?.value ?? 0;
          const inServiceCount = inUseCount + inStoreCount;
          if (inServiceCount > 0) {
            assetFilteredData.push({
              label: 'IN SERVICE',
              value: inServiceCount,
              color: statusColors['IN SERVICE'],
            });
          }
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

  const chartsData = [
    {
      title: 'Asset Status',
      data: assetFilteredChartData,
      onClick: handleAssetItemClick,
    },
    {
      title: 'Approval Status',
      data: detailFilteredChartData,
      onClick: handleDetailItemClick,
    },
    {
      title: 'Allocation Status',
      data: assignFilteredChartData,
      onClick: handleAssignItemClick,
    },
  ];

  return (
    <Stack>
      <div className="flex justify-end">
      <RefreshTwoTone
          onClick={() => {
            handleSelectChange({ target: { value: selectedTypeId.toString() } } as React.ChangeEvent<HTMLSelectElement>);
            setAssetFilteredChartData(assetChartData);
            setDetailFilteredChartData(detailChartData);
            setAssignFilteredChartData(assignChartData);
          }}
          style={{ backgroundColor:"#63c5da",cursor: "pointer", margin: "10px", borderRadius:'10px', color:'white' }}
        />
        <select
          className="block bg-transparent font-display text-xs text-black-500 appearance-none dark:text-gray-400 dark:border-gray-200 focus:outline-none rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={handleSelectChange}
          value={selectedTypeId}      
        >
           <option value="0" className="text-xs text-black font-display bg-white">
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
      <>
        <Stack
          direction="row"
        >
          {assetFilteredChartData.length === 0 &&
            detailFilteredChartData.length === 0 &&
            assignFilteredChartData.length === 0 ? (
            <div className="flex justify-center items-center h-full w-full">
              <NoData />
            </div>
          ) : (
            <Stack direction="row" sx={{ flexWrap: "wrap" }} className="m-auto lg:p-10">
            {chartsData.map((chart, index) => (
              <div key={index} className="pt-6 mt-4 text-center items-center justify-center">
                <span className="font-semibold font-display leading-none text-gray-900 dark:text-white text-lg">
                  {chart.title}
                </span>
                <PieChart
                  margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
                  series={[
                    {
                      data: chart.data,
                      innerRadius: 60,
                      outerRadius: 150,
                      paddingAngle: 1,
                      cornerRadius: 10,
                      startAngle: 0,
                      endAngle: 360,
                      cx: 200,
                      cy: 200,
                      highlightScope: { faded: "global", highlighted: "item" },
                      arcLabel: (item) => `${item.value}`,
                      arcLabelMinAngle: 10,
                      faded: {
                        innerRadius: 60,
                        additionalRadius: -60,
                        color: "gray",
                      },
                    },
                  ]}
                  sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                      fill: "white",
                      fontWeight: "light",
                      fontSize: 20,
                    },
                  }}
                  onClick={chart.onClick}
                  width={400}
                  height={400}
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
            ))}
          </Stack>
          )}
        </Stack>
      </>
    </Stack>
  );
};

export default ChartHandlers;
