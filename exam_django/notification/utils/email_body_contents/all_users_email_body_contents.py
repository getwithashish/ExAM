import re


def construct_asset_data_body(**kwargs):
    asset_data = f"""Asset Name: {kwargs["product_name"]}
{"Asset Category: " + kwargs.get('asset_category') if kwargs.get('asset_category') is not None else ''}
{"Asset Type: " + kwargs.get('asset_type', {}).get('asset_type_name') if kwargs.get('asset_type') is not None else ''}
{"Asset ID: " + kwargs.get('asset_id', {}) if kwargs.get('asset_id') is not None else ''}
{"Model: " + kwargs.get('model_number', {}) if kwargs.get('model_number') is not None else ''}
{"Serial Number: " + kwargs.get('serial_number', {}) if kwargs.get('serial_number') is not None else ''}
{"Asset Status: " + kwargs.get('status', {}) if kwargs.get('status') is not None else ''}
{"Date of Purchase: " + kwargs.get('date_of_purchase', {}) if kwargs.get('date_of_purchase') is not None else ''}
{"Location: " + kwargs.get('location', {}).get('location_name') if kwargs.get('location') is not None else ''}
{"Business Unit: " + kwargs.get('business_unit', {}).get('business_unit_name') if kwargs.get('business_unit') is not None else ''}
{"Operating System: " + kwargs.get('os', {}) if kwargs.get('os') is not None else ''}
{"OS Version: " + kwargs.get('os_version', {}) if kwargs.get('os_version') is not None else ''}
{"Processor: " + kwargs.get('processor', {}) if kwargs.get('processor') is not None else ''}
{"Memory: " + str(kwargs.get('memory', {}).get('memory_space')) if kwargs.get('memory') is not None else ''}
{"Storage: " + kwargs.get('storage', {}) if kwargs.get('storage') is not None else ''}
{"Configuration: " + kwargs.get('configuration', {}) if kwargs.get('configuration') is not None else ''}
{"Accessories: " + kwargs.get('accessories', {}) if kwargs.get('accessories') is not None else ''}
{"Notes: " + kwargs.get('notes', {}) if kwargs.get('notes') is not None else ''}
"""

    return re.sub(r"\n+", "\n", asset_data)


email_body_signature_content = """Regards and Thank you.

System Facility Management (SFM)
Experion Technologies

Australia | Germany | India | Netherlands | Switzerland | UK | USA
Clutch - Top 20 Digital Solutions - Worldwide; Texas Top 100
Great Place to Work 2021
Major Contender - Everest Group's Digital Product Engineering Peak Matrix Assessment 2022
2022 Frost & Sullivan Global Software Product Engineering Customer Value Leadership Award
Inc. 5000- 4-time winner."""
