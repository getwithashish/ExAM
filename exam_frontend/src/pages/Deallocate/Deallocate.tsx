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
      const data = { asset_uuid: record?.key };
      const res = await axiosInstance.post("/asset/unassign_asset", data);
      message.success(res.data.message);
    } catch (error) {
      message.error(error.data.message);
    } finally {
      setLoading(false);
    }
  };
  let queryParamProp = "&assign_status=ASSIGNED|REJECTED&status=USE";
  return (
    <div className="bg-custom-400 pt-8">
      <Spin spinning={loading}>
        <AssetTableHandler
          unassign={unassign}
          queryParamProp={queryParamProp}
        />
      </Spin>
    </div>
  );
};

export default Deallocate;
