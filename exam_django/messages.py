# Global Exception Messages
GLOBAL_500_EXCEPTION_ERROR = "Something unexpected occurred while processing your request. Please try again later."
BAD_REQUEST_ERROR = "The server has encountered a validation error"
DATABASE_ERROR = "Database is exhausted."

# Global Success Messages
PAGINATED_RESPONSE_RETRIEVED_SUCESSFULLY = "Paginated response sucessfully retrieved."

# User Exception Messages
USER_NOT_FOUND_ERROR = "User not found in the request. Please try again."
INVALID_USER_DETAILS_ERROR = (
    "The provided details do not match. Please check the details and try again."
)
USERS_RETRIEVAL_UNSUCCESSFUL = (
    "The list of user couldn't be retrieved. Please try again."
)
USER_UNAUTHORIZED = "User does not have permission to perform this action"
EMPLOYEE_NOT_FOUND_ERROR = "Employee is not found in the request. Please try again."
EMPLOYEE_SUCCESSFULLY_CREATED = "Employee has been created successfully."
USER_UNAUTHORIZED = "User does not have permission to perform this action"
EMPLOYEE_NOT_FOUND_ERROR = "Employee is not found in the request. Please try again."
EMPLOYEE_CREATION_UNSUCCESSFUL = (
    "Error while creating an employee.Please try again later."
)

# User Success Messages
USER_FOUND_SUCCESS = "User found. Success."
USER_DETAILS_VALIDATED_SUCCESSFULLY = "The provided details match with the database."
USERS_RETRIEVED_SUCCESSFULLY = "List of users retrieved successfully."
PAGINATED_RESPONSE_RETRIEVED_SUCESSFULLY = "Paginated response sucessfully retrieved."
# Asset Management - Error Messages
ASSET_NOT_FOUND = (
    "The requested asset could not be found. Please review the details and try again."
)
ASSET_CREATED_UNSUCCESSFUL = "Error while creating an asset. Please try again later."
ASSET_UPDATION_UNSUCCESSFUL = "Error while updating asset details. Please try again."
ASSET_PARAM_EXCEPTION_ERROR = (
    "The provided asset parameters do not match. Please check and try again."
)
INVALID_ASSET_DATA = (
    "The provided asset data is invalid. Please correct the information and try again."
)
ASSET_REJECTED_SUCCESSFUL = "Asset has been successfully rejected."
ASSET_CREATED_UNSUCCESSFUL = "Error while creating an asset. Please try again later."
ASSET_UPDATION_UNSUCCESSFUL = "Error while updating asset details. Please try again."
ASSET_ASSIGNMENT_FAILED = "Failed to assign asset. Please try again."
BUSINESS_UNIT_CREATED_UNSUCCESSFUL = (
    "Error while creating business unit.Please try again later."
)
MEMORY_CREATED_UNSUCCESSFUL = "Error while creating memory.Please try again later."
EMPLOYEE_CREATION_UNSUCCESSFUL = (
    "Error while creating an employee.Please try again later."
)
# Asset Management - Success Messages
ASSET_LIST_SUCCESSFULLY_RETRIEVED = "Asset list is successfully retreived."
ASSET_LIST_RETRIEVAL_UNSUCCESSFUL = (
    "Asset list failed to be retrieved. Please try again."
)
ASSET_COUNT_RETRIEVAL_UNSUCCESSFUL = (
    "Asset count failed to be retrieved. Please try again."
)
ASSET_ASSIGNMENT_FAILED = "Failed to assign asset. Please try again."

# Asset Success Messages
ASSET_LIST_SUCCESSFULLY_RETRIEVED = "Asset list is successfully retreived."
ASSET_FIELD_VALUE_LIST_SUCCESSFULLY_RETRIEVED = (
    "Asset field value list is successfully retrieved"
)
ASSET_COUNT_RETRIEVAL_UNSUCCESSFUL = (
    "Asset count failed to be retrieved. Please try again."
)
ASSET_ASSIGNMENT_FAILED = "Failed to assign asset. Please try again."

ASSET_FIELD_VALUE_QUERY_PARAM_NOT_FOUND = (
    "No valid Asset Field Value Query Param was found"
)
ASSET_FIELD_NOT_FOUND = "No valid Asset Field was found"
ASSET_FIELD_NOT_FILTERABLE = "Asset Field is not filterable"

# Asset Success Messages
ASSET_LIST_SUCCESSFULLY_RETRIEVED = "Asset list is successfully retreived."
ASSET_ASSIGNING_PENDING = "Asset Allocation Request Successfully Sent. Approval required to complete the allocation."
ASSET_UNASSIGNING_PENDING = "Asset Deallocation Request Successfully Sent. Approval required to complete the deallocation."
ASSET_COUNT_SUCCESSFULLY_RETRIEVED = "Asset count is successfully retreived."
ASSET_CREATE_PENDING_SUCCESSFUL = "Asset Creation Request Successfully Sent. Approval required to complete the creation."
ASSET_UPDATE_PENDING_SUCCESSFUL = "Asset Updation Request Successfully Sent. Approval required to complete the updation."

AI_RESPONSE_OBTAINED_SUCCESSFULLY = "AI Response is successfully obtained."

# Asset Rejection Messages
ASSET_CREATION_REJECTED = "Asset Creation Rejected"
ASSET_UPDATION_REJECTED = "Asset Modification Rejected"
ASSIGN_ASSET_REJECT_SUCCESSFUL = "Asset Allocation Rejected"
UNASSIGN_ASSET_REJECT_SUCCESSFUL = "Asset Deallocation Rejected"


