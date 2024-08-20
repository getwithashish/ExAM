import { FC, useEffect, useState } from "react";
import { Label, Table, Textarea, TextInput } from "flowbite-react";
import axiosInstance from "../../config/AxiosConfig";
import React from "react";
import DrawerViewRequest from "./DrawerViewRequest";
import { ChangeEvent } from "react";
import { ConfigProvider, Pagination, Spin, message, theme } from "antd";
import InfoIcon from "@mui/icons-material/Info";
import { RefreshTwoTone } from "@mui/icons-material";

const AssignPage: FC = function () {
  const [assignRequests, setAssignRequests] = useState<any[]>([]);
  const [selectedAssignRequest, setSelectedAssignRequest] = useState<
    any | null
  >(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [approverNotes, setApproverNotes] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchAssignRequests();
  }, [currentPage, pageSize, searchQuery]);

  const handleApproverNotesChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setApproverNotes(e.target.value);
  };

  const fetchAssignRequests = () => {
    setLoading(true);
    const offset = (currentPage - 1) * pageSize;
    const searchQueryParam = searchQuery ? `&global_search=${searchQuery}` : "";
    axiosInstance
      .get(
        `/asset/?limit=${pageSize}&offset=${offset}&assign_status=ASSIGN_PENDING${searchQueryParam}`
      )
      .then((response) => {
        const assignPendingAssets = response.data.data.results;
        const totalAssets = response.data.data.count;
        setAssignRequests(assignPendingAssets);
        setTotalPages(Math.ceil(totalAssets / 10));
      })
      .catch((error) => {
        console.error("Error fetching assign requests:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleApprove = () => {
    setLoading(true);
    setModalOpen(false);
    if (selectedAssignRequest) {
      const approvalData = {
        approval_type: "ASSIGN_STATUS",
        asset_uuid: selectedAssignRequest.asset_uuid,
        comments: approverNotes,
      };

      axiosInstance
        .post("/asset/approve_asset", approvalData)
        .then(() => {
          fetchAssignRequests();
          setSelectedAssignRequest(null);
        })
        .catch((error) => {
          message.error("Error Allocating Asset");
          console.error("Error allocating asset:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleReject = () => {
    setLoading(true);
    setModalOpen(false);
    if (selectedAssignRequest) {
      const rejectedData = {
        data: {
          approval_type: "ASSIGN_STATUS",
          asset_uuid: selectedAssignRequest.asset_uuid,
          comments: approverNotes,
        },
      };

      axiosInstance
        .delete("/asset/approve_asset", rejectedData)
        .then(() => {
          fetchAssignRequests();
          setSelectedAssignRequest(null);
        })
        .catch((error) => {
          message.error("Error Rejecting Asset Allocation");
          console.error("Error rejecting asset allocation:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const filteredAssigns = assignRequests.filter(
    (assignRequest) =>
      assignRequest.asset_type?.asset_type_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      String(assignRequest.version)
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      assignRequest.asset_category
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      assignRequest.product_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      assignRequest.model_number
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      assignRequest.serial_number
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      assignRequest.owner?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(assignRequest.date_of_purchase)
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      String(assignRequest.warranty_period)
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      assignRequest.os?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignRequest.os_version
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      assignRequest.mobile_os
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      assignRequest.processor
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      assignRequest.processor_gen
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      assignRequest.storage
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      assignRequest.configuration
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      assignRequest.accessories
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      assignRequest.location.location_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      assignRequest.business_unit.business_unit_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      assignRequest.requester?.username
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      assignRequest.approved_by?.username
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      assignRequest.custodian?.employee_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const onShowSizeChange = (_: number, size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleRefreshClick = () => {
    fetchAssignRequests();
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
            <div className="m-2 flex">
              <div className="flex-1">
                <h1 className="font-medium font-display m-3 leading-none text-white text-xl">
                  Allocation Requests
                </h1>
              </div>
              <div className="flex-2">
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
            </div>
            <div className="block items-center sm:flex">
              <SearchRequests setSearchQuery={setSearchQuery} />
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <p>Loading...</p>
              </div>
            ) : (
              <div className="inline-block w-full align-middle">
                <div className="overflow-hidden shadow-2xl mx-2 rounded-lg bg-custom-400">
                  <AssignRequestTable
                    assignRequests={filteredAssigns}
                    setSelectedAssignRequest={setSelectedAssignRequest}
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
        {selectedAssignRequest && (
          <ViewRequestModal
            loading={loading}
            assignRequest={selectedAssignRequest}
            handleApprove={handleApprove}
            handleReject={handleReject}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            onClose={() => setSelectedAssignRequest(null)}
            handleApproverNotesChange={handleApproverNotesChange}
            approverNotes={""}
            setApproverNotes={function (
              _approval_status_message: string
            ): void {
              ("");
            }}
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
            <div className="absolute top-0 right-full w-max bg-gray-700 p-2 rounded-lg shadow-lg">
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

const AssignRequestTable: FC<{
  assignRequests: any[];
  setSelectedAssignRequest: (assignRequest: any | null) => void;
}> = function ({ assignRequests, setSelectedAssignRequest }) {
  return (
    <Table className="min-w-full divide-y font-display divide-gray-200 dark:divide-gray-600 rounded-xl">
      <Table.Head className="bg-gray-100 dark:bg-gray-700">
        <Table.HeadCell>Asset</Table.HeadCell>
        <Table.HeadCell>Requester</Table.HeadCell>
        <Table.HeadCell>Custodian</Table.HeadCell>
        <Table.HeadCell>Request Date</Table.HeadCell>
        <Table.HeadCell>Actions</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
        {assignRequests.map((assignRequest) => (
          <Table.Row
            key={assignRequest.asset_uuid}
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
              <div className="text-base font-normal text-gray-900 dark:text-white">
                {assignRequest.asset_type.asset_type_name}
              </div>
              <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                {assignRequest.product_name}
              </div>
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-base font-md text-gray-900 dark:text-white">
              {assignRequest.requester.username}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-base font-sm text-gray-900 dark:text-white">
              {assignRequest.custodian?.employee_name}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-base font-sm text-gray-900 dark:text-white">
              {new Date(assignRequest.created_at).toLocaleDateString()}
            </Table.Cell>
            <Table.Cell className="space-x-2 whitespace-nowrap p-4">
              <div className="flex items-center gap-x-3">
                <button
                  className="rounded-lg text-white w-20 h-10 ml-2 "
                  onClick={() => setSelectedAssignRequest(assignRequest)}
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

const ViewRequestModal: FC<{
  loading: boolean;
  assignRequest: any;
  handleApprove: () => void;
  handleReject: () => void;
  onClose: () => void;
  modalOpen: boolean;
  setModalOpen: (flag: boolean) => void;
  approverNotes: string;
  setApproverNotes: (approval_status_message: string) => void;
  handleApproverNotesChange: any;
}> = function ({
  loading,
  modalOpen,
  setModalOpen,
  assignRequest,
  handleApprove,
  handleReject,
  onClose,
  approverNotes,
  handleApproverNotesChange,
}) {
  const [notes, setNotes] = useState(assignRequest.notes);
  const [actionType, setActionType] = useState("");

  const toggleModal = (type: string) => {
    setActionType(type);
    setModalOpen(!modalOpen);
  };

  const handleNotesChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  const assignRequestFields = [
    {
      id: "asset_id",
      label: "ASSET ID",
      name: "assetId",
      value: assignRequest.asset_id,
      disabled: true,
    },
    {
      id: "product_name",
      label: "PRODUCT NAME",
      name: "productName",
      value: assignRequest.product_name,
      disabled: true,
    },
    {
      id: "assignee",
      label: "CUSTODIAN",
      name: "assignee",
      value: assignRequest.custodian?.employee_name,
      disabled: true,
    },
    {
      id: "serial_number",
      label: "SERIAL NUMBER",
      name: "serialNumber",
      value: assignRequest?.serial_number,
      disabled: true,
    },
    {
      id: "location",
      label: "LOCATION",
      name: "location",
      value: assignRequest.location?.location_name,
      disabled: true,
    },
    {
      id: "invoice_location",
      label: "INV.LOCATION",
      name: "invoiceLocation",
      value: assignRequest.invoice_location?.location_name,
      disabled: true,
    },
    {
      id: "asset_type",
      label: "ASSET TYPE",
      name: "assetType",
      value: assignRequest.asset_type?.asset_type_name,
      disabled: true,
    },
    {
      id: "asset_category",
      label: "CATEGORY",
      name: "assetCategory",
      value: assignRequest.asset_category,
      disabled: true,
    },
    {
      id: "business_unit",
      label: "BUSINESS UNIT",
      name: "businessUnit",
      value: assignRequest.business_unit?.business_unit_name,
      disabled: true,
    },
    {
      id: "version",
      label: "VERSION",
      name: "version",
      value: assignRequest.version,
      disabled: true,
    },
    {
      id: "os",
      label: "OS",
      name: "os",
      value: assignRequest?.os,
      disabled: true,
    },
    {
      id: "os_version",
      label: "OS VERSION",
      name: "os_version",
      value: assignRequest?.os_version,
      disabled: true,
    },
    {
      id: "mobile_os",
      label: "MOBILE OS",
      name: "mobile_os",
      value: assignRequest?.mobile_os,
      disabled: true,
    },
    {
      id: "processor",
      label: "PROCESSOR",
      name: "processor",
      value: assignRequest?.processor,
      disabled: true,
    },
    {
      id: "processor_gen",
      label: "PROCESSOR GEN",
      name: "p_gen",
      value: assignRequest?.processor_gen,
      disabled: true,
    },
    {
      id: "model_number",
      label: "MODEL NUMBER",
      name: "modelNumber",
      value: assignRequest?.model_number,
      disabled: true,
    },
    {
      id: "memory",
      label: "MEMORY",
      name: "memory",
      value: assignRequest.memory?.memory_space,
      disabled: true,
    },
    {
      id: "storage",
      label: "STORAGE",
      name: "storage",
      value: assignRequest?.storage,
      disabled: true,
    },
    {
      id: "license_type",
      label: "LICENSE TYPE",
      name: "license_type",
      value: assignRequest?.license_type,
      disabled: true,
    },
    {
      id: "date_of_purchase",
      label: "D.O.P",
      name: "dop",
      value: assignRequest?.date_of_purchase,
      disabled: true,
    },
    {
      id: "warranty_period",
      label: "WARRANTY",
      name: "warranty_period",
      value: assignRequest?.warranty_period,
      disabled: true,
    },
    {
      id: "owner",
      label: "OWNER",
      name: "owner",
      value: assignRequest?.owner,
      disabled: true,
    },
    {
      id: "requester",
      label: "REQUESTER",
      name: "requester_username",
      value: assignRequest?.requester.username,
      disabled: true,
    },
    {
      id: "status",
      label: "STATUS",
      name: "status",
      value: assignRequest?.status,
      disabled: true,
    },  
    {
      id: "accessories",
      label: "ACCESSORIES",
      name: "accessories",
      value: assignRequest?.accessories,
      disabled: true,
    },    
    {
      id: "configuration",
      label: "CONFIGURATION",
      name: "configuration",
      value: assignRequest?.configuration,
      disabled: true,
    },     
  ];

  return (
    <div>
      <nav className="flex mb-4 mx-4 my-0 py-4" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3 rtl:space-x-reverse">
          <li className="inline-flex items-center font-display">
            <a
              href="#"
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
            >
              <svg
                className="w-3 h-3 me-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
              </svg>
              Dashboard
            </a>
          </li>
          <li>
            <div className="flex items-center">
              <svg
                className="w-3 h-3 text-gray-400 mx-1 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <a
                href="#"
                className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white font-display"
              >
                Approve Assets
              </a>
            </div>
          </li>
        </ol>
      </nav>
      <DrawerViewRequest
        title="Assign Details"
        onClose={onClose}
        open={true}
        selectedRow={undefined}
        drawerTitle={""}
        onUpdateData={function (_updatedData: { key: any }): void {
          throw new Error("Function not implemented.");
        }}
      >
        <Spin spinning={loading}>
          <div>
            <form>
              <div className="grid font-display grid-cols-2 gap-3 lg:grid-cols-5 my-3 text-sm">
                {assignRequestFields.map((field, index) => (
                  <div key={index}>
                    <Label htmlFor={field.id}>{field.label}</Label>
                    <TextInput
                      id={field.id}
                      name={field.name}
                      value={field.value}
                      disabled={field.disabled}
                      className="mt-1 font-display"
                    />
                  </div>
                ))}
                <div className="lg:col-span-5">
                  <Label htmlFor="notes">NOTES</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    rows={1}
                    value={notes}
                    onChange={handleNotesChange}
                    className="mt-1"
                  />
                </div>
                <div className="lg:col-span-5">
                  <Label htmlFor="approverNotes">APPROVER NOTES</Label>
                  <Textarea
                    id="approval_status_message"
                    name="approval_status_message"
                    rows={1}
                    value={approverNotes}
                    onChange={handleApproverNotesChange}
                    className="mt-1"
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
                <div className="bg-white rounded-lg p-4 md:p-5 text-center">
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
                  <h3 className="mb-5 text-lg font-display font-normal text-gray-500 dark:text-gray-400">
                    Are you sure you want to {actionType}?
                  </h3>
                  {actionType === "approve" ? (
                    <button
                      onClick={handleApprove}
                      className="text-white font-display bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                    >
                      Yes, I'm sure
                    </button>
                  ) : (
                    <button
                      onClick={handleReject}
                      className="text-white bg-red-600 font-display hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                    >
                      Yes, I'm sure
                    </button>
                  )}
                  <button
                    onClick={() => setModalOpen(false)}
                    className="py-2.5 px-5 ms-3 text-sm font-display font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-red-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </Spin>
      </DrawerViewRequest>
      ,
    </div>
  );
};

export default AssignPage;
