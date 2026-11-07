import { Search, X } from "lucide-react";
import { useFilters } from "../context/AppContext.jsx";

const brands = ["All brands", "Apple", "NVIDIA", "Microsoft", "Samsung", "Sony"];
const sources = ["All sources", "eMAG", "Reddit", "X", "Google Trends"];
const ranges = ["7d", "30d", "90d", "1y"];

export default function FilterBar() {
  const { filters, updateFilter } = useFilters();
  return (
    <div className="filter-bar">
      <label className="global-search"><Search size={16} /><input aria-label="Search products and brands" placeholder="Search products, brands…" value={filters.query} onChange={(event) => updateFilter("query", event.target.value)} />{filters.query && <button aria-label="Clear search" onClick={() => updateFilter("query", "")}><X size={14} /></button>}<kbd>⌘ K</kbd></label>
      <div className="filter-controls">
        <label className="filter-select"><span className="sr-only">Brand filter</span><select value={filters.brand} onChange={(event) => updateFilter("brand", event.target.value)}>{brands.map((brand) => <option key={brand}>{brand}</option>)}</select></label>
        <div className="range-switch" role="group" aria-label="Date range">{ranges.map((range) => <button key={range} className={filters.range === range ? "active" : ""} onClick={() => updateFilter("range", range)} aria-pressed={filters.range === range}>{range}</button>)}</div>
        <label className="filter-select source-select"><span className="sr-only">Data source filter</span><select value={filters.source} onChange={(event) => updateFilter("source", event.target.value)}>{sources.map((source) => <option key={source}>{source}</option>)}</select></label>
      </div>
    </div>
  );
}
