import time
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime

from connectors.base import BaseConnector
from config import settings

logger = logging.getLogger("marketpulse.connectors.reddit")


class RedditConnector(BaseConnector):
    """
    Reddit Discussions & Sentiment Connector.
    Supports both Public JSON queries (zero-auth mode) and authenticated API mode
    to navigate Reddit's access restrictions effectively.
    """

    def __init__(self):
        super().__init__(name="Reddit", rate_limit_delay=2.0, timeout=15)
        self.headers = {
            "User-Agent": settings.REDDIT_USER_AGENT or "MarketPulseAI/1.0 (Tech Intelligence Bot)"
        }
        self.subreddits = ["technology", "gadgets", "hardware", "apple", "android", "Romania"]

    def search_products(self, query: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Searches Reddit posts discussing the given product or brand.
        """
        return self.search_discussions(query, limit=limit)

    def search_discussions(self, query: str, subreddit: Optional[str] = None, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Searches posts discussing a product or tech topic across relevant subreddits.
        Uses Reddit's public .json API endpoints.
        """
        if subreddit:
            search_url = f"https://www.reddit.com/r/{subreddit}/search.json"
            params = {"q": query, "restrict_sr": "1", "sort": "relevance", "limit": str(limit)}
        else:
            search_url = "https://www.reddit.com/search.json"
            params = {"q": f"{query} (review OR impressions OR hands-on)", "sort": "relevance", "limit": str(limit)}

        logger.info(f"[Reddit] Querying public discussions for '{query}'...")
        response = self.fetch_get(search_url, params=params, headers=self.headers)

        if not response:
            logger.warning(f"[Reddit] Could not retrieve public JSON from Reddit for '{query}'. Access might be rate-limited.")
            return []

        try:
            payload = response.json()
            posts = payload.get("data", {}).get("children", [])
            items: List[Dict[str, Any]] = []

            for p in posts:
                data = p.get("data", {})
                title = data.get("title", "")
                selftext = data.get("selftext", "")
                content = f"{title}\n\n{selftext}".strip()

                if not content or len(content) < 15:
                    continue

                upvote_ratio = data.get("upvote_ratio", 0.8)
                # Map upvote ratio (0.0 to 1.0) to 1.0-5.0 scale
                rating = round(1.0 + (upvote_ratio * 4.0), 1)

                created_utc = data.get("created_utc")
                published_at = datetime.utcfromtimestamp(created_utc) if created_utc else None

                items.append({
                    "external_id": data.get("id"),
                    "author": f"u/{data.get('author', 'redditor')}",
                    "title": title,
                    "content": content,
                    "rating": rating,
                    "score": data.get("score", 0),
                    "num_comments": data.get("num_comments", 0),
                    "permalink": f"https://www.reddit.com{data.get('permalink', '')}",
                    "published_at": published_at,
                    "source": "Reddit"
                })

            logger.info(f"[Reddit] Retrieved {len(items)} discussions for '{query}'")
            return items
        except Exception as exc:
            logger.error(f"[Reddit] Failed to parse Reddit response: {exc}")
            return []


reddit_connector = RedditConnector()
