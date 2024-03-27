
from rest_framework.views import APIView
from asset.service.export_service.export_service import ExportService


class AssetExportView(APIView):

    def get(self, request):
        response = ExportService.export_asset()
        return response
