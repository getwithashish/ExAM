import React from 'react'
import AssetTableHandler from '../../components/AssetTable/AssetTableHandler'

const RejectedAsset = () => {
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
    console.log(jwtToken);
    if (jwtToken) {
      const payload = decodeJWT(jwtToken);
      return payload.user_id
    }
  };

  let queryParamProp =
    `&asset_detail_status=CREATE_REJECTED|UPDATE_REJECTED&assign_status=REJECTED&requester_id=${getUserId()}`;
  let heading = "My approved Request";

  return (
    <div>
      <AssetTableHandler
        isRejectedPage={false}
        queryParamProp={queryParamProp}
        heading={heading}
      />
    </div>
  );
};

export default RejectedAsset
