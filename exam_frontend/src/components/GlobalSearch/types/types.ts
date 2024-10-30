export interface GlobalSearchProps {
  assetDataRefetch: (queryParam: string) => void;
  searchTerm: string; // Add searchTerm
  setSearchTerm: (queryParam: string) => void;
  reset?: () => void;
  setJson_query?: () => void;
  json_query?: string;
  advancedSearchDisabledFields?: string[];
  isAdvancedSearchDisabled?: boolean;
}
