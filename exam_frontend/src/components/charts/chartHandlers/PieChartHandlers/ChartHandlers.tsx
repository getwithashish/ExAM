import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
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
  // const [assetCountData, setAssetCountData] = useState<any>(null);
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
          label: "ACTIVE",
          value: inServiceCount,
          color: statusColors["ACTIVE"],
        };

        const statusOrder = ["IN USE", "STOCK", "ACTIVE", "EXPIRED"];
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

    if (chartLabel === "STOCK") {
      setChartState("IN STORE");
    } else if (chartLabel === "ACTIVE") {
      setChartState("IN STORE|IN USE");
    } else if (chartLabel === "PENDING") {
      setChartState("UPDATE_PENDING|CREATE_PENDING");
    } else if (chartLabel === "REJECTED") {
      setChartState("CREATE_REJECTED|UPDATE_REJECTED");
    } else if (chartLabel === "PENDING") {
      setChartState("ASSIGN_PENDING");
    } else if (chartLabel === "ALLOCATED") {
      setChartState("IN USE");
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
      // axiosInstance.get(`/asset/asset_count`)
      axiosInstance
        .get(`/asset/asset_count`)
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
              label: 'ACTIVE',
              value: inServiceCount,
              color: statusColors['ACTIVE'],
            });
          }
          setAssetFilteredChartData(assetFilteredData);
        })
        .catch((error) => {
          console.error("Error fetching asset data:", error);
          setAssetFilteredChartData([]);
        });

      axiosInstance
        .get(`/asset/asset_count`)
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
        .get(`/asset/asset_count`)
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
              label: 'ACTIVE',
              value: inServiceCount,
              color: statusColors['ACTIVE'],
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
      <div className="xl:p-2 mx-6 py-2 lg:h-96">
        <div className="flex items-center justify-center h-full">
          <div className="flex items-center justify-center">
            <svg
              aria-hidden="true"
              className="w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="ml-2 text-gray-200">Please wait. Data is loading...</span>
          </div>
        </div>

      </div>

    );

  if (assetError) return <div>Error fetching data</div>;

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const handleRefreshOnClick = () => {
    setTimeout(() => {
      assetLoading
    }, 2000);
    handleSelectChange({ target: { value: selectedTypeId.toString() } } as React.ChangeEvent<HTMLSelectElement>);
    setAssetFilteredChartData(assetChartData);
    setDetailFilteredChartData(detailChartData);
    setAssignFilteredChartData(assignChartData);


  }

  return (
    <Stack>
      <div className="flex justify-end">
        <div className="flex-1 justify-end">
          <RefreshTwoTone
            onClick={() => {
              handleRefreshOnClick()
            }}
            style={{
              cursor: "pointer",
              width: "30px",
              height: "40px",
              color: '#ffffff'
            }}
          />
        </div>
        <div className="flex-2">
          <select
            className="block bg-custom-400 text-white font-display text-xs dark:text-gray-400 dark:border-gray-200 focus:outline-none rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={handleSelectChange}
            value={selectedTypeId}
          >
            <option value="0" className="text-xs font-display">
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
            < Stack
              direction="row"
              sx={{ flexWrap: "wrap" }}
              className="m-auto"
            >
              <ThemeProvider theme={darkTheme}>
                <div className=" pt-6 mt-4 text-center items-center justify-center">
                  <span className="font-semibold font-display leading-none text-white dark:text-white text-lg">
                    Asset Status
                  </span>

                  <PieChart
                    margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
                    series={[
                      {
                        data: assetFilteredChartData,
                        innerRadius: 50,
                        outerRadius: 150,
                        paddingAngle: 0,
                        cornerRadius: 5,
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
                          color: "grey",
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
                    onItemClick={handleAssetItemClick}
                    width={400}
                    height={400}
                    tooltip={{ trigger: 'item' }}
                    slotProps={{
                      legend: {
                        direction: "row",
                        position: { vertical: "bottom", horizontal: "middle" },
                        hidden: false,
                        labelStyle: {
                          fontSize: 11,
                          fill: "#ffffff"
                        },
                        itemMarkWidth: 8,
                        itemMarkHeight: 12,
                        markGap: 2,
                        itemGap: 8,
                      },
                    }}
                  />
                </div>
                <div className=" pt-6 mt-4 text-center items-center justify-center">
                  <span className="font-semibold font-display leading-none text-white dark:text-white text-lg">
                    Asset Approval Status
                  </span>
                  <PieChart
                    margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
                    series={[
                      {
                        data: detailFilteredChartData,
                        innerRadius: 50,
                        outerRadius: 150,
                        paddingAngle: 0,
                        cornerRadius: 5,
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
                    onItemClick={handleDetailItemClick}
                    width={400}
                    height={400}
                    slotProps={{
                      legend: {
                        direction: "row",
                        position: { vertical: "bottom", horizontal: "middle" },
                        hidden: false,
                        labelStyle: {
                          fontSize: 11,
                          fill: "#ffffff"
                        },
                        itemMarkWidth: 8,
                        itemMarkHeight: 12,
                        markGap: 2,
                        itemGap: 8,
                      },
                      pieArc: {
                        strokeWidth: 0,
                      },
                    }}
                  />
                </div>
                <div className=" pt-6 mt-4 text-center items-center justify-center">
                  <span className="font-semibold font-display leading-none text-white dark:text-white text-lg">
                    Asset Allocation Status
                  </span>
                  <PieChart
                    margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
                    series={[
                      {
                        data: assignFilteredChartData,
                        innerRadius: 50,
                        outerRadius: 150,
                        paddingAngle: 0,
                        cornerRadius: 5,
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
                    onItemClick={handleAssignItemClick}
                    width={400}
                    height={400}
                    slotProps={{
                      legend: {
                        direction: "row",
                        position: { vertical: "bottom", horizontal: "middle" },
                        hidden: false,
                        labelStyle: {
                          fontSize: 11,
                          fill: "#ffffff"
                        },
                        itemMarkWidth: 8,
                        itemMarkHeight: 12,
                        markGap: 2,
                        itemGap: 8,
                      },
                    }}
                  />

                </div>
              </ThemeProvider>
            </Stack>
          )}
        </Stack>
      </>
    </Stack>
  );
};

export default ChartHandlers;