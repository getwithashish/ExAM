class EmailApprovalFormats:
    @staticmethod
    def format_approval_creation_email_body(asset, comments):
        email_body = f"""
        Subject: Asset Creation Approval Notification

        Dear Team,

        We are pleased to inform you that the creation of the following asset has been approved:

        Asset Details:
        -------------------------------------------------------
        - Asset UUID: {asset.asset_uuid}
        - Asset ID: {asset.asset_id}
        - Version: {asset.version}
        - Asset Category: {asset.asset_category}
        - Asset Type: {asset.asset_type}
        - Product Name: {asset.product_name}
        - Model Number: {asset.model_number}
        - Serial Number: {asset.serial_number}
        - Owner: {asset.owner}
        - Custodian: {asset.custodian}
        - Date of Purchase: {asset.date_of_purchase}
        - Status: {asset.status}
        - Warranty Period: {asset.warranty_period}
        - Location: {asset.location}
        - Invoice Location: {asset.invoice_location}
        - Business Unit: {asset.business_unit}
        - OS: {asset.os}
        - OS Version: {asset.os_version}
        - Mobile OS: {asset.mobile_os}
        - Processor: {asset.processor}
        - Processor Generation: {asset.processor_gen}
        - Memory: {asset.memory}
        - Storage: {asset.storage}
        - Configuration: {asset.configuration}
        - Accessories: {asset.accessories}
        - Notes: {asset.notes}
        - License Type: {asset.LicenseType}
        - Approved By: {asset.approved_by}
        - Asset Detail Status: {asset.asset_detail_status}
        - Assign Status: {asset.assign_status}
        - Approval Status Message: {asset.approval_status_message}
        - Created At: {asset.created_at}
        - Updated At: {asset.updated_at}
        - Requester: {asset.requester}
        -------------------------------------------------------

        Comments:
        {comments}

        Please proceed with the next steps as required.

        Best regards,
        {asset.approved_by}
        """
        return email_body

    @staticmethod
    def format_approval_modification_email_body(asset, comments):
        email_body = f"""
        Subject: Asset Modification Approval Notification

        Dear Team,

        We are pleased to inform you that the modification of the following asset has been approved:

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

        Please proceed with the next steps as required.

        Best regards,
        {asset.approved_by}
        """
        return email_body

    @staticmethod
    def format_approval_allocation_email_body(asset, comments):
        email_body = f"""
        Subject: Asset Allocation Approval Notification

        Dear Team,

        We are pleased to inform you that the allocation of the following asset has been approved:

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

        Please proceed with the next steps as required.

        Best regards,
        {asset.approved_by}
        """
        return email_body

    @staticmethod
    def format_approval_deallocation_email_body(asset, comments):
        email_body = f"""
        Subject: Asset Deallocation Approval Notification

        Dear Team,

        We are pleased to inform you that the deallocation of the following asset has been approved:

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

        Please proceed with the next steps as required.

        Best regards,
        {asset.approved_by}
        """
        return email_body

    @staticmethod
    def format_rejection_email_body(asset, comments):
        email_body = f"""
        Subject: Asset Rejection Notification

        Dear Team,

        We regret to inform you that the request for the following asset has been rejected:

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

        Please address the issues as mentioned in the comments and resubmit the request.

        Best regards,
        {asset.approved_by}
        """
        return email_body
