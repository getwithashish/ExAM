import React from 'react'
import AssetTableHandler from '../../components/AssetTable/AssetTableHandler'

const RejectedAsset = () => {
  let queryParamProp = "&asset_detail_status=CREATE_REJECTED|UPDATE_REJECTED&assign_status=REJECTED"
  let heading="Rejected Asset Details"
  return (
    <div className='bg-white' >
    
    <AssetTableHandler isRejectedPage={true} queryParamProp={queryParamProp} heading={heading} />
    </div>
  )
}

export default RejectedAsset
