import AssetTableHandler from "../../components/AssetTable/AssetTableHandler";
import { useAuth } from "../authentication/AuthContext";

const UpdatableAsset = () => {
  const { userRole } = useAuth();

  let queryParamProp =
    userRole === "MANAGER"
      ? "&deleted=True"
      : userRole === "LEAD"
        ? "&asset_detail_status=CREATED|UPDATED|CREATE_REJECTED|UPDATE_REJECTED&assign_status=ASSIGNED|UNASSIGNED|REJECTED"
        : "&asset_detail_status=CREATED|UPDATED|CREATE_REJECTED|UPDATE_REJECTED";
  let heading =
    userRole === "MANAGER"
      ? "Restore Deleted Assets"
      : userRole === "LEAD"
        ? "Delete Assets"
        : "Modify Assets";

  return (
    <div className="pt-8">
      <AssetTableHandler
        isRejectedPage={false}
        queryParamProp={queryParamProp}
        heading={heading}
        isMyApprovalPage={true}
        userRole={userRole}
        destroyOnClose={true}
      />
    </div>
  );
};

export default UpdatableAsset;
