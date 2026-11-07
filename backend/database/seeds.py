import logging
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from database.models import Product, PriceHistory, Review, TrendMetric
from services.sentiment_analysis import sentiment_service

logger = logging.getLogger("marketpulse.database.seeds")


def seed_database_if_empty(db: Session) -> None:
    """
    Seeds baseline tech market products, historical price fluctuations,
    reviews with sentiment metadata, and trend metrics if the database is empty.
    """
    if db.query(Product).first():
        logger.info("Database already contains product data; skipping seed.")
        return

    logger.info("Empty database detected. Seeding baseline tech market intelligence data...")

    now = datetime.utcnow()

    # 1. Products Definition
    seed_products = [
        Product(
            name="Samsung Galaxy S25",
            brand="Samsung",
            category="Smartphone",
            price=3999.99,
            currency="RON",
            source="eMAG",
            source_url="https://www.emag.ro/telefon-mobil-samsung-galaxy-s25",
            sku="SM-S931B",
            rating=4.6,
            review_count=18,
            specs={
                "display": "6.2 inch Dynamic AMOLED 2X 120Hz",
                "processor": "Snapdragon 8 Elite",
                "ram": "12GB",
                "storage": "256GB",
                "battery": "4000 mAh"
            }
        ),
        Product(
            name="Apple iPhone 16",
            brand="Apple",
            category="Smartphone",
            price=4499.99,
            currency="RON",
            source="eMAG",
            source_url="https://www.emag.ro/telefon-mobil-apple-iphone-16",
            sku="MYEG3ZD/A",
            rating=4.7,
            review_count=24,
            specs={
                "display": "6.1 inch Super Retina XDR OLED",
                "processor": "Apple A18 Bionic",
                "ram": "8GB",
                "storage": "128GB",
                "camera": "48MP Fusion Camera"
            }
        ),
        Product(
            name="Sony WH-1000XM5",
            brand="Sony",
            category="Headphones",
            price=1499.99,
            currency="RON",
            source="eMAG",
            source_url="https://www.emag.ro/casti-audio-over-the-ear-sony-wh-1000xm5",
            sku="WH1000XM5B.CE7",
            rating=4.8,
            review_count=35,
            specs={
                "type": "Over-Ear Wireless",
                "noise_cancelling": "Dual Noise Sensor Technology with 8 mics",
                "battery_life": "30 hours with ANC",
                "connectivity": "Bluetooth 5.2, LDAC"
            }
        ),
        Product(
            name="NVIDIA GeForce RTX 5080",
            brand="NVIDIA",
            category="Graphics Card",
            price=5999.99,
            currency="RON",
            source="eMAG",
            source_url="https://www.emag.ro/placa-video-nvidia-geforce-rtx-5080",
            sku="RTX-5080-16G",
            rating=4.5,
            review_count=12,
            specs={
                "memory": "16GB GDDR7",
                "architecture": "Blackwell",
                "interface": "PCIe 5.0",
                "tdp": "360W"
            }
        ),
        Product(
            name="Apple MacBook Pro 14 M4",
            brand="Apple",
            category="Laptop",
            price=8999.99,
            currency="RON",
            source="eMAG",
            source_url="https://www.emag.ro/laptop-apple-macbook-pro-14-m4",
            sku="MCX04ZE/A",
            rating=4.9,
            review_count=15,
            specs={
                "processor": "Apple M4 10-core CPU",
                "display": "14.2 Liquid Retina XDR",
                "ram": "16GB Unified",
                "storage": "512GB SSD",
                "battery": "Up to 24 hours"
            }
        ),
    ]

    for p in seed_products:
        db.add(p)
    db.commit()

    # 2. Historical Price Fluctuation Series (Last 60 days)
    for p in seed_products:
        # Generate 4 price milestones
        price_snapshots = [
            (p.price * 1.08, now - timedelta(days=60)),
            (p.price * 1.04, now - timedelta(days=35)),
            (p.price * 0.98, now - timedelta(days=14)),
            (p.price, now - timedelta(days=1)),
        ]
        for pr, recorded_time in price_snapshots:
            db.add(
                PriceHistory(
                    product_id=p.id,
                    price=round(pr, 2),
                    currency=p.currency,
                    recorded_at=recorded_time
                )
            )

    # 3. Reviews with Sentiment
    sample_reviews = [
        # Samsung S25
        (
            1, "eMAG", "Andrei M.", 5.0, "Ecran superb si procesor foarte rapid",
            "Sunt extrem de multumit. Ecranul Dynamic AMOLED este crisp si fluid la 120Hz. Bateria tine o zi intreaga de utilizare intensa, iar camera scoate poze excelente chiar si noaptea.",
            now - timedelta(days=10)
        ),
        (
            1, "Reddit", "tech_enthusiast_ro", 4.0, "Great hardware, OneUI is snappy",
            "Upgraded from S22. The Snapdragon processor is a beast, snappy performance and zero lag in games. Battery life is decent, though charging speed could be faster.",
            now - timedelta(days=5)
        ),
        (
            1, "eMAG", "Radu D.", 3.0, "Bun dar pretul este cam piperat",
            "Telefonul se misca fluid, dar este destul de overpriced la lansare. Dupa 30 de minute de gaming se simte o usoara incalzire (overheating) pe rama metalica.",
            now - timedelta(days=2)
        ),
        # iPhone 16
        (
            2, "eMAG", "Elena C.", 5.0, "Cea mai buna camera pentru video",
            "Autonomia bateriei este incredibila, ma tine 2 zile lejer la utilizare medie. Camera button este foarte practic, iar iOS 18 este extrem de fluid si stabil.",
            now - timedelta(days=15)
        ),
        (
            2, "Reddit", "ios_dev_guru", 4.0, "Solid iterative upgrade",
            "The A18 chip is blazing fast. Build quality is premium. Only complaint is the lack of 120Hz display on the non-Pro version.",
            now - timedelta(days=8)
        ),
        (
            2, "Alternative", "TechReviewer", 4.0, "Ecosistem excelent",
            "Integrarea cu Mac si Apple Watch ramane de neegalat. Sunetul difuzoarelor este clar si puternic, iar pozele au culori naturale.",
            now - timedelta(days=3)
        ),
        # Sony WH-1000XM5
        (
            3, "eMAG", "Mihai B.", 5.0, "Regele noise cancelling-ului",
            "ANC-ul este pur si simplu uimitor, izoleaza complet zgomotul din birou si din avion. Sunet echilibrat, bass profund si confortabile la purtare indelungata.",
            now - timedelta(days=20)
        ),
        (
            3, "Reddit", "audiophile99", 5.0, "Best travel companion",
            "Superb audio fidelity with LDAC. Battery life easily reaches 30 hours. Microphones do a great job on Zoom calls.",
            now - timedelta(days=7)
        ),
        # RTX 5080
        (
            4, "Reddit", "pc_master_builder", 5.0, "Unbelievable 4K gaming performance",
            "Runs Cyberpunk 2077 at maximum ray tracing over 100 fps with DLSS. Temperatures stay very cool under load. Premium build quality.",
            now - timedelta(days=12)
        ),
        (
            4, "eMAG", "Alexandru V.", 3.0, "Performanta mare dar consum ridicat",
            "Performanta in randare 3D este uluitoare. Totusi, consumul de energie este mare si necesita o sursa serioasa de minim 850W.",
            now - timedelta(days=4)
        ),
        # MacBook Pro 14 M4
        (
            5, "eMAG", "Cristina P.", 5.0, "Perfect pentru programare si creatie",
            "Bateria tine lejer 18-20 de ore de lucru in VS Code si Docker. Ecranul Liquid Retina este o capodopera vizuala, iar viteza cipului M4 este uluitoare.",
            now - timedelta(days=18)
        )
    ]

    for p_id, src, author, rating, title, content, pub_date in sample_reviews:
        analysis = sentiment_service.analyze_text(content)
        db.add(
            Review(
                product_id=p_id,
                source=src,
                author=author,
                rating=rating,
                title=title,
                content=content,
                sentiment_score=analysis["score"],
                sentiment_label=analysis["label"],
                aspects=analysis["aspects"],
                published_at=pub_date
            )
        )

    # 4. Market Trend Metrics
    seed_trends = [
        TrendMetric(category="Smartphone", keyword="AI Smartphones & Snapdragon 8 Elite", trend_score=88.5, search_interest=92.0, trend_direction="increasing"),
        TrendMetric(category="Laptop", keyword="Apple M4 & Copilot+ PC", trend_score=84.0, search_interest=86.5, trend_direction="increasing"),
        TrendMetric(category="Headphones", keyword="Active Noise Cancellation Over-Ear", trend_score=74.5, search_interest=71.0, trend_direction="stable"),
        TrendMetric(category="Graphics Card", keyword="RTX 50 Series Blackwell", trend_score=91.0, search_interest=96.0, trend_direction="increasing"),
    ]
    for t in seed_trends:
        db.add(t)

    db.commit()
    logger.info("Baseline tech intelligence data successfully seeded into database.")
