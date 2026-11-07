import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
from connectors.base import BaseConnector

logger = logging.getLogger("marketpulse.connectors.alternative_reviews")


class AlternativeReviewsConnector(BaseConnector):
    """
    Alternative source for tech reviews and consumer sentiment.
    Specifically solves access bottlenecks and strict API quotas from platforms like Reddit/X.
    Utilizes open, zero-auth public tech intelligence channels:
    1. Hacker News Search API (Algolia) - high-density developer & consumer tech opinions.
    2. Open Tech Community forums & structured RSS feeds.
    """

    def __init__(self):
        super().__init__(name="AlternativeReviews", rate_limit_delay=1.0, timeout=15)
        self.hn_api_url = "https://hn.algolia.com/api/v1/search"

    def search_products(self, query: str, limit: int = 10) -> List[Dict[str, Any]]:
        return self.fetch_tech_discussions(query, limit=limit)

    def fetch_tech_discussions(self, query: str, limit: int = 15) -> List[Dict[str, Any]]:
        """
        Fetches authentic tech discussions and consumer impressions regarding a product.
        Uses Hacker News Algolia Search API without requiring authentication keys.
        """
        logger.info(f"[AlternativeReviews] Querying open tech discussions for '{query}'...")
        params = {
            "query": query,
            "hitsPerPage": str(limit)
        }

        response = self.fetch_get(self.hn_api_url, params=params)
        if not response:
            logger.warning(f"[AlternativeReviews] Failed to fetch discussions for query '{query}'")
            return []

        try:
            data = response.json()
            hits = data.get("hits", [])
            results: List[Dict[str, Any]] = []

            for h in hits:
                title = h.get("title") or h.get("story_title") or f"Discussion on {query}"
                comment_text = h.get("comment_text") or h.get("story_text") or ""

                # Strip basic html tags from comment_text if present
                clean_content = comment_text.replace("<p>", "\n").replace("</p>", "").replace("&#x27;", "'").replace("&quot;", '"')
                full_text = f"{title}\n{clean_content}".strip()

                if len(full_text) < 20:
                    continue

                points = h.get("points") or 1
                # Synthesize a 1.0 - 5.0 score based on upvotes and engagement
                rating = min(5.0, max(3.5, 3.5 + (points / 100.0)))

                created_at_str = h.get("created_at")
                pub_date = None
                if created_at_str:
                    try:
                        pub_date = datetime.fromisoformat(created_at_str.replace("Z", "+00:00"))
                    except Exception:
                        pass

                results.append({
                    "external_id": str(h.get("objectID")),
                    "author": h.get("author", "TechCommunityUser"),
                    "title": title[:200],
                    "content": full_text[:2000],
                    "rating": round(rating, 1),
                    "source": "TechCommunity",
                    "url": h.get("url") or f"https://news.ycombinator.com/item?id={h.get('objectID')}",
                    "published_at": pub_date
                })

            logger.info(f"[AlternativeReviews] Successfully extracted {len(results)} tech opinions.")
            return results
        except Exception as exc:
            logger.error(f"[AlternativeReviews] Error parsing open discussions: {exc}")
            return []


alternative_reviews_connector = AlternativeReviewsConnector()
