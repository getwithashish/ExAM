# Generated by Django 5.0.2 on 2024-02-19 12:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("asset", "0002_rename_bu_id_businessunit_bu_uuid_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="memory",
            name="memory_space",
            field=models.IntegerField(default=0),
        ),
    ]