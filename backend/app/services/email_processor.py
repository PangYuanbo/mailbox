import re
from typing import Dict, Any
from bs4 import BeautifulSoup
import html2text
import logging

logger = logging.getLogger(__name__)

class EmailProcessor:
    def __init__(self):
        self.html_to_text = html2text.HTML2Text()
        self.html_to_text.ignore_links = False
        self.html_to_text.ignore_images = False
        self.html_to_text.ignore_emphasis = False
        
    async def process(self, raw_content: str) -> str:
        try:
            if self._is_html(raw_content):
                soup = BeautifulSoup(raw_content, 'html.parser')
                
                for element in soup(['script', 'style', 'meta', 'link']):
                    element.decompose()
                
                cleaned_html = str(soup)
                
                markdown_content = self.html_to_text.handle(cleaned_html)
                
                markdown_content = self._clean_markdown(markdown_content)
                
                return markdown_content
            else:
                return self._clean_text(raw_content)
                
        except Exception as e:
            logger.error(f"Error processing email content: {e}")
            return raw_content
    
    def _is_html(self, content: str) -> bool:
        html_patterns = [
            r'<html',
            r'<body',
            r'<div',
            r'<p>',
            r'<br',
            r'<table'
        ]
        
        content_lower = content[:1000].lower()
        return any(re.search(pattern, content_lower) for pattern in html_patterns)
    
    def _clean_markdown(self, markdown: str) -> str:
        lines = markdown.split('\n')
        cleaned_lines = []
        
        for line in lines:
            line = line.strip()
            
            if not line:
                if cleaned_lines and cleaned_lines[-1] != '':
                    cleaned_lines.append('')
                continue
            
            if self._is_footer_content(line):
                continue
            
            cleaned_lines.append(line)
        
        while cleaned_lines and cleaned_lines[-1] == '':
            cleaned_lines.pop()
        
        return '\n'.join(cleaned_lines)
    
    def _clean_text(self, text: str) -> str:
        lines = text.split('\n')
        cleaned_lines = []
        
        for line in lines:
            line = line.strip()
            if line and not self._is_footer_content(line):
                cleaned_lines.append(line)
        
        return '\n\n'.join(cleaned_lines)
    
    def _is_footer_content(self, line: str) -> bool:
        footer_patterns = [
            r'^unsubscribe',
            r'^to unsubscribe',
            r'^click here to unsubscribe',
            r'^manage your preferences',
            r'^update your email preferences',
            r'^copyright',
            r'^all rights reserved',
            r'^sent by',
            r'^this email was sent to',
            r'^powered by'
        ]
        
        line_lower = line.lower()
        return any(re.match(pattern, line_lower) for pattern in footer_patterns)