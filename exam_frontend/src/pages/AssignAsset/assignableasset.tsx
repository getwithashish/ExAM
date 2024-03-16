import  { useState } from 'react'
import AssetTableOne from '../../components/AssetTable/AssetTableOne'
import AssignmentDrawer from '../../components/Assign/AssignmentDrawer'
import { Assignment } from '../../components/Assign/Assignment'
import { DataType } from '../../components/AssetTable/types'
const assignableasset = () => {
  const [isAssign,setIsAssign] = useState(false)
  const [record,setRecord] = useState<DataType>()
  
 
 const showAssignDrawer =(record:DataType)=>{
  console.log("Hello")
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
         {record && <Assignment record={record} />} 
          <div></div>
        </AssignmentDrawer>
    </div>
  )
}

export default assignableasset
