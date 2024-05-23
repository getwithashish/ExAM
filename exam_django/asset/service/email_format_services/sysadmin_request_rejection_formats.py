class EmailRejectionFormats:
    def format_rejection_creation_email_body(asset, comments):
        email_body = f"""
        Subject: Asset Creation Rejection Notification

        Dear Team,

        We regret to inform you that the creation of the following asset has been rejected:

        Asset Details:
        -------------------------------------------------------
        - Asset UUID: {asset.asset_uuid}
        - Name: {asset.name}
        - Description: {asset.description}
        - Created At: {asset.created_at}
        - Updated At: {asset.updated_at}
        - Approval Status Message: {asset.approval_status_message}
        -------------------------------------------------------

        Comments:
        {comments}

        Please address the issues mentioned and resubmit the asset for approval.

        Sincerely,
        {asset.approved_by}
        """
        return email_body

    def format_rejection_modification_email_body(asset, comments):
        email_body = f"""
        Subject: Asset Modification Rejection Notification

        Dear Team,

        We regret to inform you that the modification of the following asset has been rejected:

        Asset Details:
        -------------------------------------------------------
        - Asset UUID: {asset.asset_uuid}
        - Name: {asset.name}
        - Description: {asset.description}
        - Created At: {asset.created_at}
        - Updated At: {asset.updated_at}
        - Approval Status Message: {asset.approval_status_message}
        -------------------------------------------------------

        Comments:
        {comments}

        Please address the issues mentioned and resubmit the asset for approval.

        Sincerely,
        {asset.approved_by}
        """
        return email_body

    def format_rejection_allocation_email_body(asset, comments):
        email_body = f"""
        Subject: Asset Allocation Rejection Notification

        Dear Team,

        We regret to inform you that the allocation of the following asset has been rejected:

        Asset Details:
        -------------------------------------------------------
        - Asset UUID: {asset.asset_uuid}
        - Name: {asset.name}
        - Description: {asset.description}
        - Created At: {asset.created_at}
        - Updated At: {asset.updated_at}
        - Approval Status Message: {asset.approval_status_message}
        -------------------------------------------------------

        Comments:
        {comments}

        Please address the issues mentioned and resubmit the asset for approval.

        Sincerely,
        {asset.approved_by}
        """
        return email_body

    def format_rejection_deallocation_email_body(asset, comments):
        email_body = f"""
        Subject: Asset Deallocation Rejection Notification

        Dear Team,

        We regret to inform you that the deallocation of the following asset has been rejected:

        Asset Details:
        -------------------------------------------------------
        - Asset UUID: {asset.asset_uuid}
        - Name: {asset.name}
        - Description: {asset.description}
        - Created At: {asset.created_at}
        - Updated At: {asset.updated_at}
        Best regards,
        {asset.approved_by}
        """
        return email_body