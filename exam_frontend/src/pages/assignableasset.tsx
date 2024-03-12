import React from 'react'
import AssetTableOne from '../components/AssetTable/AssetTableOne'
import {assignAsset} from '../pages/index'
const assignableasset = () => {
  return (
    <div>
      <AssetTableOne assignAsset={assignAsset}/>
    </div>
  )
}

export default assignableasset
