import {DataType} from '../../AssetTable/types/index'

export interface CardType{
    data: DataType; 
    statusOptions: string[];
    businessUnitOptions:string[];
    locationOptions:string[];
    memoryoptions:string[];
    assetTypeOptions:string[];
    onUpdate: (updatedData: DataType) => void;
}
