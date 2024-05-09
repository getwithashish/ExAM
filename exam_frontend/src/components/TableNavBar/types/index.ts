// TableNavBar.module.d.ts

export interface TableNavBarModule {
  navbar: string;
  fileActionsContainer: string;
  fileInput: string;
  importButton: string;
  exportButton: string;
  visible: boolean;
  onClose: () => void;
  buttonTextDefault: string;
  displayDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

declare const styles: TableNavBarModule;

export default styles;

export interface TableNavbarProps {
  showUpload: boolean;
  setShowUpload: React.Dispatch<React.SetStateAction<boolean>>;
  assetDataRefetch: (queryParam: string) => void;
  reset: () => void;
  searchTerm: string; // Add searchTerm property
  onSearch: (searchTerm: string) => void;
  setSearchTerm: (searchTerm: string) => void;
}
