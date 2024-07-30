import AssetTableHandler from "../../components/AssetTable/AssetTableHandler";

const ExpiredAssets = () => {
  const queryParamProp = "&expired=true";
  const heading = "Expired Assets";


  return (
    <div >
       <div className="pt-8">
        { 
          <AssetTableHandler
            isRejectedPage={false}
            queryParamProp={queryParamProp}
            heading={heading}
            isMyApprovalPage={false}
          />
        }
      </div>
    </div>
  );
};

export default ExpiredAssets;
