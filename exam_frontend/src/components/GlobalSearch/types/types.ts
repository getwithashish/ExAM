export interface GlobalSearchProps {
    onSearch: (searchTerm: string) => void;
    assetDataRefetch: (queryParam: string) => void;
  }