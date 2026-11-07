import re
import html
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import func

from database.models import Product, Review
from connectors.emag import emag_connector
from connectors.reddit import reddit_connector
from connectors.alternative_reviews import alternative_reviews_connector
from connectors.twitter import twitter_connector
from services.sentiment_analysis import sentiment_service

logger = logging.getLogger("marketpulse.data_collection.reviews")


class ReviewCollector:
    """
    Orchestrates the multi-source collection, cleaning, deduplication,
    sentiment enrichment, and database persistence of customer reviews.
    """

    def __init__(self):
        self.connectors = {
            "emag": emag_connector,
            "reddit": reddit_connector,
            "alternative": alternative_reviews_connector,
            "twitter": twitter_connector
        }

    def clean_text(self, text: str) -> str:
        """
        Cleans raw review text: unescapes HTML, strips URLs and excessive whitespaces.
        """
        if not text:
            return ""

        # Unescape HTML entities (&amp;, &quot;, &#39;, etc.)
        cleaned = html.unescape(text)

        # Remove html tags
        cleaned = re.sub(r"<[^>]+>", " ", cleaned)

        # Remove raw URLs
        cleaned = re.sub(r"https?://\S+|www\.\S+", "", cleaned)

        # Collapse whitespace
        cleaned = re.sub(r"\s+", " ", cleaned).strip()

        return cleaned

    def _simplify_search_query(self, name: str, brand: str) -> str:
        """
        Strips catalog noise (e.g. 'Telefon mobil', 'Dual SIM', storage specs)
        to form an accurate discussion search keyword (e.g. 'Apple iPhone 15').
        """
        clean = re.sub(r"(?i)\b(telefon\s+mobil|casti\s+audio|placa\s+video|laptop)\b", "", name)
        clean = re.sub(r"(?i)\b\d+GB\b|\b\d+TB\b|\bDual\s+SIM\b|\b5G\b|\b4G\b|\bBlack\b|\bBlue\b|\bWhite\b", "", clean)
        clean = re.sub(r"[,;]+", " ", clean)
        clean = re.sub(r"\s+", " ", clean).strip()
        if not clean or len(clean) < 3:
            return f"{brand} {name}".strip()
        return clean

    def collect_for_product(
        self,
        product: Product,
        db: Session,
        sources: Optional[List[str]] = None,
        limit_per_source: int = 10
    ) -> Dict[str, Any]:
        """
        Collects reviews from selected sources for a specific product,
        deduplicates, performs sentiment analysis, and persists to DB.
        """
        target_sources = sources or ["alternative", "reddit", "emag"]
        collected_raw: List[Dict[str, Any]] = []

        logger.info(f"[ReviewCollector] Initiating review gathering for '{product.name}' (ID: {product.id})")

        # 1. Gather from connectors
        search_term = self._simplify_search_query(product.name, product.brand)

        if "emag" in target_sources and product.source_url and "emag.ro" in product.source_url:
            emag_revs = emag_connector.fetch_product_reviews(product.source_url, max_reviews=limit_per_source)
            collected_raw.extend(emag_revs)

        if "alternative" in target_sources:
            alt_revs = alternative_reviews_connector.fetch_tech_discussions(search_term, limit=limit_per_source)
            collected_raw.extend(alt_revs)

        if "reddit" in target_sources:
            reddit_revs = reddit_connector.search_discussions(search_term, limit=limit_per_source)
            collected_raw.extend(reddit_revs)

        if "twitter" in target_sources:
            tw_revs = twitter_connector.search_mentions(search_term, limit=limit_per_source)
            collected_raw.extend(tw_revs)

        # 2. Clean, deduplicate, and enrich with sentiment
        new_reviews_added = 0
        existing_contents = {
            r[0].strip().lower() for r in db.query(Review.content).filter(Review.product_id == product.id).all()
        }

        for rev_data in collected_raw:
            raw_content = rev_data.get("content", "")
            cleaned = self.clean_text(raw_content)

            if len(cleaned) < 15:
                continue

            # Deduplication check
            content_key = cleaned.lower()
            if content_key in existing_contents:
                continue
            existing_contents.add(content_key)

            # Sentiment Analysis
            analysis = sentiment_service.analyze_text(cleaned)

            new_review = Review(
                product_id=product.id,
                source=rev_data.get("source", "Web"),
                external_id=str(rev_data.get("external_id") or ""),
                author=rev_data.get("author", "Verified Consumer"),
                rating=rev_data.get("rating"),
                title=rev_data.get("title"),
                content=cleaned,
                sentiment_score=analysis["score"],
                sentiment_label=analysis["label"],
                aspects=analysis["aspects"],
                published_at=rev_data.get("published_at") or datetime.utcnow()
            )

            db.add(new_review)
            new_reviews_added += 1

        db.commit()

        # 3. Recalculate product rating & review count
        self._update_product_aggregates(product.id, db)

        logger.info(f"[ReviewCollector] Saved {new_reviews_added} new reviews for '{product.name}'")
        return {
            "product_id": product.id,
            "product_name": product.name,
            "reviews_added": new_reviews_added,
            "sources_queried": target_sources
        }

    def _update_product_aggregates(self, product_id: int, db: Session) -> None:
        """
        Recalculates product review count and average rating.
        """
        count = db.query(func.count(Review.id)).filter(Review.product_id == product_id).scalar() or 0
        avg_rating = db.query(func.avg(Review.rating)).filter(
            Review.product_id == product_id,
            Review.rating > 0
        ).scalar()

        product = db.query(Product).filter(Product.id == product_id).first()
        if product:
            product.review_count = count
            if avg_rating:
                product.rating = round(float(avg_rating), 1)
            db.commit()


review_collector = ReviewCollector()
