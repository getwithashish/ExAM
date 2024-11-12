import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { createTheme, ThemeProvider } from "@mui/material/styles";
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
import { AssetStatusTooltip } from "../../../Tooltip/AssetStatusTooltip";
import { motion } from "framer-motion";
import { Skeleton } from "@mui/material";

const ChartHandlers: React.FC<PieChartGraphProps> = forwardRef(
  (
    {
      selectedTypeId,
      setSelectedTypeId,
      setAssetState,
      setDetailState,
      setAssignState,
      onClick,
      triggerRefresh,
    },
    ref
  ) => {
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
    const [isDataFetching, setIsDataFetching] = useState<number>(0);

    // const [assetCountData, setAssetCountData] = useState<any>(null);
    const {
      data: _assetData,
      isLoading: assetLoading,
      isError: assetError,
    } = useQuery<AssetData>({
      queryKey: ["assetData"],
      queryFn: fetchAssetData,
    });

    const [pieSize, setPieSize] = useState({});

    useEffect(() => {
      fetchAssetTypeData()
        .then((data) => {
          setAssetTypeData(data);
        })
        .catch((error) => {
          console.error("Error fetching asset data:", error);
        });
    }, []);

    const calculateTotalValue = (data: ChartData[]) => {
      return data.reduce((total, item) => total + item.count, 0);
    };

    const adjustChartData = (data: ChartData[]) => {
      const totalValue = calculateTotalValue(data);
      return data.map((item) => ({
        ...item,
        value:
          totalValue > 0 ? Math.max((item.count / totalValue) * 100, 15) : 0,
      }));
    };

    const getAssetDetailStatusCountMergedArray = (
      asset_detail_status_count
    ) => {
      const mergedStatusData = Object.entries(
        asset_detail_status_count ?? {}
      ).reduce((acc, [label, count]) => {
        const mappedLabel = statusMapping[label] ?? label;
        if (mappedLabel === "REJECTED" || mappedLabel === "PENDING") {
          if (acc[mappedLabel]) {
            acc[mappedLabel].count += count;
          } else {
            acc[mappedLabel] = {
              label: mappedLabel,
              count: count,
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
            acc[mappedLabel].count += count;
          } else {
            acc[mappedLabel] = {
              label: mappedLabel,
              count: count,
              color: statusColors[label],
            };
          }
        }
        return acc;
      }, {} as { [key: string]: ChartData });

      if (mergedStatusData["REJECTED"]) {
        mergedStatusData["REJECTED"].count +=
          mergedStatusData["UPDATE_REJECTED"]?.count ?? 0;
        mergedStatusData["REJECTED"].count +=
          mergedStatusData["CREATE_REJECTED"]?.count ?? 0;
        delete mergedStatusData["UPDATE_REJECTED"];
        delete mergedStatusData["CREATE_REJECTED"];
      }

      if (mergedStatusData["PENDING"]) {
        mergedStatusData["PENDING"].count +=
          mergedStatusData["UPDATE_PENDING"]?.count ?? 0;
        mergedStatusData["PENDING"].count +=
          mergedStatusData["CREATE_PENDING"]?.count ?? 0;
        delete mergedStatusData["UPDATE_PENDING"];
        delete mergedStatusData["CREATE_PENDING"];
      }

      const statusOrder = ["CREATED", "UPDATED", "PENDING", "REJECTED"];

      const mergedStatusArray: ChartData[] = statusOrder
        .map((label) => mergedStatusData[label])
        .filter((entry): entry is ChartData => entry !== undefined);

      return mergedStatusArray;
    };

    useEffect(() => {
      setIsDataFetching(isDataFetching + 1);
      fetchAssetData()
        .then((assetCountData) => {
          const statusCounts = assetCountData?.status_counts ?? {};
          const inUseCount = statusCounts["USE"] ?? 0;
          const inStoreCount = statusCounts["STOCK"] ?? 0;
          const inServiceCount = inUseCount + inStoreCount;

          let inServiceData = {
            label: "ACTIVE",
            count: inServiceCount,
            color: statusColors["ACTIVE"],
            value: 0,
          };

          const statusOrder = [
            "USE",
            "STOCK",
            "ACTIVE",
            "OUTDATED",
            "REPAIR",
            "DAMAGED",
          ];
          let filteredAssetCountData = Object.entries(statusCounts)
            .filter(([label]) => label.trim() !== "SCRAP")
            .map(([label, value]) => ({
              label: statusMapping[label] ?? label,
              count: value as number,
              color: statusColors[label],
            }));

          let totalValue = calculateTotalValue(filteredAssetCountData);
          filteredAssetCountData = adjustChartData(filteredAssetCountData);

          inServiceData.value =
            totalValue > 0
              ? (Math.max(inUseCount, inStoreCount) / totalValue) * 100 + 5
              : 0;
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
        })
        .finally(() => {
          setIsDataFetching(isDataFetching - 1);
        });

      return () => {};
    }, []);

    const handleChartItemClick = (
      filteredChartData: any[],
      setChartState: React.Dispatch<React.SetStateAction<string | null>>,
      dataIndex: number,
      onClick: () => void
    ) => {
      const chartLabel = filteredChartData[dataIndex]?.label;

      if (chartLabel === "STOCK") {
        setChartState("STOCK");
      } else if (chartLabel === "ACTIVE") {
        setChartState("STOCK|USE");
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
      handleChartItemClick(
        assetFilteredChartData,
        setAssetState,
        params.dataIndex,
        onClick
      );
    };

    const handleDetailItemClick = (_event: React.MouseEvent, params: any) => {
      handleChartItemClick(
        detailFilteredChartData,
        setDetailState,
        params.dataIndex,
        onClick
      );
    };

    const handleAssignItemClick = (_event: React.MouseEvent, params: any) => {
      handleChartItemClick(
        assignFilteredChartData,
        setAssignState,
        params.dataIndex,
        onClick
      );
    };

    useEffect(() => {
      setIsDataFetching(isDataFetching + 1);
      fetchAssetData()
        .then((res) => {
          const assetDetailData = res.asset_detail_status;

          let mergedStatusArray =
            getAssetDetailStatusCountMergedArray(assetDetailData);
          mergedStatusArray = adjustChartData(mergedStatusArray);

          setDetailChartData(mergedStatusArray);
          setDetailFilteredChartData(mergedStatusArray);
        })
        .catch((error) => {
          console.error("Error fetching asset details data:", error);
          setDetailFilteredChartData([]);
        })
        .finally(() => {
          setIsDataFetching(isDataFetching - 1);
        });
    }, []);

    useEffect(() => {
      setIsDataFetching(isDataFetching + 1);
      fetchAssetData()
        .then((assetAssignData) => {
          const assetAssignStatusData: ChartData[] = Object.entries(
            assetAssignData?.assign_status ?? {}
          ).map(([label, value]) => ({
            label: statusMapping[label] ?? label,
            count: value as number,
            color: statusColors[label] ?? "",
          }));

          const statusOrder = ["ASSIGNED", "UNASSIGNED", "PENDING", "REJECTED"];
          let sortedAssignStatusData = statusOrder
            .map((label) =>
              assetAssignStatusData.find((data) => data.label === label)
            )
            .filter((entry): entry is ChartData => entry !== undefined);

          sortedAssignStatusData = adjustChartData(sortedAssignStatusData);

          setAssignChartData(sortedAssignStatusData);
          setAssignFilteredChartData(sortedAssignStatusData);
        })
        .catch((error) => {
          console.error("Error fetching assign details data:", error);
          setAssignFilteredChartData([]);
        })
        .finally(() => {
          setIsDataFetching(isDataFetching - 1);
        });
    }, []);

    useEffect(() => {}, [selectedTypeId]);

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
        setIsDataFetching(isDataFetching + 1);
        // setAssetFilteredChartData(assetChartData);
        // setDetailFilteredChartData(detailChartData);
        // setAssignFilteredChartData(assignChartData);
        axiosInstance
          .get(`/asset/asset_count`)
          .then((assetRes) => {
            const assetCountData = assetRes.data.data;
            let assetFilteredData = Object.entries(
              assetCountData?.status_counts ?? {}
            )
              .filter(([label, _]) => label.trim() !== "SCRAP")
              .map(([label, value]) => ({
                label,
                count: value as number,
                color: statusColors[label],
              }));
            const inUseCount =
              assetFilteredData.find((item) => item.label === "USE")?.count ??
              0;
            const inStoreCount =
              assetFilteredData.find((item) => item.label === "STOCK")?.count ??
              0;

            let totalValue = calculateTotalValue(assetFilteredData);

            const inServiceCount = inUseCount + inStoreCount;

            assetFilteredData = adjustChartData(assetFilteredData);
            let inServiceData = {
              label: "ACTIVE",
              count: inServiceCount,
              color: statusColors["ACTIVE"],
              value:
                totalValue > 0
                  ? (Math.max(inUseCount, inStoreCount) / totalValue) * 100 + 5
                  : 0,
            };

            const assetTypeData = [...assetFilteredData, inServiceData];

            setAssetFilteredChartData(assetTypeData);
          })
          .catch((error) => {
            console.error("Error fetching asset data:", error);
            setAssetFilteredChartData([]);
          })
          .finally(() => {
            setIsDataFetching(isDataFetching - 1);
          });

        setIsDataFetching(isDataFetching + 1);
        axiosInstance
          .get(`/asset/asset_count`)
          .then((detailRes) => {
            const detailCountData = detailRes.data.data;

            let mergedStatusArray = getAssetDetailStatusCountMergedArray(
              detailCountData?.asset_detail_status
            );
            mergedStatusArray = adjustChartData(mergedStatusArray);
            setDetailFilteredChartData(mergedStatusArray);
          })
          .catch((error) => {
            console.error("Error fetching detail data:", error);
            setDetailFilteredChartData([]);
          })
          .finally(() => {
            setIsDataFetching(isDataFetching - 1);
          });

        setIsDataFetching(isDataFetching + 1);
        axiosInstance
          .get(`/asset/asset_count`)
          .then((assignRes) => {
            const assignCountData = assignRes.data.data;
            const assignFilteredData = Object.entries(
              assignCountData?.assign_status ?? {}
            ).map(([label, value]) => ({
              label: statusMapping[label] ?? label,
              count: value as number,
              color: statusColors[label],
            }));
            const statusOrder = [
              "ASSIGNED",
              "UNASSIGNED",
              "PENDING",
              "REJECTED",
            ];
            let sortedAssignStatusData = statusOrder
              .map((label) =>
                assignFilteredData.find((data) => data.label === label)
              )
              .filter((entry): entry is ChartData => entry !== undefined);

            sortedAssignStatusData = adjustChartData(sortedAssignStatusData);

            setAssignFilteredChartData(sortedAssignStatusData);
          })
          .catch((error) => {
            console.error("Error fetching assign data:", error);
            setAssignFilteredChartData([]);
          })
          .finally(() => {
            setIsDataFetching(isDataFetching - 1);
          });
      } else {
        setIsDataFetching(isDataFetching + 1);
        axiosInstance
          .get(`/asset/asset_count?asset_type=${assetTypeValue}`)
          .then((assetRes) => {
            const assetCountData = assetRes.data.data;
            let assetFilteredData = Object.entries(
              assetCountData?.status_counts ?? {}
            )
              .filter(([label, _]) => label.trim() !== "SCRAP")
              .map(([label, value]) => ({
                label,
                count: value as number,
                color: statusColors[label],
              }));
            const inUseCount =
              assetFilteredData.find((item) => item.label === "USE")?.count ??
              0;
            const inStoreCount =
              assetFilteredData.find((item) => item.label === "STOCK")?.count ??
              0;

            let totalValue = calculateTotalValue(assetFilteredData);
            assetFilteredData = adjustChartData(assetFilteredData);

            const inServiceCount = inUseCount + inStoreCount;
            if (inServiceCount > 0) {
              assetFilteredData.push({
                label: "ACTIVE",
                count: inServiceCount,
                color: statusColors["ACTIVE"],
                value:
                  totalValue > 0
                    ? (Math.max(inUseCount, inStoreCount) / totalValue) * 100 +
                      5
                    : 0,
              });
            }
            setAssetFilteredChartData(assetFilteredData);
          })
          .catch((error) => {
            console.error("Error fetching asset data:", error);
            setAssetFilteredChartData([]);
          })
          .finally(() => {
            setIsDataFetching(isDataFetching - 1);
          });

        setIsDataFetching(isDataFetching + 1);
        axiosInstance
          .get(`/asset/asset_count?asset_type=${assetTypeValue}`)
          .then((detailRes) => {
            const detailCountData = detailRes.data.data;
            let mergedStatusArray = getAssetDetailStatusCountMergedArray(
              detailCountData?.asset_detail_status
            );
            mergedStatusArray = adjustChartData(mergedStatusArray);

            setDetailFilteredChartData(mergedStatusArray);
          })
          .catch((error) => {
            console.error("Error fetching detail data:", error);
            setDetailFilteredChartData([]);
          })
          .finally(() => {
            setIsDataFetching(isDataFetching - 1);
          });

        setIsDataFetching(isDataFetching + 1);
        axiosInstance
          .get(`/asset/asset_count?asset_type=${assetTypeValue}`)
          .then((assignRes) => {
            const assignCountData = assignRes.data.data;
            const assignFilteredData = Object.entries(
              assignCountData?.assign_status ?? {}
            ).map(([label, value]) => ({
              label: statusMapping[label] ?? label,
              count: value as number,
              color: statusColors[label],
            }));
            const statusOrder = [
              "ASSIGNED",
              "UNASSIGNED",
              "PENDING",
              "REJECTED",
            ];
            let sortedAssignStatusData = statusOrder
              .map((label) =>
                assignFilteredData.find((data) => data.label === label)
              )
              .filter((entry): entry is ChartData => entry !== undefined);

            sortedAssignStatusData = adjustChartData(sortedAssignStatusData);

            setAssignFilteredChartData(sortedAssignStatusData);
          })
          .catch((error) => {
            console.error("Error fetching assign data:", error);
            setAssignFilteredChartData([]);
          })
          .finally(() => {
            setIsDataFetching(isDataFetching - 1);
          });
      }
    };

    // if (assetError) return <div>Error fetching data</div>;

    const darkTheme = createTheme({
      palette: {
        mode: "dark",
      },
    });

    const handleRefreshOnClick = () => {
      setIsDataFetching(1);
      handleSelectChange({
        target: { value: 0 },
      } as React.ChangeEvent<HTMLSelectElement>);
      setAssetFilteredChartData(assetChartData);
      setDetailFilteredChartData(detailChartData);
      setAssignFilteredChartData(assignChartData);
      setIsDataFetching(0);
    };

    useEffect(() => {
      handleRefreshOnClick();
    }, [triggerRefresh]);

    const updateLayout = () => {
      const devicePixelRatio = window.devicePixelRatio;

      // Determine layout values based on devicePixelRatio
      let newSpacing = 2;
      let newGap = 2;
      let newHeadingSize = "text-base";

      if (devicePixelRatio > 2) {
        newSpacing = 8;
        newGap = 4;
        newHeadingSize = "text-lg";
      } else if (devicePixelRatio > 1.5) {
        newSpacing = 6;
        newGap = 2;
        newHeadingSize = "text-md";
      } else {
        newSpacing = -4;
        newGap = 0;
        newHeadingSize = "text-sm";
      }

      // Set all values in a single update
      setPieSize({
        spacing: newSpacing,
        gap: newGap,
        headingSize: newHeadingSize,
      });
    };

    useEffect(() => {
      // Initial layout setup
      updateLayout();

      // Event listener for resizing
      window.addEventListener("resize", updateLayout);

      // Cleanup on unmount
      return () => window.removeEventListener("resize", updateLayout);
    }, []);

    useImperativeHandle(ref, () => ({
      handleSelectChange,
    }));

    return (
      <Stack>
        <div className="flex justify-end">
          {/* <div className="flex-2">
          <select
            className=" font-display text-xs dark:text-gray-400 dark:border-gray-200 focus:outline-none rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={handleSelectChange}
            value={selectedTypeId}
          >
            <option value="0" className="text-xs font-display">
              All Assets
            </option>
            {assetTypeData.map((assetType) => (
              <option
                key={assetType.id}
                value={assetType.id}
                className="text-xs text-white border-0 border-b-2 bg-grey-400 font-display"
              >
                {assetType.asset_type_name}
              </option>
            ))}
          </select>
        </div> */}
        </div>

        <>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ justifyContent: "center", alignItems: "center" }}
          >
            <Stack
              direction="row"
              spacing={pieSize.spacing}
              sx={{
                flexWrap: "wrap", // Allow items to wrap if necessary
                justifyContent: "space-evenly", // Evenly space items
                alignItems: "center",
                gap: pieSize.gap, // You can adjust this based on your preference
                paddingBottom: 2,
                paddingTop: isDataFetching >= 0 ? 6 : "auto",
                width: "100%", // Ensure full width of the parent
                boxSizing: "border-box",
              }}
              className="m-auto"
            >
              {isDataFetching >= 0 || assetError ? (
                <>
                  {["pie1", "pie2", "pie3"].map((item, index) => (
                    <motion.div
                      key={index}
                      className="pt-6 mt-4 text-center items-center justify-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15, delay: index * 0.15 }}
                    >
                      <Skeleton
                        animation="wave"
                        variant="circular"
                        width={150}
                        height={150}
                      />
                    </motion.div>
                  ))}
                </>
              ) : (
                <ThemeProvider theme={darkTheme}>
                  <div className="pt-6 mt-4 text-center items-center justify-center">
                    <span
                      className={`font-semibold font-display leading-none text-white dark:text-white ${pieSize.headingSize}`}
                    >
                      Asset Status <AssetStatusTooltip isChartTooltip={true} />
                    </span>

                    <PieChart
                      margin={{ top: 0, bottom: 20, left: 0, right: 0 }}
                      series={[
                        {
                          data: assetFilteredChartData,
                          innerRadius: 25, // Reduced inner radius
                          outerRadius: 75, // Reduced outer radius
                          paddingAngle: 0,
                          cornerRadius: 5,
                          startAngle: 0,
                          endAngle: 360,
                          cx: 100, // Adjusted center X for smaller size
                          cy: 100, // Adjusted center Y for smaller size
                          highlightScope: {
                            faded: "global",
                            highlighted: "item",
                          },
                          arcLabel: (item) => `${item.count}`,
                          arcLabelMinAngle: 10,
                          faded: {
                            innerRadius: 35, // Adjusted faded radius
                            additionalRadius: -35,
                            color: "grey",
                          },
                        },
                      ]}
                      sx={{
                        [`& .${pieArcLabelClasses.root}`]: {
                          fill: "white",
                          fontWeight: "light",
                          fontSize: 12, // Reduced font size for arc labels
                        },
                      }}
                      onItemClick={handleAssetItemClick}
                      width={200} // Reduced width
                      height={200} // Reduced height
                      tooltip={{
                        trigger: "item",
                      }}
                      slots={{
                        itemContent: (item) => {
                          const { color, label, count } =
                            item.series.data[item.itemData.dataIndex];
                          return (
                            <div
                              style={{
                                background: "rgba(0, 0, 0, 0.7)",
                                borderRadius: "8px",
                                padding: "6px", // Reduced padding for tooltip
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <div
                                style={{
                                  width: "10px", // Adjusted color indicator size
                                  height: "10px",
                                  borderRadius: "50%",
                                  backgroundColor: color,
                                  marginRight: "6px",
                                }}
                              />
                              <div>
                                <div className="flex items-center">
                                  <span className="mr-3">{label}</span>{" "}
                                  <span>{count}</span>
                                </div>
                              </div>
                            </div>
                          );
                        },
                      }}
                      slotProps={{
                        legend: {
                          direction: "row",
                          position: {
                            vertical: "bottom",
                            horizontal: "middle",
                          },
                          hidden: false,
                          labelStyle: {
                            fontSize: 10, // Reduced font size for legend
                            fill: "#ffffff",
                          },
                          itemMarkWidth: 6, // Adjusted legend item mark size
                          itemMarkHeight: 10,
                          markGap: 2,
                          itemGap: 2,
                          padding: { top: 4 },
                        },
                      }}
                    />
                  </div>
                  <div className=" pt-6 mt-4 text-center items-center justify-center">
                    <span
                      className={`font-semibold font-display leading-none text-white dark:text-white ${pieSize.headingSize}`}
                    >
                      Asset Approval Status
                    </span>
                    <PieChart
                      margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
                      series={[
                        {
                          data: detailFilteredChartData,
                          innerRadius: 25, // Reduced inner radius
                          outerRadius: 75, // Reduced outer radius
                          paddingAngle: 0,
                          cornerRadius: 5,
                          startAngle: 0,
                          endAngle: 360,
                          cx: 100, // Adjusted center X for smaller size
                          cy: 100, // Adjusted center Y for smaller size
                          highlightScope: {
                            faded: "global",
                            highlighted: "item",
                          },
                          arcLabel: (item) => `${item.count}`,
                          arcLabelMinAngle: 10,
                          faded: {
                            innerRadius: 35, // Adjusted faded radius
                            additionalRadius: -35,
                            color: "gray",
                          },
                        },
                      ]}
                      sx={{
                        [`& .${pieArcLabelClasses.root}`]: {
                          fill: "white",
                          fontWeight: "light",
                          fontSize: 12, // Reduced font size for arc labels
                        },
                      }}
                      onItemClick={handleDetailItemClick}
                      width={200} // Reduced width
                      height={200} // Reduced height
                      tooltip={{
                        trigger: "item",
                      }}
                      slots={{
                        itemContent: (item) => {
                          const { color, label, count } =
                            item.series.data[item.itemData.dataIndex];
                          return (
                            <div
                              style={{
                                background: "rgba(0, 0, 0, 0.7)",
                                borderRadius: "8px",
                                padding: "6px", // Reduced padding for tooltip
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <div
                                style={{
                                  width: "10px", // Adjusted color indicator size
                                  height: "10px",
                                  borderRadius: "50%",
                                  backgroundColor: color,
                                  marginRight: "6px",
                                }}
                              />
                              <div>
                                <div className="flex items-center">
                                  <span className="mr-3">{label}</span>{" "}
                                  <span>{count}</span>
                                </div>
                              </div>
                            </div>
                          );
                        },
                      }}
                      slotProps={{
                        legend: {
                          direction: "row",
                          position: {
                            vertical: "bottom",
                            horizontal: "middle",
                          },
                          hidden: false,
                          labelStyle: {
                            fontSize: 10, // Reduced font size for legend
                            fill: "#ffffff",
                          },
                          itemMarkWidth: 6, // Adjusted legend item mark size
                          itemMarkHeight: 10,
                          markGap: 2,
                          itemGap: 2,
                          padding: { top: 4 },
                        },
                        pieArc: {
                          strokeWidth: 0,
                        },
                      }}
                    />
                  </div>
                  <div className=" pt-6 mt-4 text-center items-center justify-center">
                    <span
                      className={`font-semibold font-display leading-none text-white dark:text-white ${pieSize.headingSize}`}
                    >
                      Asset Allocation Status
                    </span>
                    <PieChart
                      margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
                      series={[
                        {
                          data: assignFilteredChartData,
                          innerRadius: 25, // Reduced inner radius
                          outerRadius: 75, // Reduced outer radius
                          paddingAngle: 0,
                          cornerRadius: 5,
                          startAngle: 0,
                          endAngle: 360,
                          cx: 100, // Adjusted center X for smaller size
                          cy: 100, // Adjusted center Y for smaller size
                          highlightScope: {
                            faded: "global",
                            highlighted: "item",
                          },
                          arcLabel: (item) => `${item.count}`,
                          arcLabelMinAngle: 10,
                          faded: {
                            innerRadius: 30, // Adjusted faded radius
                            additionalRadius: -30,
                            color: "gray",
                          },
                        },
                      ]}
                      sx={{
                        [`& .${pieArcLabelClasses.root}`]: {
                          fill: "white",
                          fontWeight: "light",
                          fontSize: 12, // Smaller font for arc labels
                        },
                      }}
                      onItemClick={handleAssignItemClick}
                      width={200} // Reduced width
                      height={200} // Reduced height
                      tooltip={{
                        trigger: "item",
                      }}
                      slots={{
                        itemContent: (item) => {
                          const { color, label, count } =
                            item.series.data[item.itemData.dataIndex];
                          return (
                            <div
                              style={{
                                background: "rgba(0, 0, 0, 0.7)",
                                borderRadius: "8px",
                                padding: "6px", // Smaller padding for tooltip
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <div
                                style={{
                                  width: "10px", // Adjusted color indicator size
                                  height: "10px",
                                  borderRadius: "50%",
                                  backgroundColor: color,
                                  marginRight: "6px",
                                }}
                              />
                              <div>
                                <div className="flex items-center">
                                  <span className="mr-3">{label}</span>{" "}
                                  <span>{count}</span>
                                </div>
                              </div>
                            </div>
                          );
                        },
                      }}
                      slotProps={{
                        legend: {
                          direction: "row",
                          position: {
                            vertical: "bottom",
                            horizontal: "middle",
                          },
                          hidden: false,
                          labelStyle: {
                            fontSize: 10, // Smaller font for legend labels
                            fill: "#ffffff",
                          },
                          itemMarkWidth: 6, // Adjusted legend item mark size
                          itemMarkHeight: 10,
                          markGap: 2,
                          itemGap: 2,
                          padding: { top: 4 },
                        },
                      }}
                    />
                  </div>
                </ThemeProvider>
              )}
            </Stack>
          </Stack>
        </>
      </Stack>
    );
  }
);

export default ChartHandlers;
