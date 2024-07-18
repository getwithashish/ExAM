import { useState } from "react";
import { DataType } from "../../components/AssetTable/types";
import AssetTableHandler from "../../components/AssignAsset/AssetTable/AssetTableHandler";
import DrawerViewRequest from "../RequestPage/DrawerViewRequest";
import { AssignmentHandler } from "../../components/AssignAsset/Assign/AssignmentHandler";
import { useQuery } from "@tanstack/react-query";
import { getAssetDetails } from "../../components/AssetTable/api/getAssetDetails";

const AssignableAsset = () => {
  const [record, setRecord] = useState<DataType | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [queryParam, setQueryParam] = useState("");

  const queryParamProp = "&assign_status=UNASSIGNED|REJECTED&status=STOCK";

  const {
    data: assetData,
    isLoading: isAssetDataLoading,
    refetch: assetDataRefetch,
  } = useQuery({
    queryKey: ["assetList", queryParam],
    queryFn: () => getAssetDetails(`${queryParamProp}${queryParam}`),
    onError: (error) => {
      console.error("Error fetching asset data:", error);
    },
  });

  const showAssignDrawer = (record: DataType | null) => {
    setRecord(record);
    setOpen(true);
  };

  const closeAssignDrawer = () => {
    setOpen(false);
  };

  return (
    <div className="pt-8">
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

export default AssignableAsset;
