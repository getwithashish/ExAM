export type Props = {
    assetUuid: string;
    onClose?: () => void;
    open?: boolean;
  }

export type LogChange = {
    old_value: string;
    new_value: string;
  }
  
export type Log = {
    id: string;
    timestamp: string;
    operation: string;
    changes: { [key: string]: LogChange };
  }
  
export type ErrorResponse = {
    message: string;
  }