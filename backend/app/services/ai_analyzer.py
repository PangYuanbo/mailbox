import json
from typing import Dict, Any, Optional
import httpx
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class AIAnalyzer:
    def __init__(self):
        self.api_key = settings.OPENROUTER_API_KEY
        self.base_url = settings.OPENROUTER_BASE_URL
        self.model = "anthropic/claude-3-haiku"
        
    async def analyze(self, subject: str, sender: str, content: str) -> Dict[str, Any]:
        prompt = self._create_analysis_prompt(subject, sender, content)
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json",
                        "HTTP-Referer": "http://localhost:3000",
                        "X-Title": "Email Aggregator"
                    },
                    json={
                        "model": self.model,
                        "messages": [
                            {
                                "role": "system",
                                "content": "You are a professional email content editor. Always respond with valid JSON."
                            },
                            {
                                "role": "user",
                                "content": prompt
                            }
                        ],
                        "temperature": 0.3,
                        "max_tokens": 2000
                    },
                    timeout=30.0
                )
                
                response.raise_for_status()
                result = response.json()
                
                content = result["choices"][0]["message"]["content"]
                
                try:
                    return json.loads(content)
                except json.JSONDecodeError:
                    logger.error(f"Failed to parse AI response as JSON: {content}")
                    return self._get_default_analysis()
                    
        except Exception as e:
            logger.error(f"Error analyzing email with AI: {e}")
            return self._get_default_analysis()
    
    def _create_analysis_prompt(self, subject: str, sender: str, content: str) -> str:
        return f"""You are a professional email content editor. Please intelligently process the following email:

Original Email:
Subject: {subject}
Sender: {sender}
Content: {content[:3000]}

Please perform the following tasks:
1. **Content Classification**: Determine email type (AI_NEWS|SHOPPING|EVENT|TECH|FINANCE|OTHER)
2. **Importance Scoring**: Rate 1-10 scale based on content value and timeliness
3. **Markdown Reformatting**: Reorganize content into clean Markdown format
4. **Image Processing**: Extract image URLs, add appropriate alt descriptions
5. **Content Distillation**: Generate concise summary and key points

Return JSON format:
{{
  "category": "classification",
  "importance_score": score,
  "title_optimized": "optimized title",
  "summary": "one-sentence compelling summary",
  "content_markdown": "reformatted Markdown content",
  "key_points": ["key points list"],
  "tags": ["relevant tags"],
  "images": [{{"url": "image_link", "alt": "description", "caption": "title"}}],
  "important_links": ["important links"],
  "reading_time": estimated_minutes,
  "sentiment": "positive|neutral|negative",
  "action_items": ["actionable suggestions"]
}}"""
    
    def _get_default_analysis(self) -> Dict[str, Any]:
        return {
            "category": "OTHER",
            "importance_score": 5,
            "title_optimized": "Email Content",
            "summary": "Email content requires manual review",
            "content_markdown": "Content processing pending",
            "key_points": [],
            "tags": [],
            "images": [],
            "important_links": [],
            "reading_time": 1,
            "sentiment": "neutral",
            "action_items": []
        }