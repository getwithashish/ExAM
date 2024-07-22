import AssetTableHandler from "../../components/AssetTable/AssetTableHandler";
import { useAuth } from "../authentication/AuthContext";

const UpdatableAsset = () => {
  const { userRole } = useAuth();

  let queryParamProp =
    userRole === "MANAGER"
      ? "&deleted=True"
      : "&asset_detail_status=CREATED|UPDATED|CREATE_REJECTED|UPDATE_REJECTED";
  let heading =
    userRole === "MANAGER"
      ? "Deleted Assets"
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
      />
    </div>
  );
};

export default UpdatableAsset;
