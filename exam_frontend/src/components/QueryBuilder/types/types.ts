export interface FieldValues {
  [key: string]: string | FieldValues;
  value: string;
  inputValue: string;
}

export interface MuiAutocompleteProps {
  allFieldValues: [FieldValues];
  setAllFieldValues: React.Dispatch<
    React.SetStateAction<(string | FieldValues)[]>
  >;
}

export interface ItemElementTypeWithString {
  label: string;
  value: string;
  queryFieldName: string;
}

export interface ItemElementTypeWithUndefined {
  label: string;
  value: string;
  queryFieldName?: undefined;
}
