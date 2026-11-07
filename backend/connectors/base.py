import time
import logging
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import httpx
from config import settings

logger = logging.getLogger("marketpulse.connectors.base")


class BaseConnector(ABC):
    """
    Abstract base connector for external market data sources.
    Provides polite rate-limiting, standardized headers, and error handling.
    """

    def __init__(self, name: str, rate_limit_delay: float = 1.0, timeout: int = 15):
        self.name = name
        self.rate_limit_delay = rate_limit_delay
        self.timeout = timeout
        self.last_request_time = 0.0
        self.headers = {
            "User-Agent": settings.EMAG_USER_AGENT,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "ro-RO,ro;q=0.9,en-US;q=0.8,en;q=0.7",
            "Cache-Control": "no-cache",
        }

    def _apply_rate_limit(self) -> None:
        """
        Enforces polite intervals between requests to avoid overloading public endpoints.
        """
        elapsed = time.time() - self.last_request_time
        if elapsed < self.rate_limit_delay:
            sleep_time = self.rate_limit_delay - elapsed
            time.sleep(sleep_time)
        self.last_request_time = time.time()

    def fetch_get(self, url: str, params: Optional[Dict[str, Any]] = None, headers: Optional[Dict[str, str]] = None) -> Optional[httpx.Response]:
        """
        Executes a rate-limited GET request with error trapping.
        """
        self._apply_rate_limit()
        req_headers = {**self.headers, **(headers or {})}

        try:
            with httpx.Client(timeout=self.timeout, follow_redirects=True) as client:
                response = client.get(url, params=params, headers=req_headers)
                if response.status_code == 200:
                    return response
                elif response.status_code == 429:
                    logger.warning(f"[{self.name}] Rate limit encountered (429) on {url}")
                elif response.status_code == 403:
                    logger.warning(f"[{self.name}] Access forbidden (403) on {url}. May require anti-bot headers or proxy.")
                else:
                    logger.warning(f"[{self.name}] HTTP status {response.status_code} for {url}")
                return None
        except httpx.RequestError as exc:
            logger.error(f"[{self.name}] Request error for {url}: {exc}")
            return None
        except Exception as exc:
            logger.error(f"[{self.name}] Unexpected error fetching {url}: {exc}")
            return None

    @abstractmethod
    def search_products(self, query: str, limit: int = 10) -> list:
        """Search products on external platform."""
        pass
