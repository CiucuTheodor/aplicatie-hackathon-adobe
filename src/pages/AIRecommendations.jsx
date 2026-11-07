import { useMemo, useState } from "react";
import { ArrowUpRight, Check, ChevronDown, Filter, Lightbulb, Sparkles, Target } from "lucide-react";
import { getRecommendations } from "../services/api.js";
import { useFetch } from "../hooks/useFetch.js";
import { useFilters } from "../context/AppContext.jsx";
import { InsightCard, EmptyState, ErrorState, PageHeading, PageLoading } from "../components/common.jsx";

const categories = ["All", "Product", "Consumer", "Marketing", "Competitive"];

export default function AIRecommendations() {
  const { filters } = useFilters();
  const [category, setCategory] = useState("All");
  const state = useFetch(() => getRecommendations({ category }), [category]);
  const recommendations = useMemo(() => (state.data || []).filter((item) => filters.brand === "All brands" || item.related.startsWith(filters.brand)), [state.data, filters.brand]);
  const highPriority = recommendations.filter((item) => item.priority === "High").length;
  if (state.loading) return <PageLoading />;
  if (state.error) return <ErrorState error={state.error} />;
  if (!state.data) return <EmptyState />;
  return (
    <div className="page">
      <PageHeading eyebrow="YOUR AI STRATEGY PARTNER" title="The signal, and what to do next." description="Evidence-backed recommendations, prioritized by impact and confidence." action={<span className="ai-status-pill"><span className="ai-pulse"><Sparkles size={13} /></span> MarketPulse AI <span className="mini-online" /></span>} />
      <section className="executive-summary panel"><div className="summary-icon"><Sparkles size={20} /></div><div className="summary-content"><div className="summary-topline"><span className="eyebrow">EXECUTIVE SUMMARY</span><span className="summary-generated">Generated just now <span className="live-dot" /></span></div><h2>The next growth opportunity is winning the value conversation.</h2><p>Premium tech demand is resilient, but shoppers are scrutinizing price more closely. Lead with real-world performance proof, reinforce the value of your ecosystem, and address charging and upgrade costs before they become reasons to switch.</p><div className="summary-evidence"><span><Target size={13} /> {recommendations.length} recommendations</span><span><Lightbulb size={13} /> {highPriority} high-priority actions</span><span><Check size={13} /> 84.4% avg. confidence</span></div></div><div className="summary-score"><span>Market readiness</span><strong>82<span>/100</span></strong><div className="health-gauge"><i style={{ width: "82%" }} /></div><small><ArrowUpRight size={12} /> 6 pts this month</small></div></section>
      <div className="recommendation-toolbar"><div className="recommendation-tabs" role="group" aria-label="Filter recommendations">{categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}{item === "All" && <span>{state.data.length}</span>}</button>)}</div><span className="recommendation-sort"><Filter size={14} /> Sorted by impact <ChevronDown size={14} /></span></div>
      {recommendations.length ? <><div className="recommendation-list">{recommendations.map((item, index) => <div className="recommendation-item" key={item.id}><span className="recommendation-number">0{index + 1}</span><InsightCard item={item} /></div>)}</div><div className="recommendation-footer"><span><Sparkles size={14} /> Recommendations are generated from live product, consumer, and market signals.</span><button className="button button-quiet">How we calculate this <ArrowUpRight size={14} /></button></div></> : <EmptyState title="No recommendations for this view" description="Try another category or clear the global brand filter." />}
    </div>
  );
}
