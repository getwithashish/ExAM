from rest_framework.views import APIView
from rest_framework import status
import sentry_sdk
from asset.service.data_import_service.asset_import_service import AssetImportService
from rest_framework.permissions import IsAuthenticated
from asset.utils.file_format_handler.csv_handler import (
    CsvHandler,
)
from asset.utils.file_format_handler.xlsx_handler import (
    XlsxHandler,
)
from exceptions import NotFoundException, ValidationException
from response import APIResponse
from messages import (
    IMPORT_OPERATION_UNSUCCESSFUL,
    INVALID_FILE_TYPE,
    FILE_NOT_FOUND,
    USER_UNAUTHORIZED,
)


class DataImportView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None):
        try:
            if request.user.user_scope not in ["SYSTEM_ADMIN", "MANAGER"]:
                return APIResponse(
                    data={},
                    message=USER_UNAUTHORIZED,
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            user = request.user
            file = request.FILES.get("file")

            file_type = request.query_params.get("file_type", "").lower()
            if file_type.lower() == "csv":
                file_format_handler = CsvHandler
            elif file_type.lower() == "xlsx":
                file_format_handler = XlsxHandler
            else:
                raise ValidationException(
                    {}, INVALID_FILE_TYPE, status.HTTP_400_BAD_REQUEST
                )

            if not file:
                raise NotFoundException({}, FILE_NOT_FOUND, status.HTTP_400_BAD_REQUEST)

            result = AssetImportService.parse_and_add_assets(
                file.read(), user, file_format_handler
            )

            data, message, http_status = AssetImportService.create_import_report(
                result=result,
                file_type=file_type,
                file_format_handler=file_format_handler,
            )

            return APIResponse(
                data=data,
                message=message,
                status=http_status,
            )

        except NotFoundException as e:
            return APIResponse(
                data=str(e),
                message=e.message,
                status=e.status,
            )

        except ValidationException as e:
            return APIResponse(
                data=str(e),
                message=e.message,
                status=e.status,
            )

        except UnicodeDecodeError as e:
            print("Unicode Exception Occured during import: ", e)
            sentry_sdk.capture_exception(e)
            return APIResponse(
                data={},
                message=IMPORT_OPERATION_UNSUCCESSFUL,
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as e:
            print("Exception Occured during Import: ", e)
            sentry_sdk.capture_exception(e)
            return APIResponse(
                data={},
                message=IMPORT_OPERATION_UNSUCCESSFUL,
                status=status.HTTP_400_BAD_REQUEST,
            )
