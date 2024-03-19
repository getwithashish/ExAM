from django.core.mail import send_mail

from notification.config.EmailConfig import FROM_EMAIL


class EmailClient:

    def __init__(self, sender=FROM_EMAIL):
        self.sender = sender

    def send_email(self, subject, message, recipient_list):
        send_mail(
            subject=subject,
            message=message,
            from_email=self.sender,
            recipient_list=recipient_list,
        )
