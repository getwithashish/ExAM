from django.dispatch import Signal



asset_previous_value_signal = Signal()
"""
Signal used to trigger saving the log to the database.
When an asset request is approved, this signal is sent and is received by the receiver that saves the current asset data in the log.
The signal is also sent when an asset is soft-deleted/restored.
"""
