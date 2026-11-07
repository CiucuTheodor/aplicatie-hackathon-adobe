import os
import sys

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from connectors.alternative_reviews import alternative_reviews_connector
from connectors.google_trends import google_trends_connector
from services.sentiment_analysis import sentiment_service

def test_connectors():
    print("=== Testing AlternativeReviewsConnector (HN Open Tech Feed) ===")
    discussions = alternative_reviews_connector.fetch_tech_discussions("iPhone 16", limit=3)
    print(f"Retrieved {len(discussions)} discussions:")
    for d in discussions:
        print(f"  * [{d['source']}] {d['title']} (Rating: {d['rating']})")
        # Run sentiment analysis on the content
        analysis = sentiment_service.analyze_text(d['content'])
        print(f"    Sentiment: {analysis['label']} (score: {analysis['score']}), Aspects: {list(analysis['aspects'].keys())}")

    print("\n=== Testing GoogleTrendsConnector ===")
    trends = google_trends_connector.get_interest("NVIDIA RTX", category_name="Graphics Card")
    print("Trends result:", trends)

    print("\n=== All connector smoke tests passed! ===")

if __name__ == "__main__":
    test_connectors()
