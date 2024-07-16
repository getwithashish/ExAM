import AssetTableHandler from "../../components/AssetTable/AssetTableHandler";

const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) {
      throw new Error("Invalid JWT token: Missing base URL segment");
    }
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

const getUserId = () => {
  const jwtToken = localStorage.getItem("jwt");
  if (jwtToken) {
    const payload = decodeJWT(jwtToken);
    return payload?.user_id;
  }
};

const ApprovedRequestPage = () => {
  const userId = getUserId();
  const queryParamProp = `&asset_detail_status=CREATED|UPDATED&assign_status=ASSIGNED|UNASSIGNED&requester_id=${userId}`;
  const heading = "My Approved Request";

  return (
    <div className="pt-8">
      <AssetTableHandler
        isRejectedPage={false}
        queryParamProp={queryParamProp}
        heading={heading}
        userRole={undefined}
        isMyApprovalPage={undefined}
      />
    </div>
  );
};

export default ApprovedRequestPage;
