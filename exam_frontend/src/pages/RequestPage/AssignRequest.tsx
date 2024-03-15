import { FC, useEffect, useState } from 'react';
import {   
  Button,
  Label,
  Table,
  Textarea,
  TextInput,
} from "flowbite-react";
import { HiPencilAlt } from "react-icons/hi";
import axiosInstance from '../../config/AxiosConfig';
import React from 'react';
import DrawerViewRequest from "./DrawerViewRequest";


const AssignPage: FC = function () {
  const [assignRequests, setAssignRequests] = useState<any[]>([]);
  const [selectedAssignRequest, setSelectedAssignRequest] = useState<any | null >(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchAssignRequests();
  }, []);

  const fetchAssignRequests = () => {
    setLoading(true);
    axiosInstance.get('/asset/?limit=10&assign_status=ASSIGN_PENDING')
      .then(response => {
        console.log("hi")
        setAssignRequests(response.data.data.results);
        console.log(response.data.data.results);
      })
      .catch(error => {
        console.error('Error fetching assign requests:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleApprove = () => {
    if (selectedAssignRequest) {
      const approvalData = {
        approval_type: 'ASSIGN_STATUS',
        asset_uuid: selectedAssignRequest.asset_uuid,
        comments: selectedAssignRequest.approverNotes,
      }

      axiosInstance.post('/asset/approve_asset', approvalData)
        .then(() => {
          fetchAssignRequests();
          setSelectedAssignRequest(null)
        })
        .catch(error => {
          console.error('Error assigning asset:', error); 
        })
    }
  }
  
  const handleReject = () => {
    if (selectedAssignRequest){
      const rejectedData = {
        data:{
          approval_type: 'ASSIGN_STATUS',
          asset_uuid: selectedAssignRequest.asset_uuid,
          comments: selectedAssignRequest.approverNotes,
      }
    }

      axiosInstance
      .delete('/asset/approve_asset', rejectedData)
      .then(()=>{
        fetchAssignRequests();
        setSelectedAssignRequest(null)
      })
      .catch((error) =>{
        console.error('Error rejecting assigning asset:', error);
      })
    }
  }

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
                  <a href="#" className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">Pending Assign Requests</a>
                </div>
              </li>
            </ol>
          </nav>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              Pending Assign Requests
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
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow">
                <AssignRequestTable 
                  assignRequests={assignRequests} 
                  setSelectedAssignRequest={setSelectedAssignRequest} 
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {selectedAssignRequest && (
        <ViewRequestModal
          assignRequest={selectedAssignRequest}
          handleApprove={handleApprove} 
          handleReject={handleReject} 
          onClose={() => setSelectedAssignRequest(null)} 
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

const AssignRequestTable: FC<{ assignRequests: any[], setSelectedAssignRequest: (assignRequest: any | null)=>void }> = function ({ assignRequests, setSelectedAssignRequest }) {  
  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600 mx-2 my-2 rounded-lg">
      <Table.Head className="bg-gray-100 dark:bg-gray-700">
        <Table.HeadCell>Asset</Table.HeadCell>
        <Table.HeadCell>Requester</Table.HeadCell>
        <Table.HeadCell>Assignee</Table.HeadCell>
        <Table.HeadCell>Request Date</Table.HeadCell>
        <Table.HeadCell>Actions</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
        {assignRequests.map(assignRequest => (
          <Table.Row key={assignRequest.asset_uuid} className="hover:bg-gray-100 dark:hover:bg-gray-700">
            <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
              <div className="text-base font-semibold text-gray-900 dark:text-white">
                {assignRequest.asset_type.asset_type_name}
              </div>
              <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                {assignRequest.product_name}
              </div>
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
              {assignRequest.requester.username}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
              {assignRequest.custodian?.employee_name}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
              {new Date(assignRequest.created_at).toLocaleDateString()}
            </Table.Cell>
            <Table.Cell className="space-x-2 whitespace-nowrap p-4">
              <div className="flex items-center gap-x-3">
                <Button color="primary" onClick={() => setSelectedAssignRequest(assignRequest)}>
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

const ViewRequestModal: FC<{ assignRequest: any, handleApprove: () => void, handleReject: () => void, onClose: () => void }> = function ({ assignRequest, handleApprove, handleReject, onClose }) {
   
  const [comments, setComments] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState("");

  const toggleModal = (type: string) => {
    setActionType(type);
    setModalOpen(!modalOpen);
  };

  return (
    <DrawerViewRequest title="Assign Details" onClose={onClose} visible={true}>
      <div>
      <form>
        <div className="grid grid-cols-4 gap-1 lg:grid-cols-5 text-sm">
          <div>
            <Label htmlFor="assetId">ASSET ID</Label>
            <TextInput
              id="assetId"
              name="assetId"
              value={assignRequest.asset_id}
              disabled
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="version">VERSION</Label>
            <TextInput
              id="version"
              name="version"
              value={assignRequest.version}
              disabled
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="assetCategory">CATEGORY</Label>
            <TextInput
              id="assetCategory"
              name="assetCategory"
              value={assignRequest.asset_category}
              disabled
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="modelNumber">MODEL NUMBER</Label>
            <TextInput
              id="modelNumber"
              name="modelNumber"
              value={assignRequest.model_number}
              disabled
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="serialNumber">SERIAL NUMBER</Label>
            <TextInput
              id="serialNumber"
              name="serialNumber"
              value={assignRequest.serial_number}
              disabled
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="owner">OWNER</Label>
            <TextInput
              id="owner"
              name="owner"
              value={assignRequest.owner}
              disabled
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="dop">D.O.P</Label>
            <TextInput
              id="dop"
              name="dop"
              value={assignRequest.date_of_purchase}
              disabled
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="warranty_period">WARRANTY</Label>
            <TextInput
              id="warranty_period"
              name="warranty_period"
              value={assignRequest.warranty_period}
              disabled
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="os">OS</Label>
            <TextInput
              id="os"
              name="os"
              value={assignRequest.os}
              disabled
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="os_version">OS VERSION</Label>
            <TextInput
              id="os_version"
              name="os_version"
              value={assignRequest.os_version}
              disabled
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="mobile_os">MOBILE OS</Label>
            <TextInput
              id="mobile_os"
              name="mobile_os"
              value={assignRequest.mobile_os}
              disabled
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="processor">PROCESSOR</Label>
            <TextInput
              id="processor"
              name="processor"
              value={assignRequest.mobile_os}
              disabled
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="storage">STORAGE</Label>
            <TextInput
              id="storage"
              name="storage"
              value={assignRequest.storage}
              disabled
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="configuration">CONFIGURATION</Label>
            <TextInput
              id="configuration"
              name="configuration"
              value={assignRequest.configuration}
              disabled
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="accessories">ACCESSORIES</Label>
            <TextInput
              id="accessories"
              name="accessories"
              value={assignRequest.accessories}
              disabled
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="location">LOCATION</Label>
            <TextInput
              id="location"
              name="location"
              value={assignRequest.location.location_name}
              disabled
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="invoice_location">INV.LOCATION</Label>
            <TextInput
              id="invoice_location"
              name="invoice_location"
              value={assignRequest.location.location_name}
              disabled
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="business_unit">BUSINESS UNIT</Label>
            <TextInput
              id="business_unit"
              name="business_unit"
              value={assignRequest.business_unit.business_unit_name}
              disabled
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="assignee">ASSIGNEE</Label>
            <TextInput
              id="assignee"
              name="assignee"
              value={assignRequest.custodian?.employee_name}
              disabled
              className="mt-1"
            />
          </div>
          <div className="lg:col-span-5">
              <Label htmlFor="notes">NOTES</Label>
              <Textarea
                id="notes"
                name="notes"
                rows={1}
                value={assignRequest.notes}
                className="mt-1"
              />
            </div>
          <div className="lg:col-span-5">
            <Label htmlFor="approverNotes">APPROVER NOTES</Label>
            <Textarea
              id="approverNotes"
              name="approverNotes"
              rows={1}
              value={assignRequest.approval_status_message}
              onChange={(e) => setComments(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </form>
      </div>
      <div className="flex gap-2 my-4">
      <button
        className="block text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-3 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        onClick={() => toggleModal("approve")}
      >
        Approve
      </button>

      <button
        className="block text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-6 py-3 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
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
        className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
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


export default AssignPage;
