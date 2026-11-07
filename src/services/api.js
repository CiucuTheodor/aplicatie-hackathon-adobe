import { BRANDS, brandStats, marketingTrend, overview, priceHistory, products, recommendations, segments, sentiment } from "../mocks/marketData.js";

const API_URL = import.meta.env.VITE_API_URL || "";
const delay = (data, ms = 360) => new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), ms));
const rangePoints = (range) => ({ "7d": 2, "30d": 5, "90d": 12, "1y": 12 }[range] || 12);

function filterProducts(filters = {}) {
  return products.filter((product) => {
    const matchesBrand = !filters.brand || filters.brand === "All brands" || product.brand === filters.brand;
    const query = filters.query?.trim().toLowerCase();
    const matchesQuery = !query || `${product.name} ${product.brand} ${product.category}`.toLowerCase().includes(query);
    return matchesBrand && matchesQuery;
  });
}

async function request(path, fallback) {
  if (!API_URL) return delay(fallback);
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) throw new Error(`Request failed (${response.status}) for ${path}`);
  return response.json();
}

export const getMarketOverview = (filters = {}) => request("/analytics/overview", {
  ...overview,
  evolution: overview.evolution.slice(-rangePoints(filters.range)),
  mentions: overview.mentions.filter((mention) =>
    (!filters.brand || filters.brand === "All brands" || mention.brand === filters.brand) &&
    (!filters.source || filters.source === "All sources" || mention.source === filters.source)),
  topMovers: [...filterProducts(filters)].sort((a, b) => b.change - a.change).slice(0, 4),
});
export const getProducts = (filters = {}) => request("/products", filterProducts(filters));
export const getProductComparison = (ids = ["p1", "p2"]) =>
  request(`/products/compare?ids=${ids.join(",")}`, products.filter((product) => ids.includes(product.id)));
export const getProductDetail = (id) => request(`/products/${id}`, products.find((product) => product.id === id) || null);
export const getBrandStats = (filters = {}) => request("/analytics/brands", filters.brand && filters.brand !== "All brands" ? brandStats.filter((item) => item.brand === filters.brand) : brandStats);
export const getSentiment = (filters = {}) => request("/analytics/sentiment", {
  ...sentiment,
  trend: sentiment.trend.slice(-rangePoints(filters.range)),
  reviews: sentiment.reviews.filter((review) =>
    (!filters.source || filters.source === "All sources" || review.source === filters.source) &&
    (!filters.brand || filters.brand === "All brands" || review.brand === filters.brand)),
});
export const getConsumerSegments = () => request("/analytics/consumer-segments", segments);
export const getMarketingTrends = (filters = {}) => request("/marketing/trends", marketingTrend.slice(-rangePoints(filters.range)));
export const getCompetitors = () => request("/analytics/competitors", {
  brands: BRANDS,
  priceDifferences: products.slice(0, 5).map((product) => ({ name: product.name, brand: product.brand, price: product.price, baseline: 999, difference: product.price - 999 })),
});
export const getRecommendations = (filters = {}) => request("/analytics/recommendations", filters.category && filters.category !== "All" ? recommendations.filter((item) => item.category === filters.category) : recommendations);
