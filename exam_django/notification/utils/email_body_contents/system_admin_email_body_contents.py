from notification.utils.email_body_contents.all_users_email_body_contents import (
    construct_asset_data_body,
    convert_to_first_letter_uppercase,
    email_body_signature_content,
)


def construct_creation_approval_email_body(**kwargs):
    return (
        f"""Dear System Admin,

We are pleased to inform you that the creation of the following {convert_to_first_letter_uppercase(kwargs["asset_category"])} asset has been approved by {kwargs["approved_by"]["username"]} ({kwargs["approved_by"]["email"]}):

{convert_to_first_letter_uppercase(kwargs["asset_category"])} Asset Details:
-------------------------------------------------------
{construct_asset_data_body(**kwargs)}
-------------------------------------------------------

For more details you can login and view the dashboard of Asset Management System

"""
        + email_body_signature_content
    )


def construct_modification_approval_email_body(**kwargs):
    return (
        f"""Dear System Admin,

We are pleased to inform you that the modification of the following {convert_to_first_letter_uppercase(kwargs["asset_category"])} asset has been approved by {kwargs["approved_by"]["username"]} ({kwargs["approved_by"]["email"]}):

{convert_to_first_letter_uppercase(kwargs["asset_category"])} Asset Details:
-------------------------------------------------------
{construct_asset_data_body(**kwargs)}
-------------------------------------------------------

For more details you can login and view the dashboard of Asset Management System

"""
        + email_body_signature_content
    )


def construct_allocation_approval_email_body(**kwargs):
    return (
        f"""Dear System Admin,

We are pleased to inform you that the allocation of the following {convert_to_first_letter_uppercase(kwargs["asset_category"])} asset has been approved by {kwargs["approved_by"]["username"]} ({kwargs["approved_by"]["email"]}):

{convert_to_first_letter_uppercase(kwargs["asset_category"])} Asset Details:
-------------------------------------------------------
{construct_asset_data_body(**kwargs)}
-------------------------------------------------------

For more details you can login and view the dashboard of Asset Management System

"""
        + email_body_signature_content
    )


def construct_deallocation_approval_email_body(**kwargs):
    return (
        f"""Dear System Admin,

We are pleased to inform you that the deallocation of the following {convert_to_first_letter_uppercase(kwargs["asset_category"])} asset has been approved by {kwargs["approved_by"]["username"]} ({kwargs["approved_by"]["email"]}):

{convert_to_first_letter_uppercase(kwargs["asset_category"])} Asset Details:
-------------------------------------------------------
{construct_asset_data_body(**kwargs)}
-------------------------------------------------------

For more details you can login and view the dashboard of Asset Management System

"""
        + email_body_signature_content
    )


def construct_creation_rejection_email_body(**kwargs):
    return (
        f"""Dear System Admin,

We regret to inform you that the creation of the following {convert_to_first_letter_uppercase(kwargs["asset_category"])} asset has been rejected by {kwargs["approved_by"]["username"]} ({kwargs["approved_by"]["email"]}):

{convert_to_first_letter_uppercase(kwargs["asset_category"])} Asset Details:
-------------------------------------------------------
{construct_asset_data_body(**kwargs)}
-------------------------------------------------------

For more details you can login and view the dashboard of Asset Management System

"""
        + email_body_signature_content
    )


def construct_modification_rejection_email_body(**kwargs):
    return (
        f"""Dear System Admin,

We regret to inform you that the modification of the following {convert_to_first_letter_uppercase(kwargs["asset_category"])} asset has been rejected by {kwargs["approved_by"]["username"]} ({kwargs["approved_by"]["email"]}):

{convert_to_first_letter_uppercase(kwargs["asset_category"])} Asset Details:
-------------------------------------------------------
{construct_asset_data_body(**kwargs)}
-------------------------------------------------------

For more details you can login and view the dashboard of Asset Management System

"""
        + email_body_signature_content
    )


def construct_allocation_rejection_email_body(**kwargs):
    return (
        f"""Dear System Admin,

We regret to inform you that the allocation of the following {convert_to_first_letter_uppercase(kwargs["asset_category"])} asset has been rejected by {kwargs["approved_by"]["username"]} ({kwargs["approved_by"]["email"]}):

{convert_to_first_letter_uppercase(kwargs["asset_category"])} Asset Details:
-------------------------------------------------------
{construct_asset_data_body(**kwargs)}
-------------------------------------------------------

For more details you can login and view the dashboard of Asset Management System

"""
        + email_body_signature_content
    )


def construct_deallocation_rejection_email_body(**kwargs):
    return (
        f"""Dear System Admin,

We regret to inform you that the deallocation of the following {convert_to_first_letter_uppercase(kwargs["asset_category"])} asset has been rejected by {kwargs["approved_by"]["username"]} ({kwargs["approved_by"]["email"]}):

{convert_to_first_letter_uppercase(kwargs["asset_category"])} Asset Details:
-------------------------------------------------------
{construct_asset_data_body(**kwargs)}
-------------------------------------------------------

For more details you can login and view the dashboard of Asset Management System

"""
        + email_body_signature_content
    )
