import { useState } from "react";
import { DataType } from "../../components/AssetTable/types";
import AssetTableHandler from "../../components/AssignAsset/AssetTable/AssetTableHandler";
import DrawerViewRequest from "../RequestPage/DrawerViewRequest";
import { AssignmentHandler } from "../../components/AssignAsset/Assign/AssignmentHandler";
import { useQuery } from "@tanstack/react-query";
import { getAssetDetails } from "../../components/AssetTable/api/getAssetDetails";

const Assignableasset = () => {
  const [record, setRecord] = useState<DataType | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const [queryParam, setQueryParam] = useState("");
  const {
    data: assetData,
    isLoading: isAssetDataLoading,
    refetch: assetDataRefetch,
  } = useQuery({
    queryKey: ["assetList", queryParam],
    queryFn: () => getAssetDetails(`${queryParamProp + queryParam}`),
  });

  const showAssignDrawer = (record: DataType | null) => {
    setRecord(record);
    setOpen(true);
  };

  const closeAssignDrawer = () => {
    setOpen(false);
  };

  let queryParamProp = "&assign_status=UNASSIGNED|REJECTED&status=IN STORE";
  return (
    <div style={{ background: "white" }}>
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
                Allocate Assets
              </a>
            </div>
          </li>
        </ol>
      </nav>

      <AssetTableHandler
        queryParam={queryParam}
        setQueryParam={setQueryParam}
        assetData={assetData}
        isAssetDataLoading={isAssetDataLoading}
        assetDataRefetch={assetDataRefetch}
        showAssignDrawer={showAssignDrawer}
        queryParamProp={queryParamProp}
      />

      <DrawerViewRequest title="assign" onClose={closeAssignDrawer} open={open}>
        {record && (
          <AssignmentHandler
            record={record}
            closeAssignDrawer={closeAssignDrawer}
            assetDataRefetch={assetDataRefetch}
          />
        )}
      </DrawerViewRequest>
    </div>
  );
};

export default Assignableasset;
