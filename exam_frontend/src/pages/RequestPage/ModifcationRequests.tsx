import { ChangeEvent, FC, useEffect, useState } from "react";
import { Label, Table, Textarea, TextInput } from "flowbite-react";
import axiosInstance from "../../config/AxiosConfig";
import React from "react";
import DrawerViewRequest from "./DrawerViewRequest";
import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import { ConfigProvider, Pagination, Spin, message, theme } from "antd";
import { RefreshTwoTone } from "@mui/icons-material";

const ModificationRequests: FC = function () {
  const [assets, setAssets] = useState<any[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [latestLogData, setLatestLogData] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>("updated_at");
  const [sortOrder, setSortOrder] = useState<string>("asc");

  useEffect(() => {
    fetchAssets();
  }, [currentPage, pageSize, searchQuery, sortBy, sortOrder]);

  const fetchAssets = () => {
    setLoading(true);
    const offset = (currentPage - 1) * pageSize;
    const searchQueryParam = searchQuery ? `&global_search=${searchQuery}` : "";
    const sortQueryParam = `&sort_by=${sortBy}&sort_order=${sortOrder}`;

    axiosInstance
      .get(
        `/asset/?limit=${pageSize}&offset=${offset}&asset_detail_status=UPDATE_PENDING${searchQueryParam}${sortQueryParam}`
      )
      .then((response) => {
        const updatePendingAssets = response.data.data.results;
        const totalAssets = response.data.data.count;
        setAssets(updatePendingAssets);
        setTotalPages(Math.ceil(totalAssets / 10));
      })
      .catch((error) => {
        console.error("Error fetching assets:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleApprove = () => {
    setLoading(true);
    setModalOpen(false);
    if (selectedAsset) {
      const approvalData = {
        approval_type: "ASSET_DETAIL_STATUS",
        asset_uuid: selectedAsset.asset_uuid,
        comments: selectedAsset.approverNotes,
      };

      axiosInstance
        .post("/asset/approve_asset", approvalData)
        .then((res) => {
          fetchAssets();
          setSelectedAsset(null);
          message.success(res.data?.message)
        })
        .catch((error) => {
          message.error(`Error Approving an Asset: ${error.response.data?.message}`);
          console.error("Error approving asset:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleReject = () => {
    setLoading(true);
    setModalOpen(false);
    if (selectedAsset) {
      const rejectedData = {
        data: {
          approval_type: "ASSET_DETAIL_STATUS",
          asset_uuid: selectedAsset.asset_uuid,
          comments: selectedAsset.approverNotes,
        },
      };

      axiosInstance
        .delete("/asset/approve_asset", rejectedData)
        .then((res) => {
          fetchAssets();
          setSelectedAsset(null);
          message.success(res.data?.message)
        })
        .catch((error) => {
          message.error(`Error Rejecting an Asset: ${error.response.data?.message}`);
          console.error("Error rejecting asset:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const filteredAssets = assets.filter(
    (asset) =>
      asset.asset_type?.asset_type_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      asset.asset_category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.model_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.serial_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.owner?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(asset.date_of_purchase)
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      String(asset.warranty_period)
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      asset.os?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.os_version?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.mobile_os?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.processor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.processor_gen?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.storage?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.configuration?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.accessories?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.location.location_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      asset.business_unit.business_unit_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      asset.requester?.username
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      asset.approved_by?.username
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      asset.custodian?.employee_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const onShowSizeChange = (_: number, size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleRefreshClick = () => {
    setLoading(true)
    setTimeout(() => {
      fetchAssets();
    }, 2000);

  };

  const { darkAlgorithm } = theme;
  const customTheme = {
    algorithm: darkAlgorithm,
    components: {
      Table: {
        colorBgContainer: "#161B21",
      },
    },
  };

  return (
    <React.Fragment>
      <div className="bg-custom-500 lg:ml-64 pt-24">
        <div className="block items-center justify-between bg-custom-400 px-2 dark:border-gray-700 dark:bg-gray-800 sm:flex mx-2 my-2">
          <div className="mb-1 w-full">
            <div className="m-2 flex items-center">
              <h1 className="font-medium font-display m-0 leading-none text-white text-xl">
                Modification Requests
              </h1>
              <RefreshTwoTone
                style={{
                  cursor: "pointer",
                  marginLeft: "10px",
                  width: "30px",
                  height: "40px",
                  color: "#ffffff",
                }}
                onClick={handleRefreshClick}
              />
            </div>
            <div className="block items-center sm:flex">
              <SearchRequests setSearchQuery={setSearchQuery} />
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="xl:p-2 mx-6 py-2 lg:h-72">
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
                    <span className="ml-2 text-gray-200">
                      Please wait. Data is loading...
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="inline-block w-full align-middle">
                <div className="overflow-hidden shadow-2xl mx-2 rounded-lg bg-custom-400">
                  <RequestTable
                    assets={filteredAssets}
                    setSelectedAsset={setSelectedAsset}
                    setLatestLogData={setLatestLogData}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <ConfigProvider theme={customTheme}>
          <Pagination
            showSizeChanger
            onShowSizeChange={onShowSizeChange}
            pageSize={pageSize}
            current={currentPage}
            total={totalPages * pageSize}
            onChange={setCurrentPage}
            className="rounded-xl p-4 ml-2 mt-2"
          />
        </ConfigProvider>
        {selectedAsset && (
          <ViewRequestModal
            loading={loading}
            asset={selectedAsset}
            handleApprove={handleApprove}
            handleReject={handleReject}
            onClose={() => setSelectedAsset(null)}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            latestLogData={latestLogData}
          />
        )}
      </div>
    </React.Fragment>
  );
};

const SearchRequests: FC<{
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}> = function ({ setSearchQuery }) {
  const [showInfo, setShowInfo] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <form className="mb-4 sm:mb-0 sm:pr-3 relative " action="#" method="GET">
      <Label htmlFor="search-request" className="sr-only font-display">
        Search
      </Label>
      <div className="relative mt-1 lg:w-64 xl:w-96 ">
        <TextInput
          id="search-request"
          name="search-request"
          placeholder="Search for requests"
          onChange={handleSearchChange}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {showInfo && (
            <div className="absolute top-0 right-full w-max bg-gray-700 rounded-lg shadow-lg">
              <p className="text-white text-xs">
                Works with a few fields only,
                <br />
                will expand in future.
                <ol></ol>
              </p>
            </div>
          )}
          <InfoIcon
            className="h-5 w-5 text-gray-400 cursor-pointer"
            aria-hidden="true"
            onMouseEnter={() => setShowInfo(true)}
            onMouseLeave={() => setShowInfo(false)}
          />
        </div>
      </div>
    </form>
  );
};

const RequestTable: FC<{
  assets: any[];
  setSelectedAsset: (asset: any | null) => void;
  setLatestLogData: (data: any | null) => void;
  sortBy: string;
  setSortBy: (data: any | null) => void;
  sortOrder: string;
  setSortOrder: (data: any | null) => void;
}> = function ({ assets, setSelectedAsset, setLatestLogData, sortBy, setSortBy, sortOrder, setSortOrder }) {
  const handleViewAsset = async (asset: any) => {
    try {
      const response = await axiosInstance.get(
        `/asset/asset_logs/${asset.asset_uuid}?recency=latest`
      );
      setLatestLogData(response.data.data);
    } catch (error) {
      console.error("Error fetching asset details:", error);
    }
    setSelectedAsset(asset);
  };

  return (
    <Table className="w-full divide-y font-display divide-gray-200 dark:divide-gray-600 mx-2 my-2 rounded-lg">
      <Table.Head className="bg-gray-100 dark:bg-gray-700">
        <Table.HeadCell>Asset Type</Table.HeadCell>
        <Table.HeadCell>Product Name</Table.HeadCell>
        <Table.HeadCell>Requester</Table.HeadCell>
        <Table.HeadCell>Custodian</Table.HeadCell>
        <Table.HeadCell>
          <span
            onClick={() => {
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
            }}
            className="ml-2 bg-transparent cursor-pointer"
          >
            Modified at {sortOrder === "asc" ? "↓" : "↑"}
          </span>
        </Table.HeadCell>
        <Table.HeadCell>Actions</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800 font-display">
        {assets.map((asset) => (
          <Table.Row
            key={asset.asset_uuid}
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
              <div className="text-base font-normal text-gray-900 dark:text-white">
                {asset.asset_type.asset_type_name}
              </div>
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
              {asset.product_name}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-base font-display font-md text-left text-gray-900 dark:text-white">
              {asset.requester.username}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-base font-display font-md text-left text-gray-900 dark:text-white">
              {asset.custodian?.employee_name}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-base font-display font-xs text-gray-900 dark:text-white">
              {new Date(asset.updated_at).toLocaleDateString()}
            </Table.Cell>
            <Table.Cell className="space-x-2 whitespace-nowrap p-4">
              <div className="flex items-center gap-x-3">
                <button
                  className="rounded-lg text-white w-20 h-10 ml-2 "
                  onClick={() => handleViewAsset(asset)}
                >
                  View
                </button>
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

const ViewRequestModal: FC<{
  loading: boolean;
  asset: any;
  handleApprove: () => void;
  handleReject: () => void;
  modalOpen: boolean;
  setModalOpen: (flag: boolean) => void;
  onClose: () => void;
  latestLogData: any;
}> = function ({
  loading,
  modalOpen,
  setModalOpen,
  asset,
  handleApprove,
  handleReject,
  onClose,
  latestLogData,
}) {
    const [notes, setNotes] = useState(asset.notes);
    const [approverNotes, setApproverNotes] = useState(
      asset.approval_status_message
    );

    const [actionType, setActionType] = useState("");

    const toggleModal = (type: string) => {
      setActionType(type);
      setModalOpen(!modalOpen);
    };

    const handleNotesChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      setNotes(e.target.value);
    };

    const handleApproverNotesChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      setApproverNotes(e.target.value);
      asset.approverNotes = e.target.value;
    };

    const formFields = [
      {
        id: "asset_id",
        label: "ASSET ID",
        name: "assetId",
        value: asset.asset_id,
        disabled: true,
      },
      {
        id: "product_name",
        label: "PRODUCT NAME",
        name: "productName",
        value: asset.product_name,
        disabled: true,
      },
      {
        id: "serial_number",
        label: "SERIAL NUMBER",
        name: "serialNumber",
        value: asset?.serial_number,
        disabled: true,
      },
      {
        id: "location",
        label: "LOCATION",
        name: "location",
        value: asset.location?.location_name,
        disabled: true,
      },
      {
        id: "invoice_location",
        label: "INV.LOCATION",
        name: "invoiceLocation",
        value: asset.invoice_location?.location_name,
        disabled: true,
      },
      {
        id: "asset_type",
        label: "ASSET TYPE",
        name: "assetType",
        value: asset.asset_type?.asset_type_name,
        disabled: true,
      },
      {
        id: "asset_category",
        label: "CATEGORY",
        name: "assetCategory",
        value: asset.asset_category,
        disabled: true,
      },
      {
        id: "business_unit",
        label: "BUSINESS UNIT",
        name: "businessUnit",
        value: asset.business_unit?.business_unit_name,
        disabled: true,
      },
      {
        id: "os",
        label: "OS",
        name: "os",
        value: asset?.os,
        disabled: true,
      },
      {
        id: "os_version",
        label: "OS VERSION",
        name: "os_version",
        value: asset?.os_version,
        disabled: true,
      },
      {
        id: "mobile_os",
        label: "MOBILE OS",
        name: "mobile_os",
        value: asset?.mobile_os,
        disabled: true,
      },
      {
        id: "processor",
        label: "PROCESSOR",
        name: "processor",
        value: asset?.processor,
        disabled: true,
      },
      {
        id: "processor_gen",
        label: "PROCESSOR GEN",
        name: "p_gen",
        value: asset?.processor_gen,
        disabled: true,
      },
      {
        id: "model_number",
        label: "MODEL NUMBER",
        name: "modelNumber",
        value: asset?.model_number,
        disabled: true,
      },
      {
        id: "memory",
        label: "MEMORY",
        name: "memory",
        value: asset.memory?.memory_space,
        disabled: true,
      },
      {
        id: "storage",
        label: "STORAGE",
        name: "storage",
        value: asset?.storage,
        disabled: true,
      },
      {
        id: "license_type",
        label: "LICENSE TYPE",
        name: "license_type",
        value: asset?.license_type,
        disabled: true,
      },
      {
        id: "date_of_purchase",
        label: "D.O.P",
        name: "dop",
        value: asset?.date_of_purchase,
        disabled: true,
      },
      {
        id: "warranty_period",
        label: "WARRANTY",
        name: "warranty_period",
        value: asset?.warranty_period,
        disabled: true,
      },
      {
        id: "owner",
        label: "OWNER",
        name: "owner",
        value: asset?.owner,
        disabled: true,
      },
      {
        id: "requester",
        label: "REQUESTER",
        name: "requester_username",
        value: asset?.requester.username,
        disabled: true,
      },
      {
        id: "status",
        label: "STATUS",
        name: "status",
        value: asset?.status,
        disabled: true,
      },
      {
        id: "accessories",
        label: "ACCESSORIES",
        name: "accessories",
        value: asset?.accessories,
        disabled: true,
      },
      {
        id: "configuration",
        label: "CONFIGURATION",
        name: "configuration",
        value: asset?.configuration,
        disabled: true,
      },
    ];

    return (
      <DrawerViewRequest title="Request Details" onClose={onClose} open={true}>
        {loading && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 100000
          }}>
            <Spin size="large" />
          </div>
        )}
        <div>
          <form>
            <div className="grid font-display grid-cols-2 gap-3 lg:grid-cols-5 my-3 text-sm">
              {formFields.map((field, index) => {
                // const latestLog = latestLogData?.logs[0]?.asset_log;
                const latestLog = (latestLogData?.logs && latestLogData.logs.length > 0)
                  ? latestLogData.logs[0].asset_log
                  : null;
                console.log(latestLogData)
                let changed = false;
                if (latestLog && latestLog.hasOwnProperty(field.id)) {
                  changed = field.value != latestLog[field.id];
                } else {
                  // changed =
                  //   field.value !== undefined &&
                  //   field.value !== null &&
                  //   field.value !== "";
                }
                return (
                  <div key={index}>
                    <Label
                      htmlFor={field.id}
                      className={changed ? "text-blue-500" : "text-white"}
                    >
                      {field.label}:
                    </Label>
                    {changed && (
                      <CustomTooltip
                        title={
                          <>
                            Previous value: {latestLog ? latestLog[field.id] : "N/A"}
                            <br />
                            New value: {field.value}
                          </>
                        }
                      >
                        <TextInput
                          id={field.id}
                          name={field.name}
                          value={field.value}
                          disabled={field.disabled}
                          style={{
                            background: "transparent",
                            color: "white",
                            cursor: "default"
                          }}
                          className="mt-1 font-display border-blue-600 border-2 rounded-lg"
                        />
                      </CustomTooltip>
                    )}
                    {!changed && (
                      <TextInput
                        id={field.id}
                        name={field.name}
                        value={field.value}
                        disabled={field.disabled}
                        style={{
                          background: "transparent",
                          color: "white",
                          cursor: "default"
                        }}
                        className="mt-1 text-white font-display"
                      />
                    )}
                  </div>
                );
              })}
              <div className="lg:col-span-5">
                <Label className="text-white" htmlFor="notes">NOTES</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  rows={1}
                  value={notes}
                  disabled={true}
                  onChange={handleNotesChange}
                  style={{
                    cursor: "default"
                  }}
                  className="mt-1 text-white bg-custom-400 h-24"
                />
              </div>
              <div className="lg:col-span-5">
                <Label className="text-white" htmlFor="approverNotes">APPROVER NOTES</Label>
                <Textarea
                  id="approverNotes"
                  name="approverNotes"
                  rows={1}
                  value={approverNotes}
                  onChange={handleApproverNotesChange}
                  className="mt-1 text-white bg-custom-400 h-24"
                  autoFocus
                />
              </div>
            </div>
          </form>
        </div>
        <div className="flex gap-2 my-4">
          <button
            className="block font-display text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-3 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            onClick={() => toggleModal("approve")}
          >
            Approve
          </button>

          <button
            className="block font-display text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-6 py-3 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
            onClick={() => toggleModal("reject")}
          >
            Reject
          </button>

          {modalOpen && (
            <div
              id="popup-modal"
              className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-screen bg-black bg-opacity-50"
            >
              <div className="bg-custom-500 rounded-lg p-4 md:p-5 text-center">
                <svg
                  className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Are you sure you want to {actionType}?
                </h3>
                {actionType === "approve" ? (
                  <button
                    onClick={handleApprove}
                    className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                  >
                    Yes, I'm sure
                  </button>
                ) : (
                  <button
                    onClick={handleReject}
                    className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                  >
                    Yes, I'm sure
                  </button>
                )}
                <button
                  onClick={() => setModalOpen(false)}
                  className="py-2.5 px-5 ms-3 text-sm font-display font-medium text-white focus:outline-none bg-red-700 rounded-lg hover:bg-red-900 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </DrawerViewRequest>
    );
  };

export default ModificationRequests;
