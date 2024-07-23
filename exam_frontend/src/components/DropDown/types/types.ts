interface DropDownProps {
    onSelect: (key: string) => void;
    items?: { label: string; key: string; icon?: React.ReactNode }[];
    buttonLabel?: string;
  }
  