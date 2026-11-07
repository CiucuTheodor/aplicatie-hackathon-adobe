import os
import sys

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from main import app

def run_tests():
    with TestClient(app) as client:
        print("=== 1. Health Check ===")
        r = client.get("/health")
        assert r.status_code == 200, r.text
        print("Health Status:", r.json())

        print("\n=== 2. Products List ===")
        r = client.get("/api/products/")
        assert r.status_code == 200, r.text
        products = r.json()
        print(f"Total products: {len(products)}")
        for p in products:
            print(f"  [{p['id']}] {p['brand']} {p['name']} - {p['price']} {p['currency']}")

        print("\n=== 3. Product Search and Filter ===")
        r = client.get("/api/products/?search=Apple")
        assert r.status_code == 200
        apple_prods = r.json()
        print(f"Apple products found: {len(apple_prods)}")

        r = client.get("/api/products/?category=Headphones")
        assert r.status_code == 200
        headphones = r.json()
        print(f"Headphones found: {len(headphones)}")

        print("\n=== 4. Product Detail & Relationships ===")
        r = client.get("/api/products/1/detail")
        assert r.status_code == 200
        detail = r.json()
        print(f"Product: {detail['name']}")
        print(f"Price History count: {len(detail['price_history'])}")
        print(f"Reviews count: {len(detail['reviews'])}")

        print("\n=== 5. Analytics Overview ===")
        r = client.get("/api/analytics/overview")
        assert r.status_code == 200
        print("Overview:", r.json())

        print("\n=== 6. Sentiment Analysis ===")
        r = client.get("/api/analytics/sentiment?product_id=1")
        assert r.status_code == 200
        sentiment = r.json()
        print(f"Sentiment for {sentiment['product_name']}:")
        print(f"  Positive: {sentiment['positive']}%, Neutral: {sentiment['neutral']}%, Negative: {sentiment['negative']}%")
        print(f"  Aspects detected: {list(sentiment['aspect_insights'].keys())}")

        print("\n=== 7. Price Forecasting Analysis ===")
        r = client.get("/api/analytics/prices?product_id=1")
        assert r.status_code == 200
        price_analysis = r.json()
        print(f"Price Analysis: Min={price_analysis['minimum_price']}, Max={price_analysis['maximum_price']}, Avg={price_analysis['average_price']}")

        print("\n=== 8. Market Trends ===")
        r = client.get("/api/analytics/trends")
        assert r.status_code == 200
        trends = r.json()
        print(f"Trends count: {len(trends)}")
        for t in trends:
            print(f"  [{t['category']}] score={t['trend_score']} direction={t['trend_direction']}")

        print("\n=== 9. Recommendations Engine ===")
        r = client.get("/api/analytics/recommendations")
        assert r.status_code == 200
        recs = r.json()
        print(f"Recommendations count: {len(recs)}")
        for rec in recs:
            print(f"  * {rec['product_name']}: {rec['recommendation']}")
            print(f"    Reason: {rec['reason']}")

        print("\n=== ALL API TESTS PASSED SUCCESSFULLY! ===")

if __name__ == "__main__":
    run_tests()
