import { FC, useEffect, useState } from "react";
import {
  Button,
  Label,
  Table,
  Textarea,
  TextInput,
} from "flowbite-react";
import { HiPencilAlt } from "react-icons/hi";
import axiosInstance from "../../config/AxiosConfig";
import React from "react";
import DrawerViewRequest from "./DrawerViewRequest";


const RequestPage: FC = function () {
  const [assets, setAssets] = useState<any[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = () => {
    setLoading(true);
    Promise.all([
      axiosInstance.get("/asset/?limit=10&asset_detail_status=CREATE_PENDING"),
      axiosInstance.get("/asset/?limit=10&asset_detail_status=UPDATE_PENDING")
    ])
      .then((responses) => {
        const createPendingAssets = responses[0].data.data.results;
        const updatePendingAssets = responses[1].data.data.results;

        const mergedAssets = [...createPendingAssets, ...updatePendingAssets];
        setAssets(mergedAssets);
      })
      .catch((error) => {
        console.error("Error fetching assets:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleApprove = () => {
    if (selectedAsset) {
      const approvalData = {
        approval_type: "ASSET_DETAIL_STATUS",
        asset_uuid: selectedAsset.asset_uuid,
        comments: selectedAsset.approverNotes,
      };

      axiosInstance
        .post("/asset/approve_asset", approvalData)
        .then(() => {
          fetchAssets();
          setSelectedAsset(null);
        })
        .catch((error) => {
          console.error("Error approving asset:", error);
        });
    }
  };

  const handleReject = () => {
    if (selectedAsset) {
      const rejectedData = {
        data: {
          approval_type: "ASSET_DETAIL_STATUS",
          asset_uuid: selectedAsset.asset_uuid,
          comments: selectedAsset.approverNotes,
        }
      };
  
      axiosInstance
        .delete("/asset/approve_asset", rejectedData)
        .then(() => {
          fetchAssets();
          setSelectedAsset(null);
        })
        .catch((error) => {
          console.error("Error rejecting asset:", error);
        });
    }
  };
  
  return (
    <React.Fragment>
      <div className="bg-white">
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 rtl:space-x-reverse">
            <li className="inline-flex items-center font-display">
              <a href="#" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                </svg>
                  Dashboard
                </a>
              </li>
              <li>
            <div className="flex items-center">
              <svg className="w-3 h-3 text-gray-400 mx-1 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
              </svg>
                <a href="#" className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white font-display">Pending Asset Requests</a>
              </div>
            </li>
          </ol>
        </nav>
        <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex mx-2 my-2">
          <div className="mb-1 w-full">
            <div className="mb-4">              
              <h1 className="text-xl font-display font-semibold text-gray-900 dark:text-white sm:text-2xl">
                Pending Asset Requests
              </h1>
            </div>
            <div className="block items-center sm:flex">
              <SearchRequests />
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
              <div className="inline-block w-full align-middle mx-2">
                <div className="overflow-hidden">
                  <RequestTable
                    assets={assets}
                    setSelectedAsset={setSelectedAsset}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        {selectedAsset && (
          <ViewRequestModal
            asset={selectedAsset}
            handleApprove={handleApprove}
            handleReject={handleReject}
            onClose={() => setSelectedAsset(null)}
          />
        )}
      </div>      
    </React.Fragment>
  );
};

const SearchRequests: FC = function () {
  return (
    <form className="mb-4 sm:mb-0 sm:pr-3" action="#" method="GET">
      <Label htmlFor="search-request" className="sr-only font-display">
        Search
      </Label>
      <div className="relative mt-1 lg:w-64 xl:w-96">
        <TextInput
          id="search-request"
          name="search-request"
          placeholder="Search for requests"
        />
      </div>
    </form>
  );
};

const RequestTable: FC<{ assets: any[]; setSelectedAsset: (asset: any | null) => void;}> = function ({ assets, setSelectedAsset }) {
  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600 rounded-md">
      <Table.Head className="bg-gray-100 dark:bg-gray-700 font-display">
        <Table.HeadCell>Request type</Table.HeadCell>
        <Table.HeadCell>Requester</Table.HeadCell>
        <Table.HeadCell>Request Date</Table.HeadCell>
        <Table.HeadCell>Actions</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800 font-display">
        {assets.map((asset) => (
          <Table.Row
            key={asset.asset_uuid}
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
              <div className="text-base font-medium text-gray-900 dark:text-white">
                {asset.asset_detail_status === "CREATE_PENDING"
                  ? "Asset Approval"
                  : asset.asset_detail_status === "UPDATE_PENDING"
                  ? "Asset Update  Approval"
                  : asset.asset_detail_status}
              </div>
              <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                {asset.asset_type.asset_type_name}
              </div>
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-base font-display font-md text-left text-gray-900 dark:text-white">
              {asset.requester.username}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-base font-display font-xs text-gray-900 dark:text-white">
              {new Date(asset.created_at).toLocaleDateString()}
            </Table.Cell>
            <Table.Cell className="space-x-2 whitespace-nowrap p-4">
              <div className="flex items-center gap-x-3">
                <Button color="primary" onClick={() => setSelectedAsset(asset)}>
                  <HiPencilAlt className="mr-2 text-lg font-display" />
                  View 
                </Button>
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

const ViewRequestModal: FC<{ asset: any; handleApprove: () => void; handleReject: () => void; onClose: () => void;}> = function ({ asset, handleApprove, handleReject, onClose }) {

  const [comments, setComments] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState("");

  const toggleModal = (type: string) => {
    setActionType(type);
    setModalOpen(!modalOpen);
  };

  const formFields = [
    {
      id: "assetId",
      label: "ASSET ID",
      name: "assetId",
      value: asset.asset_id,
      disabled: true
    },
    {
      id: "version",
      label: "VERSION",
      name: "version",
      value: asset.version,
      disabled: true
    },
    {
      id: "assetCategory",
      label: "CATEGORY",
      name: "assetCategory",
      value: asset.asset_category,
      disabled: true
    },
    {
      id: "productName",
      label: "PRODUCT NAME",
      name: "productName",
      value: asset.product_name,
      disabled: true
    },
    {
      id: "modelNumber",
      label: "MODEL NUMBER",
      name: "modelNumber",
      value: asset.model_number,
      disabled: true
    },
    {
      id: "serialNumber",
      label: "SERIAL NUMBER",
      name: "serialNumber",
      value: asset.serial_number,
      disabled: true
    },
    {
      id: "owner",
      label: "OWNER",
      name: "owner",
      value: asset.owner,
      disabled: true
    },
    {
      id: "dop",
      label: "D.O.P",
      name: "dop",
      value: asset.date_of_purchase,
      disabled: true
    },
    {
      id: "warranty_period",
      label: "WARRANTY",
      name: "warranty_period",
      value: asset.warranty_period,
      disabled: true
    },
    {
      id: "os",
      label: "OS",
      name: "os",
      value: asset.os,
      disabled: true
    },
    {
      id: "os_version",
      label: "OS VERSION",
      name: "os_version",
      value: asset.os_version,
      disabled: true
    },
    {
      id: "mobile_os",
      label: "MOBILE OS",
      name: "mobile_os",
      value: asset.mobile_os,
      disabled: true
    },
    {
      id: "processor",
      label: "PROCESSOR",
      name: "processor",
      value: asset.processor,
      disabled: true
    },
    {
      id: "p_gen",
      label: "PROCESSOR GEN",
      name: "p_gen",
      value: asset.processor_gen,
      disabled: true
    },
    {
      id: "storage",
      label: "STORAGE",
      name: "storage",
      value: asset.storage,
      disabled: true
    },
    {
      id: "configuration",
      label: "CONFIGURATION",
      name: "configuration",
      value: asset.configuration,
      disabled: true
    },
    {
      id: "accessories",
      label: "ACCESSORIES",
      name: "accessories",
      value: asset.accessories,
      disabled: true
    },
    {
      id: "location",
      label: "LOCATION",
      name: "location",
      value: asset.location.location_name,
      disabled: true
    },
    {
      id: "invoice_location",
      label: "INV.LOCATION",
      name: "invoice_location",
      value: asset.location.location_name,
      disabled: true
    },
    {
      id: "business_unit",
      label: "BUSINESS UNIT",
      name: "business_unit",
      value: asset.business_unit.business_unit_name,
      disabled: true
    },
  ];

  return (
    <DrawerViewRequest title="Request Details" onClose={onClose} visible={true}>
      <div>
      <form>
        <div className="grid font-display grid-cols-2 gap-3 lg:grid-cols-5 my-3 text-sm">
          {formFields.map((field, index) => (
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
              value={asset.notes}
              className="mt-1"
            />
          </div>
          <div className="lg:col-span-5">
            <Label htmlFor="approverNotes">APPROVER NOTES</Label>
            <Textarea
              id="approverNotes"
              name="approverNotes"
              rows={1}
              value={asset.approval_status_message}
              onChange={(e) => setComments(e.target.value)}
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
          className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
        >
          Yes, I'm sure
        </button>
      )}
      <button
        onClick={() => setModalOpen(false)}
        className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-red-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
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

export default RequestPage;


