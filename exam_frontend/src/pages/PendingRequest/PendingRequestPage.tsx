import AssetTableHandler from "../../components/AssetTable/AssetTableHandler";

const PendingRequestPage = () => {
  const decodeJWT = (token: string) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
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
      return payload.user_id;
    }
  };

    let queryParamProp = `&json_logic=%7B%0A%20%20%20%22and%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%22or%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%7B%22%3D%3D%22%3A%20%5B%7B%22var%22%3A%20%22asset_detail_status%22%7D%2C%20%22CREATE_PENDING%22%5D%7D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%7B%22%3D%3D%22%3A%20%5B%7B%22var%22%3A%20%22asset_detail_status%22%7D%2C%20%22UPDATE_PENDING%22%5D%7D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%7B%22%3D%3D%22%3A%20%5B%7B%22var%22%3A%20%22assign_status%22%7D%2C%20%22ASSIGN_PENDING%22%5D%7D%0A%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%22%3D%3D%22%3A%20%5B%7B%22var%22%3A%20%22requester%22%7D%2C%20${getUserId()}%5D%7D%0A%20%20%20%20%20%20%5D%0A%7D%0A`
    let heading = "My Pending Request";

  return (
    <div className="pt-8">
      <AssetTableHandler
        isRejectedPage={false}
        queryParamProp={queryParamProp}
        heading={heading}
      />
    </div>
  );
};

export default PendingRequestPage;
