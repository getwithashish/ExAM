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
