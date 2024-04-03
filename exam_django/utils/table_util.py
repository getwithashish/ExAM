class TableUtil:

    @classmethod
    def get_changed_fields(cls, original_data, updated_data):
        changed_fields = {}
        for field, value in updated_data.items():
            if original_data.get(field) != value:
                changed_fields[field] = value

        return changed_fields

    @classmethod
    def has_expected_keys(cls, obj, expected_keys):
        object_keys = set(obj.keys())
        matching_keys = object_keys & set(expected_keys)
        return bool(matching_keys)
