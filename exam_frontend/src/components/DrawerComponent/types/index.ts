import { DataType } from '../../AssetTable/AssetTable'


export interface DrawerProps {
    visible: boolean;
    onClose: () => void;
    selectedRow: DataType | null;
    title: string;
    button: React.ReactNode;
    children:string;
  }