import re
import logging
from typing import Dict, Any, List, Optional
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

logger = logging.getLogger("marketpulse.services.sentiment")


class SentimentAnalysisService:
    """
    NLP Sentiment Analysis engine tailored for tech products, consumer reviews,
    and market discussions.
    """

    def __init__(self):
        self.analyzer = SentimentIntensityAnalyzer()
        # Tech domain lexicon adjustments
        self._custom_tech_lexicon = {
            "lag": -2.5,
            "laggy": -2.8,
            "stutter": -2.0,
            "overheating": -3.0,
            "overheat": -2.8,
            "throttling": -2.2,
            "bloatware": -2.4,
            "overpriced": -2.5,
            "buggy": -2.6,
            "drain": -2.0,
            "battery drain": -2.8,
            "crisp": 2.2,
            "fluid": 2.5,
            "snappy": 2.8,
            "beast": 3.0,
            "flagship": 2.0,
            "stunning": 3.2,
            "masterpiece": 3.5,
            "worth": 2.0,
            "premium": 2.6,
            "durable": 2.5,
        }
        self.analyzer.lexicon.update(self._custom_tech_lexicon)

        # Tech aspects dictionary for opinion extraction
        self.aspect_patterns = {
            "battery": [r"\bbattery\b", r"\bautonomie\b", r"\bcharging\b", r"\bincarcare\b", r"\bbaterie\b"],
            "camera": [r"\bcamera\b", r"\bphoto\b", r"\bfoto\b", r"\bpoze\b", r"\blens\b", r"\bsenor\b", r"\bvideo\b"],
            "display": [r"\bdisplay\b", r"\becran\b", r"\bscreen\b", r"\boled\b", r"\bamoled\b", r"\b120hz\b", r"\brefresh rate\b"],
            "performance": [r"\bperformance\b", r"\bperformanta\b", r"\bspeed\b", r"\bviteza\b", r"\bprocessor\b", r"\bcpu\b", r"\bgpu\b", r"\bram\b", r"\bfps\b"],
            "price_value": [r"\bprice\b", r"\bpret\b", r"\bvalue\b", r"\bcost\b", r"\bexpensive\b", r"\bscump\b", r"\bieftin\b", r"\bworth\b"],
            "build_quality": [r"\bbuild\b", r"\bdesign\b", r"\bconstructie\b", r"\bmaterials\b", r"\bmateriale\b", r"\bweight\b", r"\bgreutate\b"],
            "software": [r"\bsoftware\b", r"\bos\b", r"\bios\b", r"\bandroid\b", r"\bwindows\b", r"\bui\b", r"\bupdates\b", r"\bupdate\b"],
            "audio": [r"\baudio\b", r"\bsound\b", r"\bsunet\b", r"\bspeaker\b", r"\bdifuzor\b", r"\bmicrophone\b", r"\bmic\b", r"\bbass\b"]
        }

    def analyze_text(self, text: str) -> Dict[str, Any]:
        """
        Analyzes a single review text string.
        Returns sentiment scores and detected tech aspects.
        """
        if not text or not text.strip():
            return {
                "score": 0.0,
                "label": "neutral",
                "pos": 0.0,
                "neu": 1.0,
                "neg": 0.0,
                "aspects": {}
            }

        scores = self.analyzer.polarity_scores(text)
        compound = scores["compound"]

        if compound >= 0.05:
            label = "positive"
        elif compound <= -0.05:
            label = "negative"
        else:
            label = "neutral"

        # Aspect extraction
        extracted_aspects = self._extract_aspects(text)

        return {
            "score": round(compound, 3),
            "label": label,
            "pos": round(scores["pos"], 3),
            "neu": round(scores["neu"], 3),
            "neg": round(scores["neg"], 3),
            "aspects": extracted_aspects
        }

    def _extract_aspects(self, text: str) -> Dict[str, Dict[str, Any]]:
        """
        Extracts mentions of specific aspects (battery, camera, display, etc.)
        and analyzes the local sentence sentiment for that aspect.
        """
        results = {}
        sentences = re.split(r"[.!?\n]+", text.lower())

        for aspect, patterns in self.aspect_patterns.items():
            aspect_sentences = []
            for s in sentences:
                if any(re.search(p, s) for p in patterns):
                    aspect_sentences.append(s)

            if aspect_sentences:
                combined_aspect_text = " ".join(aspect_sentences)
                aspect_score = self.analyzer.polarity_scores(combined_aspect_text)["compound"]
                if aspect_score >= 0.05:
                    asp_label = "positive"
                elif aspect_score <= -0.05:
                    asp_label = "negative"
                else:
                    asp_label = "neutral"

                results[aspect] = {
                    "sentiment": asp_label,
                    "score": round(aspect_score, 3),
                    "mentions": len(aspect_sentences)
                }

        return results

    def aggregate_reviews(self, product_id: int, product_name: Optional[str], reviews: List[Any]) -> Dict[str, Any]:
        """
        Aggregates sentiments across a list of reviews (either ORM Review objects or dicts).
        """
        total = len(reviews)
        if total == 0:
            return {
                "product_id": product_id,
                "product_name": product_name,
                "positive": 0.0,
                "neutral": 100.0,
                "negative": 0.0,
                "total_reviews": 0,
                "average_score": 0.0,
                "aspect_insights": {}
            }

        pos_count = 0
        neu_count = 0
        neg_count = 0
        score_sum = 0.0
        aspect_aggregation: Dict[str, Dict[str, int]] = {}

        for rev in reviews:
            score = getattr(rev, "sentiment_score", None)
            label = getattr(rev, "sentiment_label", None)
            aspects = getattr(rev, "aspects", None)

            # If review hasn't been pre-analyzed, calculate on the fly
            if score is None or label is None:
                content = getattr(rev, "content", "")
                analysis = self.analyze_text(content)
                score = analysis["score"]
                label = analysis["label"]
                aspects = analysis["aspects"]

            score_sum += score
            if label == "positive":
                pos_count += 1
            elif label == "negative":
                neg_count += 1
            else:
                neu_count += 1

            if aspects and isinstance(aspects, dict):
                for asp, details in aspects.items():
                    if asp not in aspect_aggregation:
                        aspect_aggregation[asp] = {"positive": 0, "neutral": 0, "negative": 0, "total": 0}
                    asp_label = details.get("sentiment", "neutral")
                    aspect_aggregation[asp][asp_label] = aspect_aggregation[asp].get(asp_label, 0) + 1
                    aspect_aggregation[asp]["total"] += 1

        return {
            "product_id": product_id,
            "product_name": product_name,
            "positive": round((pos_count / total) * 100, 1),
            "neutral": round((neu_count / total) * 100, 1),
            "negative": round((neg_count / total) * 100, 1),
            "total_reviews": total,
            "average_score": round(score_sum / total, 3),
            "aspect_insights": aspect_aggregation
        }


sentiment_service = SentimentAnalysisService()
