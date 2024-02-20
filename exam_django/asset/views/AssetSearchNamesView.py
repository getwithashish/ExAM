from django.http import JsonResponse
from django.views import View
from asset.models import Asset

class AssetSearchByNameView(View):
    def get(self, request):
        query_param = request.GET.get('q')
        if query_param:
            assets = Asset.objects.filter(product_name__icontains=query_param)
        else:
            assets = Asset.objects.all()
        
        data = list(assets.values())
        return JsonResponse(data, safe=False)
