import { FC, useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Label,
  Modal,
  Table,
  Textarea,
  TextInput,
} from "flowbite-react";
import { HiHome, HiPencilAlt } from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import axiosInstance from "../../config/AxiosConfig";
import React from "react";

const RequestPage: FC = function () {
  const [assets, setAssets] = useState<any[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = () => {
    setLoading(true);
    axiosInstance
      .get("/asset/?limit=10&asset_detail_status=CREATE_PENDING")
      .then((response) => {
        setAssets(response.data.data.results);
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
      setAssets(
        assets.filter((asset) => asset.asset_uuid !== selectedAsset.asset_uuid)
      );
      setSelectedAsset(null);
    }
  };

  return (
    <React.Fragment>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3 rtl:space-x-reverse">
              <li className="inline-flex items-center">
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
                  <a href="#" className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">Pending Asset Requests</a>
                </div>
              </li>
              {/* <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-gray-400 mx-1 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                  </svg>
                  <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">Flowbite</span>
                </div>
              </li> */}
            </ol>
          </nav>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
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
            <div className="inline-block min-w-full align-middle mx-2 my-2">
              <div className="overflow-hidden shadow">
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
    </React.Fragment>
  );
};

const SearchRequests: FC = function () {
  return (
    <form className="mb-4 sm:mb-0 sm:pr-3" action="#" method="GET">
      <Label htmlFor="search-request" className="sr-only">
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

const RequestTable: FC<{
  assets: any[];
  setSelectedAsset: (asset: any | null) => void;
}> = function ({ assets, setSelectedAsset }) {
  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <Table.Head className="bg-gray-100 dark:bg-gray-700">
        <Table.HeadCell>Request type</Table.HeadCell>
        <Table.HeadCell>Requester</Table.HeadCell>
        <Table.HeadCell>Request Date</Table.HeadCell>
        <Table.HeadCell>Actions</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
        {assets.map((asset) => (
          <Table.Row
            key={asset.asset_uuid}
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
              <div className="text-base font-semibold text-gray-900 dark:text-white">
                {asset.asset_detail_status === "CREATE_PENDING"
                  ? "CREATION APPROVAL"
                  : asset.asset_detail_status === "UPDATE_PENDING"
                  ? "UPDATION APPROVAL"
                  : asset.asset_detail_status}
              </div>
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-base font-medium  text-left text-gray-900 dark:text-white">
              {asset.requester.username}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
              {new Date(asset.created_at).toLocaleDateString()}
            </Table.Cell>
            <Table.Cell className="space-x-2 whitespace-nowrap p-4">
              <div className="flex items-center gap-x-3">
                <Button color="primary" onClick={() => setSelectedAsset(asset)}>
                  <HiPencilAlt className="mr-2 text-lg" />
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

const ViewRequestModal: FC<{
  asset: any;
  handleApprove: () => void;
  handleReject: () => void;
  onClose: () => void;
}> = function ({ asset, handleApprove, handleReject, onClose }) {
  const [comments, setComments] = useState("");

  return (
    <Modal onClose={onClose} show={true}>
      <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
        <strong>Request Details</strong>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <Label htmlFor="assetId">ASSET ID</Label>
              <TextInput
                id="assetId"
                name="assetId"
                value={asset.asset_id}
                disabled
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="assetCategory">ASSET CATEGORY</Label>
              <TextInput
                id="assetCategory"
                name="assetCategory"
                value={asset.asset_category}
                disabled
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="productName">PRODUCT NAME</Label>
              <TextInput
                id="productName"
                name="productName"
                value={asset.product_name}
                disabled
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="serialNumber">SERIAL NUMBER</Label>
              <TextInput
                id="serialNumber"
                name="serialNumber"
                value={asset.serial_number}
                disabled
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="modelNumber">MODEL NUMBER</Label>
              <TextInput
                id="modelNumber"
                name="modelNumber"
                value={asset.model_number}
                disabled
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="status">STATUS</Label>
              <TextInput
                id="status"
                name="status"
                value={asset.status}
                disabled
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="warrantyPeriod">WARRANTY PERIOD</Label>
              <TextInput
                id="warrantyPeriod"
                name="warrantyPeriod"
                value={asset.warranty_period}
                disabled
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="dateOfPurchase">DATE OF PURCHASE</Label>
              <TextInput
                id="dateOfPurchase"
                name="dateOfPurchase"
                value={asset.date_of_purchase}
                disabled
                className="mt-1"
              />
            </div>
            <div className="lg:col-span-2">
              <Label htmlFor="approverNotes">APPROVER NOTES</Label>
              <Textarea
                id="approverNotes"
                name="approverNotes"
                rows={1}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button color="success" onClick={handleApprove}>
          Approve
        </Button>
        <Button color="failure" onClick={handleReject}>
          Reject
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RequestPage;
