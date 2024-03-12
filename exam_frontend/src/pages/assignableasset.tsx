import React, { useState } from 'react'
import AssetTableOne from '../components/AssetTable/AssetTableOne'
import AssignmentDrawer from '../components/Assign/AssignmentDrawer'
import { RecordProps } from './index/types'
import { Assignment } from '../components/Assign/Assignment'

const assignableasset = () => {
  const [isAssign,setIsAssign] = useState(false)
  const [record,setRecord] = useState<RecordProps>()


 const showAssignDrawer =(record:RecordProps)=>{
  console.log("uuid",record)
  setRecord(record)
  setIsAssign(true)
  
}
const closeAssignDrawer = ()=> {
setIsAssign(false)

}
  return (
    <div>
      <AssetTableOne showAssignDrawer={showAssignDrawer}/>

      <AssignmentDrawer isAssign={isAssign} closeAssignDrawer={closeAssignDrawer} >
          <Assignment record={record} />
        </AssignmentDrawer>
    </div>
  )
}

export default assignableasset
