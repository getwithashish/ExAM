class EmailApprovalFormats:
    @staticmethod
    def format_approval_creation_email_body(asset, comments, asset_category):
        if asset_category == "HARDWARE":
            email_subject = "HARDWARE ASSET CREATION APPROVED"
            heading = "Hardware"
            email_body = f"""
        Dear All,

        We are pleased to inform you that the creation of the following {heading} asset has been approved:

        {heading} Asset Details:
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
        - Approved By: {asset.approved_by}
        - Asset Detail Status: {asset.asset_detail_status}
        - Assign Status: {asset.assign_status}
        - Approval Status Message: {asset.approval_status_message}
        - Created At: {asset.created_at}
        - Updated At: {asset.updated_at}
        - Requester: {asset.requester}
        - Comments: {comments}
        -------------------------------------------------------

        Comments:
        {comments}

    

        Best regards and ThankYou,
        {asset.approved_by}
        """

        else:
             email_subject = "SOFTWARE ASSET CREATION APPROVED"
             heading="Software"
             email_body = f"""
        Dear All,

        We are pleased to inform you that the creation of the following {heading} asset has been approved:

        {heading} Asset Details:
        -------------------------------------------------------
       - Asset UUID: {asset.asset_uuid}
        - Asset ID: {asset.asset_id}
        - Version: {asset.version}
        - Asset Category: {asset.asset_category}
        - Asset Type: {asset.asset_type}
        - Product Name: {asset.product_name}
        - License Type: {asset:license_type}
        - Owner: {asset.owner}
        - Custodian: {asset.custodian}
        - Date of Purchase: {asset.date_of_purchase}
        - Status: {asset.status}
        - Location: {asset.location}
        - Business Unit: {asset.business_unit}
        - Notes: {asset.notes}
        - Rejected By: {asset.rejected_by}
        - Asset Detail Status: {asset.asset_detail_status}
        - Assign Status: {asset.assign_status}
        - Created At: {asset.created_at}
        - Updated At: {asset.updated_at}
        - Requester: {asset.requester}
        - Comments: {comments}
        
        -------------------------------------------------------

        Comments:
        {comments}

    

        Best regards and ThankYou,
        {asset.approved_by}
        """
        
        return email_body,email_subject

    @staticmethod
    def format_approval_modification_email_body(asset, comments,asset_category):
        if asset_category == "HARDWARE":
            email_subject = "HARDWARE ASSET MODIFICATION APPROVED"
            heading = "Hardware"
        else:
            email_subject = "SOFTWARE ASSET MODIFICATION APPROVED"
            heading="Software"
        email_body = f"""
        Dear All,

        We are pleased to inform you that the modification of the following {heading} asset has been approved:

        {heading} Asset Details:
        -------------------------------------------------------
       
        - Name: {asset.product_name}
        - Asset UUID: {asset.asset_uuid}
        - Created At: {asset.created_at}
        - Updated At: {asset.updated_at}
        - Comments: {comments}
        - Approval Status Message: {asset.approval_status_message}
        -------------------------------------------------------

        Approval Status Message:
        {asset.approval_status_message}

        

        Best regards and ThankYou,
        {asset.approved_by}
       
        """
        return email_body,email_subject

    @staticmethod
    def format_approval_allocation_email_body(asset, comments,asset_category):
        if asset_category == "HARDWARE":
            email_subject = "HARDWARE ASSET ALLOCATION APPROVED"
            heading = "Hardware"
        else:
             email_subject = "SOFTWARE ASSET ALLOCATION APPROVED"
             heading="Software"
        email_body = f"""
        Dear All,

        We are pleased to inform you that the allocation of the following {heading} asset has been approved:

        {heading} Asset Details:
        -------------------------------------------------------
        
        - Name: {asset.product_name}
        - Asset UUID: {asset.asset_uuid}
        - Created At: {asset.created_at}
        - Updated At: {asset.updated_at}
        - Comments: {comments}
        -------------------------------------------------------

        Approval Status Message
        {asset.approval_status_message}
        

        Please proceed with the next steps as required.

        Best regards,
        {asset.approved_by}
        """
        return email_body,email_subject

    @staticmethod
    def format_approval_deallocation_email_body(asset, comments,asset_category):
        if asset_category == "HARDWARE":
            email_subject = "HARDWARE ASSET DEALLOCATION APPROVED"
            heading = "Hardware"
        else:
             email_subject = "SOFTWARE ASSET DEALLOCATION APPROVED"
             heading="Software"
        email_body = f"""
        
        Dear All,

        We are pleased to inform you that the deallocation of the following {heading} asset has been approved:

        {heading} Asset Details:
        -------------------------------------------------------
        - Asset UUID: {asset.asset_uuid}
        - Name: {asset.product_name}
        - Created At: {asset.created_at}
        - Updated At: {asset.updated_at}
        - Comments: {comments}
        
        -------------------------------------------------------

       Approval Status Message
        {asset.approval_status_message}

        Please proceed with the next steps as required.

        Best regards and ThankYou,
        {asset.approved_by}
       
        """
        return email_body,email_subject

   
