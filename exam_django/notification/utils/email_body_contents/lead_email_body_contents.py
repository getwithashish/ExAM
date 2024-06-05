from notification.utils.email_body_contents.all_users_email_body_contents import (
    construct_asset_data_body,
    email_body_signature_content,
)


def construct_allocate_asset_email_body_content(**kwargs):
    return (
        f"""Dear Lead,

We would like to inform you that a request is made by {kwargs["requester"]["username"]} ({kwargs["requester"]["email"]}) to allocate an asset to {kwargs["custodian"]["employee_name"]}.

Details of the asset:

{construct_asset_data_body(**kwargs)}

For more details you can login and view the dashboard of Asset Management System

"""
        + email_body_signature_content
    )


def construct_deallocate_asset_email_body_content(**kwargs):
    return (
        f"""Dear Lead,

    We would like to inform you that a request is made by {kwargs["requester"]["username"]} ({kwargs["requester"]["email"]}) to deallocate an asset from {kwargs["custodian"]["employee_name"]}.

    Details of the asset:
    Asset Name: {kwargs["product_name"]}
    Asset Category: {kwargs["asset_category"]}
    Asset Type: {kwargs["asset_type"]["asset_type_name"]}
    Asset ID: {kwargs["asset_id"]}

    For more details you can login and view the dashboard of Asset Management System.

    """
        + email_body_signature_content
    )
