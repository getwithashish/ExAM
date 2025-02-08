from typing import Dict, Optional, Tuple
from asset.models import Asset, AssetType
from django.db.models import Count
from rest_framework import status
from rest_framework import serializers
from messages import ASSET_COUNT_SUCCESSFULLY_RETRIEVED


class AssetCountService:
    """
    Service class to retrieve asset counts based on various filters and conditions.
    """

    serializer_class: serializers.Serializer

    def get_asset_count(query: Optional[str]) -> Tuple[Dict, str, int]:
        """
        Retrieves counts of assets based on their status, detail status, assignment status, and asset type.

        Args:
            query (Optional[str]): The type of asset to filter by.

        Returns:
            Tuple[Dict, str, int]: A tuple containing the response data, a success message, and the HTTP status code.
        """
        asset_type = query

        queryset = Asset.objects.all().filter(is_deleted=False)
        if asset_type:
            queryset = queryset.filter(asset_type=asset_type)

        status_counts = queryset.values("status").annotate(count=Count("status"))
        detail_status_counts = queryset.values("asset_detail_status").annotate(
            count=Count("asset_detail_status")
        )
        assign_status_counts = queryset.values("assign_status").annotate(
            count=Count("assign_status")
        )

        asset_type_counts = queryset.values("asset_type").annotate(
            count=Count("asset_type")
        )

        asset_types = AssetType.objects.all().values("id", "asset_type_name")

        asset_type_names = {
            asset_type["id"]: asset_type["asset_type_name"]
            for asset_type in asset_types
        }

        # Process asset_type_counts queryset to create a dictionary
        asset_type_counts_with_names = {}
        for asset_type_count in asset_type_counts:
            asset_type_id = asset_type_count["asset_type"]
            count = asset_type_count["count"]
            asset_type_name = asset_type_names.get(
                asset_type_id, asset_type_id
            )  # Use asset_type_id if name not found
            asset_type_counts_with_names[asset_type_name] = {
                "id": asset_type_id,
                "count": count,
            }

        total_assets = queryset.count()

        response_data = {
            "total_assets": total_assets,
            "status_counts": {item["status"]: item["count"] for item in status_counts},
            "asset_detail_status": {
                item["asset_detail_status"]: item["count"]
                for item in detail_status_counts
            },
            "assign_status": {
                item["assign_status"]: item["count"] for item in assign_status_counts
            },
            "asset_type_counts": asset_type_counts_with_names,  # Use the modified counts with names
        }

        return (
            response_data,
            ASSET_COUNT_SUCCESSFULLY_RETRIEVED,
            status.HTTP_200_OK,
        )