# Approval Exception Messages
APPROVAL_TYPE_NOT_FOUND = (
    "Specified approval type is not valid. Try with correct value."
)
CANNOT_APPROVE_ACKNOWLEDGED_ASSET = "Cannot Approve already acknowledged asset"
CANNOT_REJECT_ACKNOWLEDGED_ASSET = "Cannot Reject already acknowledged asset"
CANNOT_ASSIGN_UNAPPROVED_ASSET = "Cannot Allocate asset which is not approved"
CANNOT_UNASSIGN_UNAPPROVED_ASSET = "Cannot Deallocate asset which is not approved"

# Approval Success Messages
ASSET_SUCCESSFULLY_CREATED = "Asset Creation Approved"
ASSET_SUCCESSFULLY_UPDATED = "Asset Modification Approved"
ASSET_SUCCESSFULLY_ASSIGNED = "Asset Allocation Approved"
ASSET_SUCCESSFULLY_UNASSIGNED = "Asset Deallocation Approved"

ASSET_DELETION_SUCCESSFUL = "Asset Deleted"
ASSET_RESTORATION_SUCCESSFUL = "Asset Restored"

# Asset Type Exception Messages
INVALID_ASSET_TYPE = "The given asset type is invalid."
ASSET_TYPE_RETRIEVE_FAILURE = "The given asset type was not found."

INVALID_FILE_TYPE = "Invalid file type. Give a valid file type"

# Asset Type Success Messages
VALID_ASSET_TYPE = "You have entered a valid asset type."
ASSET_TYPE_RETRIEVE_SUCCESS = "Asset type was successfully retrieved."

# Asset Log Exception Messages
ASSET_LOG_ERROR = "Something went wrong while adding data to the asset log."
NO_ASSET_LOGS_IN_TIMELINE = "No assets were found in the given timeline."

# Asset Log Success Messages
ASSET_LOG_FOUND = "Asset log found successfully."

# Memory Exception Messages
MEMORY_CREATION_UNSUCCESSFUL = "Memory creation is unsuccessful"
MEMORY_CREATED_UNSUCCESSFUL = "Error while creating memory.Please try again later."
MEMORY_EXISTS = "Memory already exists"

# Memory Success Messages
MEMORY_CREATION_SUCCESSFUL = "Memory creation is successful"
MEMORY_SUCCESSFULLY_CREATED = "Memory sucessfully created."
MEMORY_SUCCESSFULLY_RETRIEVED = "Memory details sucessfully retrieved."

# Business Unit Exception Messages
BUSINESS_UNIT_CREATED_UNSUCCESSFUL = (
    "Error while creating business unit.Please try again later."
)
UNAUTHORIZED_NO_PERMISSION = (
    "Unauthorized. You do not have permission to assign assets."
)
STATUS_EXPIRED_OR_DISPOSED = "Cannot assign the asset. Status is Damaged, Repair or Scrap."
CANNOT_REQUEST_ASSIGN_FOR_ASSETS_IN_ASSIGN_PENDING = "Cannot request for assignment for assets which are already in pending state"
CANNOT_REQUEST_UNASSIGN_FOR_ASSETS_IN_ASSIGN_PENDING = "Cannot request for unassignment for assets which are already in pending state"

# Business Unit Success Messages
BUSINESS_UNIT_SUCCESSFULLY_CREATED = "Business unit sucessfully created."
MEMORY_SUCCESSFULLY_CREATED = "Memory sucessfully created."
BUSINESS_UNIT_SUCCESSFULLY_RETRIEVED = "Business Unit details sucessfully retrieved."
MEMORY_SUCCESSFULLY_RETRIEVED = "Memory details sucessfully retrieved."
EMPLOYEE_DETAILS_SUCCESSFULLY_RETRIEVED = "Employee details sucessfully retrieved"
EMPLOYEE_DETAILS_FOUND = "Employee details retrieved based on specified search criteria"
# Asset Type -Success/Invalid Messages
VALID_ASSET_TYPE = "You have entered a valid asset type."
INVALID_ASSET_TYPE = "The given asset type is invalid."
ASSET_TYPE_RETRIEVE_SUCCESS = "Asset type was successfully retrieved."
ASSET_TYPE_RETRIEVE_FAILURE = "The given asset type was not found."
# URL Exception Messages
INVALID_URL_ERROR = "The requested URL is invalid. Please verify and try again."
URL_DOES_NOT_EXIST = "The requested URL does not exist. Please verify and try again."
URL_REQUEST_FAILED = "Failed to process the request for the URL."
URL_PERMISSION_DENIED = "You do not have permission to access the requested URL."
URL_TIMEOUT_ERROR = "The request to the URL timed out. Please try again."
URL_CONNECTION_ERROR = "Failed to establish a connection to the URL. Please try again."
URL_SERVER_ERROR = "The server encountered an error while processing the request for the URL. Please try again later."

# Location Messages
LOCATION_RETRIEVED_SUCCESSFULLY = "Successfully retrived locations "
LOCATION_RETRIEVAL_FAILED = "Failed to retrieve locations "
LOCATION_CREATED_SUCCESSFULLY = "Location inserted successfully"
LOCATION_CREATION_FAILED = "Duplicate value cannot be inserted "

FILE_NOT_FOUND = "File is not found"
FILE_FOUND = "File found"
# Parse messages

VALID_CSV_FILE_TYPE = "Valid csv file type."
INVALID_CSV_FILE_TYPE = (
    "Unable to decode file content. Make sure it's a valid CSV file."
)
FILE_NOT_FOUND = "File is not found"
FILE_FOUND = "File found"


# Memory messages
MEMORY_CREATION_SUCCESSFUL = "Memory creation is successful"
MEMORY_CREATION_UNSUCCESSFUL = "Memory creation is unsuccessful"
MEMORY_SUCCESSFULLY_RETRIEVED = "Memory retrieved succesfully"
MEMORY_EXISTS = "Memory already exists"
