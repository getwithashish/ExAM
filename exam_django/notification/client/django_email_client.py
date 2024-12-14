from email.utils import make_msgid
from typing import Optional
from django.core.mail import EmailMessage

from notification.config.email_config import FROM_EMAIL, EMAIL_DOMAIN


class DjangoEmailClient:

    def __init__(self, sender=FROM_EMAIL):
        self.sender = sender

    def send_email(
        self,
        to_recipient_list,
        cc_recipient_list,
        bcc_recipient_list,
        subject,
        body,
        follow_up_id: Optional[str] = None,
    ) -> Optional[str]:

        message_id = make_msgid(domain=EMAIL_DOMAIN)
        headers = {"Message-ID": message_id}

        if follow_up_id:
            headers.update({"In-Reply-To": follow_up_id})

        email = EmailMessage(
            subject=subject,
            body=body,
            from_email=self.sender,
            to=to_recipient_list,
            cc=cc_recipient_list,
            bcc=bcc_recipient_list,
            headers=headers,
        )

        is_email_sent = email.send()

        return message_id if is_email_sent == 1 else None


django_email_client = DjangoEmailClient()
