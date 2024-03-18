import React from 'react'
import AssetTableHandler from '../../components/AssetTable/AssetTableHandler'

const UpdatableAsset = () => {
  let queryParamProp = "&asset_detail_status=CREATED|UPDATED|CREATE_REJECTED|UPDATE_REJECTED"
   let heading="Updatable Asset Details"
  return (
    <div className='bg-white' >
      <AssetTableHandler isRejectedPage={false} queryParamProp={queryParamProp} heading={heading} />
    </div>
  )
}

export default UpdatableAsset
