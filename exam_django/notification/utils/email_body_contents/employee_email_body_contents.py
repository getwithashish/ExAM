from notification.utils.email_body_contents.all_users_email_body_contents import (
    construct_asset_data_body,
    convert_to_first_letter_uppercase,
    email_body_signature_content,
)


def construct_allocation_approval_employee_email_body(**kwargs):
    return (
        f"""Dear {kwargs["custodian"]["first_name"]} {kwargs["custodian"]["last_name"]},

We are pleased to inform you that the allocation of the following {convert_to_first_letter_uppercase(kwargs["asset_category"])} asset has been successfully approved and assigned to you by SFM:

{convert_to_first_letter_uppercase(kwargs["asset_category"])} Asset Details:
-------------------------------------------------------
{construct_asset_data_body(**kwargs)}
-------------------------------------------------------

Please take a moment to review the asset details.

If you have any questions or concerns regarding the asset allocation, feel free to contact SFM.

"""
        + email_body_signature_content
    )


def construct_deallocation_approval_employee_email_body(**kwargs):
    return (
        f"""Dear {kwargs["custodian"]["first_name"]} {kwargs["custodian"]["last_name"]},

This is to inform you that the following {convert_to_first_letter_uppercase(kwargs["asset_category"])} asset has been successfully de-allocated from you by SFM:

{convert_to_first_letter_uppercase(kwargs["asset_category"])} Asset Details:
-------------------------------------------------------
{construct_asset_data_body(**kwargs)}
-------------------------------------------------------

If you have any questions or concerns regarding the asset allocation, feel free to contact SFM.

"""
        + email_body_signature_content
    )
