import { useState } from "react";
import { DataType } from "../../components/AssetTable/types";
import AssetTableHandler from "../../components/Deallocate/AssetTable/AssetTableHandler";
import axiosInstance from "../../config/AxiosConfig";
import { message, Spin } from "antd";

const Deallocate = () => {
  const [loading, setLoading] = useState(false);

  const unassign = async (record: DataType | null) => {
    try {
      setLoading(true);
      const data = { asset_uuid: record?.key, version: record?.version };
      const res = await axiosInstance.post("/asset/unassign_asset", data);
      message.success(res.data?.message);
    } catch (error) {
      message.error(error.data?.message);
    } finally {
      setLoading(false);
    }
  };
  let queryParamProp =
    "&assign_status=ASSIGNED|REJECTED&asset_detail_status=CREATED|UPDATED|UPDATE_REJECTED&status=USE";
  return (
    <div
      className="bg-white dark:bg-custom-400 sm:mx-0"
      style={{
        margin: "0 37px 0 30px",
        paddingBottom: "20px",
        borderRadius: "10px",
      }}
    >
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <Spin size="large" />
        </div>
      )}
      <AssetTableHandler unassign={unassign} queryParamProp={queryParamProp} />
    </div>
  );
};

export default Deallocate;
