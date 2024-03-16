import { DataType } from '../../AssetTable/types/index'


export interface DrawerProps {
    visible: boolean;
    onClose: () => void;
    selectedRow: DataType | null;
    title: string;
    button: React.ReactNode;
    children:string;
    drawerTitle:string
  }