from typing import Any, Optional

import pandas as pd


def clean_field(value: Any) -> Optional[str]:
    """
    Clean a given field value.

    Removes NaN values, 'nan' strings, and pure whitespace. 
    Returns None for invalid values, otherwise strips and returns the cleaned string.

    Args:
        value (Any): The input value to clean.

    Returns:
        Optional[str]: The cleaned string if valid, otherwise None.
    """

    if pd.isna(value) or value == "nan" or str(value).strip() == "":
        return None
    return str(value).strip()
