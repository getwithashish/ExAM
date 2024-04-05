from django.http import HttpResponse
from rest_framework.views import APIView
from asset.service.export_service.export_service import ExportService

class AssetExportView(APIView):
    def get(self, request):
        # Retrieve the export format from query parameters or default to 'csv'
        export_format = request.GET.get('format', 'csv')
        
        # Ensure the ExportService is correctly called with the specified format
        if export_format in ['csv', 'xlsx', 'pdf']:
            response = ExportService.export_asset(format=export_format)
            return response
        else:
            return HttpResponse("Invalid export format specified", status=400)
