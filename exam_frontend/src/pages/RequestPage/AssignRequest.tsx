import { FC, useEffect, useState } from 'react';
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
import axiosInstance from '../../config/AxiosConfig';
import React from 'react';

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
      setAssignRequests(assignRequests.filter(assignRequest => assignRequest.asset_uuid !== selectedAssignRequest.asset_uuid));
      setSelectedAssignRequest(null)
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
              Pending Assign Requests
            </h1>
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
                <AssignRequestTable assignRequests={assignRequests} setSelectedAssignRequest={setSelectedAssignRequest} />
              </div>
            </div>
          )}
        </div>
      </div>
      {selectedAssignRequest && (
        <ViewRequestModal assignRequest={selectedAssignRequest} handleApprove={handleApprove} handleReject={handleReject} onClose={() => setSelectedAssignRequest(null)} />
      )}
      </React.Fragment>
  );
};



const AssignRequestTable: FC<{ assignRequests: any[], setSelectedAssignRequest: (assignRequest: any | null)=>void }> = function ({ assignRequests, setSelectedAssignRequest }) {  
  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
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
              {assignRequest.custodian.employee_name}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
              {new Date(assignRequest.created_at).toLocaleDateString()}
            </Table.Cell>
            <Table.Cell className="space-x-2 whitespace-nowrap p-4">
              <div className="flex items-center gap-x-3">
                <Button color="primary" onClick={() => setSelectedAssignRequest(assignRequest)}>
                  <HiPencilAlt className="mr-2 text-lg" />
                  View Request
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
  const [comments, setComments] = useState('');

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
                value={assignRequest.asset_id}
                disabled
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="assetCategory">ASSIGNEE</Label>
              <TextInput
                id="assetCategory"
                name="assetCategory"
                value={assignRequest.custodian.employee_name}
                disabled
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="productName">PRODUCT NAME</Label>
              <TextInput
                id="productName"
                name="productName"
                value={assignRequest.product_name}
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
              <Label htmlFor="status">STATUS</Label>
              <TextInput
                id="status"
                name="status"
                value={assignRequest.status}
                disabled
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="warrantyPeriod">WARRANTY PERIOD</Label>
              <TextInput
                id="warrantyPeriod"
                name="warrantyPeriod"
                value={assignRequest.warranty_period}
                disabled
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="dateOfPurchase">DATE OF PURCHASE</Label>
              <TextInput
                id="dateOfPurchase"
                name="dateOfPurchase"
                value={assignRequest.date_of_purchase}
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

export default AssignPage;
