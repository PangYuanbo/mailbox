import asyncio
import email
from email.message import EmailMessage
from aiosmtpd.controller import Controller
from aiosmtpd.smtp import SMTP as SMTPServer
from typing import Optional
import logging
from datetime import datetime
import httpx
from app.core.config import settings

logger = logging.getLogger(__name__)

class EmailHandler:
    async def handle_DATA(self, server, session, envelope):
        try:
            sender = envelope.mail_from
            
            if not self._is_sender_allowed(sender):
                logger.warning(f"Rejected email from unauthorized sender: {sender}")
                return "550 Sender not authorized"
            
            msg = email.message_from_bytes(envelope.content)
            
            subject = msg.get("Subject", "No Subject")
            sender_name = self._extract_sender_name(msg.get("From", ""))
            content = self._extract_content(msg)
            
            await self._forward_to_api({
                "subject": subject,
                "sender_email": sender,
                "sender_name": sender_name,
                "raw_content": content
            })
            
            logger.info(f"Email received and processed from {sender}")
            return "250 Message accepted for delivery"
            
        except Exception as e:
            logger.error(f"Error handling email: {e}")
            return "500 Internal server error"
    
    def _is_sender_allowed(self, sender: str) -> bool:
        if not settings.ALLOWED_SENDERS:
            return True
        
        sender_lower = sender.lower()
        return any(
            allowed.lower() in sender_lower 
            for allowed in settings.ALLOWED_SENDERS
        )
    
    def _extract_sender_name(self, from_header: str) -> Optional[str]:
        if "<" in from_header:
            return from_header.split("<")[0].strip().strip('"')
        return None
    
    def _extract_content(self, msg: EmailMessage) -> str:
        content_parts = []
        
        if msg.is_multipart():
            for part in msg.walk():
                content_type = part.get_content_type()
                
                if content_type == "text/plain":
                    try:
                        content_parts.append(part.get_payload(decode=True).decode())
                    except:
                        pass
                elif content_type == "text/html":
                    try:
                        content_parts.append(part.get_payload(decode=True).decode())
                    except:
                        pass
        else:
            try:
                content_parts.append(msg.get_payload(decode=True).decode())
            except:
                content_parts.append(msg.get_payload())
        
        return "\n\n".join(content_parts)
    
    async def _forward_to_api(self, email_data: dict):
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "http://localhost:8000/api/v1/emails/receive",
                    json=email_data,
                    timeout=10.0
                )
                response.raise_for_status()
        except Exception as e:
            logger.error(f"Failed to forward email to API: {e}")

class EmailReceiver:
    def __init__(self):
        self.handler = EmailHandler()
        self.controller = None
    
    async def start(self):
        self.controller = Controller(
            self.handler,
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT
        )
        
        self.controller.start()
        logger.info(f"SMTP server started on {settings.SMTP_HOST}:{settings.SMTP_PORT}")
    
    async def stop(self):
        if self.controller:
            self.controller.stop()
            logger.info("SMTP server stopped")

async def run_email_receiver():
    receiver = EmailReceiver()
    await receiver.start()
    
    try:
        while True:
            await asyncio.sleep(1)
    except KeyboardInterrupt:
        await receiver.stop()

if __name__ == "__main__":
    asyncio.run(run_email_receiver())