from django.test import TestCase
from asset.models import AssetType
from asset.serializers import AssetTypeSerializer


class AssetTypeSerializerTestCase(TestCase):
    def setUp(self):
        # Create sample data for testing
        self.asset_type_data = {
            "asset_type_name": "Test Asset Type"
        }

    def test_asset_type_serializer(self):
        # Serialize the sample data
        serializer = AssetTypeSerializer(data=self.asset_type_data)
        self.assertTrue(serializer.is_valid())

        # Check that serialization is correct
        self.assertEqual(serializer.validated_data["asset_type_name"], "Test Asset Type")
