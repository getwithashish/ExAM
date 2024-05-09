export interface GlobalSearchProps {
  assetDataRefetch: (queryParam: string) => void;
  searchTerm: string; // Add searchTerm
  setSearchTerm: (queryParam: string) => void;
}