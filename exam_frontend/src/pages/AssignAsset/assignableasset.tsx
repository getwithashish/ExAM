import  { useState } from 'react'
import AssignmentDrawer from '../../components/AssignAsset/Assign/AssignmentDrawer'
import { Assignment } from '../../components/AssignAsset/Assign/Assignment'
import { DataType } from '../../components/AssetTable/types'
import AssetTableHandler from '../../components/AssignAsset/AssetTable/AssetTableHandler'
const Assignableasset = () => {
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
    <div style={{ background:"white"}}>
      {/* <AssetTableOne showAssignDrawer={showAssignDrawer}/> */}
      <AssetTableHandler showAssignDrawer={showAssignDrawer}/>

      <AssignmentDrawer isAssign={isAssign} closeAssignDrawer={closeAssignDrawer} >
         {record && <Assignment record={record} />} 
          
        </AssignmentDrawer>
    </div>
  )
}

export default Assignableasset
