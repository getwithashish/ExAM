import pandas as pd


def clean_field(value):
    if pd.isna(value) or value == "nan" or str(value).strip() == "":
        return None
    return str(value).strip()
