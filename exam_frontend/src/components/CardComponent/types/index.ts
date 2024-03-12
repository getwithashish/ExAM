import {DataType} from '../../AssetTable/types/index'

export interface CardType{
    data: DataType; 
    statusOptions: string[];
    businessUnitOptions:string[];
    locations:string[];
    memoryData:string[];
    assetTypeData :string[];
    onUpdate: (updatedData: DataType) => void;
}
