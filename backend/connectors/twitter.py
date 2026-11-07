import logging
from typing import List, Dict, Any, Optional
from datetime import datetime

from connectors.base import BaseConnector
from config import settings

logger = logging.getLogger("marketpulse.connectors.twitter")


class TwitterConnector(BaseConnector):
    """
    X (Twitter) Connector for tracking brand mentions and tech sentiment.
    Uses Twitter v2 API when TWITTER_BEARER_TOKEN is configured.
    """

    def __init__(self):
        super().__init__(name="Twitter/X", rate_limit_delay=2.0, timeout=15)
        self.api_url = "https://api.twitter.com/2/tweets/search/recent"

    def search_products(self, query: str, limit: int = 10) -> List[Dict[str, Any]]:
        return self.search_mentions(query, limit=limit)

    def search_mentions(self, query: str, limit: int = 15) -> List[Dict[str, Any]]:
        """
        Searches recent tweets mentioning a brand or tech product.
        """
        bearer_token = settings.TWITTER_BEARER_TOKEN.strip()
        if not bearer_token:
            logger.info("[Twitter/X] TWITTER_BEARER_TOKEN is not configured in .env. Skipping live Twitter search.")
            return []

        headers = {
            "Authorization": f"Bearer {bearer_token}",
            "User-Agent": "MarketPulseAI/1.0"
        }
        params = {
            "query": f"{query} lang:en -is:retweet",
            "max_results": str(min(100, max(10, limit))),
            "tweet.fields": "created_at,public_metrics,author_id"
        }

        logger.info(f"[Twitter/X] Querying live tweets for: '{query}'")
        response = self.fetch_get(self.api_url, params=params, headers=headers)

        if not response:
            logger.warning(f"[Twitter/X] Failed to fetch tweets for query: '{query}'")
            return []

        try:
            data = response.json()
            tweets = data.get("data", [])
            results: List[Dict[str, Any]] = []

            for tw in tweets:
                text = tw.get("text", "")
                metrics = tw.get("public_metrics", {})
                likes = metrics.get("like_count", 0)

                # Estimate rating based on positive engagement
                rating = min(5.0, max(3.0, 3.0 + (likes / 50.0)))

                created_at_str = tw.get("created_at")
                pub_date = None
                if created_at_str:
                    try:
                        pub_date = datetime.fromisoformat(created_at_str.replace("Z", "+00:00"))
                    except Exception:
                        pass

                results.append({
                    "external_id": str(tw.get("id")),
                    "author": f"user_{tw.get('author_id')}",
                    "title": f"Tweet mention of {query}",
                    "content": text,
                    "rating": round(rating, 1),
                    "source": "Twitter",
                    "published_at": pub_date
                })

            logger.info(f"[Twitter/X] Retrieved {len(results)} tweets.")
            return results
        except Exception as exc:
            logger.error(f"[Twitter/X] Error parsing tweet response: {exc}")
            return []


twitter_connector = TwitterConnector()
