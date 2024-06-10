import re


def construct_asset_data_body(**kwargs):
    asset_data = f"""Asset Name: {kwargs["product_name"]}
{"Asset Category: " + kwargs.get('asset_category') if kwargs.get('asset_category') is not None else ''}
{"Asset Type: " + kwargs.get('asset_type', {}).get('asset_type_name') if kwargs.get('asset_type') is not None else ''}
{"Asset ID: " + kwargs.get('asset_id', {}) if kwargs.get('asset_id') is not None else ''}
{"Model: " + kwargs.get('model_number', {}) if kwargs.get('model_number') is not None else ''}
{"Serial Number: " + kwargs.get('serial_number', {}) if kwargs.get('serial_number') is not None else ''}
{"Asset Status: " + kwargs.get('status', {}) if kwargs.get('status') is not None else ''}
{"Owner: " + kwargs.get('owner', {}) if kwargs.get('owner') is not None else ''}
{"Custodian: " + kwargs.get('custodian', {}).get('employee_name') if kwargs.get('custodian') is not None else ''}
{"Date of Purchase: " + kwargs.get('date_of_purchase', {}) if kwargs.get('date_of_purchase') is not None else ''}
{"Warranty Period: " + str(kwargs.get('warranty_period', {})) if kwargs.get('warranty_period') is not None else ''}
{"Location: " + kwargs.get('location', {}).get('location_name') if kwargs.get('location') is not None else ''}
{"Invoice Location: " + kwargs.get('invoice_location', {}).get('location_name') if kwargs.get('invoice_location') is not None else ''}
{"Business Unit: " + kwargs.get('business_unit', {}).get('business_unit_name') if kwargs.get('business_unit') is not None else ''}
{"Operating System: " + kwargs.get('os', {}) if kwargs.get('os') is not None else ''}
{"OS Version: " + kwargs.get('os_version', {}) if kwargs.get('os_version') is not None else ''}
{"Mobile OS: " + kwargs.get('mobile_os', {}) if kwargs.get('mobile_os') is not None else ''}
{"Processor: " + kwargs.get('processor', {}) if kwargs.get('processor') is not None else ''}
{"Processor Generation: " + kwargs.get('processor_gen', {}) if kwargs.get('processor_gen') is not None else ''}
{"Memory: " + str(kwargs.get('memory', {}).get('memory_space')) if kwargs.get('memory') is not None else ''}
{"Storage: " + kwargs.get('storage', {}) if kwargs.get('storage') is not None else ''}
{"Configuration: " + kwargs.get('configuration', {}) if kwargs.get('configuration') is not None else ''}
{"Accessories: " + kwargs.get('accessories', {}) if kwargs.get('accessories') is not None else ''}
{"Notes: " + kwargs.get('notes', {}) if kwargs.get('notes') else ''}
{"Approval Message: " + kwargs.get('approval_status_message', {}) if kwargs.get('approval_status_message') else ''}
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


def convert_to_first_letter_uppercase(text):
    if not text:
        return text

    return text[0].upper() + text[1:].lower()
