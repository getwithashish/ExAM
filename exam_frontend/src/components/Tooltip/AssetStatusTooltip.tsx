import { InfoCircleOutlined } from "@ant-design/icons";
import CustomTooltip from "./CustomTooltip";
import { FC } from "react";

interface AssetStatusTooltipProps {
  isChartTooltip?: boolean;
}

export const AssetStatusTooltip: FC<AssetStatusTooltipProps> = ({
  isChartTooltip = false,
}) => {
  const statusDescription = `
      <b>STOCK</b> - Unused assets currently in stock
      <br /> 
      <b>USE</b> - Assets which are in use (includes those allocated to custodians and used by SFM)
      <br />
      ${
        isChartTooltip === true
          ? "<b>ACTIVE</b> - Includes all in-stock and in-use assets <br />"
          : ""
      }
      <b>DAMAGED</b> - Damaged assets for repair or scrapping
      <br />
      <b>REPAIR</b> - Assets under repair
      <br />
      <b>OUTDATED</b> - Unused but operational assets
      <br />
      ${
        isChartTooltip === true
          ? "<b>INACTIVE</b> - Includes all damaged, under-repair, or outdated assets <br />"
          : ""
      }
      <b>SCRAP</b> - Disposed, unused assets
    `;
  return (
    <CustomTooltip
      title={<span dangerouslySetInnerHTML={{ __html: statusDescription }} />}
    >
      {" "}
      <InfoCircleOutlined
        hidden={!statusDescription}
        className="dark:text-white"
        style={{ marginLeft: "5px" }}
      />
    </CustomTooltip>
  );
};
