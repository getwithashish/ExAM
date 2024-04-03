from notification.client.email_client import EmailClient


class EmailService:

    def send_email(self, subject, message, recipient_list):
        email_client = EmailClient()
        email_client.send_email(subject, message, recipient_list)
