import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import { PageLoading } from "./components/common.jsx";

const MarketOverview = lazy(() => import("./pages/MarketOverview.jsx"));
const ProductAnalysis = lazy(() => import("./pages/ProductAnalysis.jsx"));
const BrandIntelligence = lazy(() => import("./pages/BrandIntelligence.jsx"));
const SentimentAnalysis = lazy(() => import("./pages/SentimentAnalysis.jsx"));
const ConsumerInsights = lazy(() => import("./pages/ConsumerInsights.jsx"));
const MarketingAnalytics = lazy(() => import("./pages/MarketingAnalytics.jsx"));
const CompetitorAnalysis = lazy(() => import("./pages/CompetitorAnalysis.jsx"));
const AIRecommendations = lazy(() => import("./pages/AIRecommendations.jsx"));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Suspense fallback={<PageLoading />}><MarketOverview /></Suspense>} />
        <Route path="products" element={<Suspense fallback={<PageLoading />}><ProductAnalysis /></Suspense>} />
        <Route path="brands" element={<Suspense fallback={<PageLoading />}><BrandIntelligence /></Suspense>} />
        <Route path="sentiment" element={<Suspense fallback={<PageLoading />}><SentimentAnalysis /></Suspense>} />
        <Route path="consumers" element={<Suspense fallback={<PageLoading />}><ConsumerInsights /></Suspense>} />
        <Route path="marketing" element={<Suspense fallback={<PageLoading />}><MarketingAnalytics /></Suspense>} />
        <Route path="competitors" element={<Suspense fallback={<PageLoading />}><CompetitorAnalysis /></Suspense>} />
        <Route path="recommendations" element={<Suspense fallback={<PageLoading />}><AIRecommendations /></Suspense>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
