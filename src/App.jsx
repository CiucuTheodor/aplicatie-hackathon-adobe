import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import MarketOverview from "./pages/MarketOverview.jsx";
import ProductAnalysis from "./pages/ProductAnalysis.jsx";
import BrandIntelligence from "./pages/BrandIntelligence.jsx";
import SentimentAnalysis from "./pages/SentimentAnalysis.jsx";
import ConsumerInsights from "./pages/ConsumerInsights.jsx";
import MarketingAnalytics from "./pages/MarketingAnalytics.jsx";
import CompetitorAnalysis from "./pages/CompetitorAnalysis.jsx";
import AIRecommendations from "./pages/AIRecommendations.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<MarketOverview />} />
        <Route path="products" element={<ProductAnalysis />} />
        <Route path="brands" element={<BrandIntelligence />} />
        <Route path="sentiment" element={<SentimentAnalysis />} />
        <Route path="consumers" element={<ConsumerInsights />} />
        <Route path="marketing" element={<MarketingAnalytics />} />
        <Route path="competitors" element={<CompetitorAnalysis />} />
        <Route path="recommendations" element={<AIRecommendations />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
