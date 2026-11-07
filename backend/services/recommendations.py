import logging
from typing import List, Dict, Any, Optional
from schemas.analytics import Recommendation

logger = logging.getLogger("marketpulse.services.recommendations")


class RecommendationService:
    """
    Recommendation engine comparing tech products, evaluating sentiment vs price ratio,
    and highlighting competitive advantages and disadvantages.
    """

    def generate_recommendations(
        self,
        products: List[Any],
        sentiment_data: Optional[Dict[int, Dict[str, Any]]] = None
    ) -> List[Recommendation]:
        """
        Generates data-driven recommendations for a list of products.
        """
        if not products:
            return []

        recommendations: List[Recommendation] = []

        # Calculate category price averages
        category_prices: Dict[str, List[float]] = {}
        for p in products:
            cat = getattr(p, "category", "General")
            category_prices.setdefault(cat, []).append(p.price)

        category_avg: Dict[str, float] = {
            cat: sum(prices) / len(prices) for cat, prices in category_prices.items()
        }

        for p in products:
            p_id = p.id
            cat = getattr(p, "category", "General")
            cat_avg = category_avg.get(cat, p.price)

            # Retrieve sentiment info if available
            p_sentiment = (sentiment_data or {}).get(p_id, {})
            pos_pct = p_sentiment.get("positive", 60.0)
            neg_pct = p_sentiment.get("negative", 15.0)
            avg_score = p_sentiment.get("average_score", 0.3)

            price_diff_pct = ((p.price - cat_avg) / cat_avg) * 100.0 if cat_avg > 0 else 0.0

            pros: List[str] = []
            cons: List[str] = []

            # Determine pros & cons
            if pos_pct >= 65.0:
                pros.append(f"Strong customer satisfaction ({pos_pct}% positive feedback)")
            if p.price < cat_avg:
                pros.append(f"Priced {abs(round(price_diff_pct, 1))}% below category average")
            if getattr(p, "rating", 0) and p.rating >= 4.5:
                pros.append(f"High verified rating ({p.rating} / 5.0)")

            if p.price > cat_avg * 1.15:
                cons.append(f"Carries a {round(price_diff_pct, 1)}% premium over category peers")
            if neg_pct >= 20.0:
                cons.append(f"Elevated negative review ratio ({neg_pct}%)")

            # Recommendation logic
            if pos_pct >= 75.0 and p.price <= cat_avg:
                rec_action = "Strong Buy / Top Recommendation"
                rec_reason = f"Excellent customer sentiment ({pos_pct}%) combined with very competitive pricing."
            elif p.price < cat_avg * 0.9:
                rec_action = "Best Value"
                rec_reason = f"Significantly more accessible than category competitors while maintaining solid reception."
            elif price_diff_pct > 25.0:
                rec_action = "Monitor Price / Wait for Discounts"
                rec_reason = f"High market entry price. Historical discounts are likely during upcoming promotional campaigns."
            elif neg_pct >= 25.0:
                rec_action = "Compare Alternatives"
                rec_reason = f"Noticeable volume of consumer concerns reported regarding hardware or software issues."
            else:
                rec_action = "Recommended"
                rec_reason = f"Balanced option with reliable brand reputation and stable market valuation."

            recommendations.append(
                Recommendation(
                    product_id=p_id,
                    product_name=p.name,
                    recommendation=rec_action,
                    reason=rec_reason,
                    pros=pros or ["Consistent performance in its segment"],
                    cons=cons or ["Standard segment depreciation"],
                    sentiment_score=avg_score,
                    price_score=round(cat_avg / max(p.price, 1.0), 2)
                )
            )

        return recommendations


recommendation_service = RecommendationService()
