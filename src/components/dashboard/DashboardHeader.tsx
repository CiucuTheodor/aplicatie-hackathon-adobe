import React, { useState } from 'react';
import { Calendar, Filter, Sparkles, Download, RefreshCw } from 'lucide-react';
import { Dropdown, DropdownOption } from '../ui/Dropdown';

interface DashboardHeaderProps {
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  channelFilter: string;
  onChannelFilterChange: (filter: string) => void;
  onRefresh?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  dateRange,
  onDateRangeChange,
  channelFilter,
  onChannelFilterChange,
  onRefresh
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const dateOptions: DropdownOption[] = [
    { id: 'Aug 01 – Oct 31, 2023', label: 'Aug 01 – Oct 31, 2023', badge: 'Default' },
    { id: 'Last 30 Days', label: 'Last 30 Days' },
    { id: 'Last 60 Days', label: 'Last 60 Days' },
    { id: 'Last 90 Days', label: 'Last 90 Days' },
    { id: 'Q3 2023 (Jul – Sep)', label: 'Q3 2023 (Jul – Sep)' },
    { id: 'Year to Date', label: 'Year to Date' }
  ];

  const filterOptions: DropdownOption[] = [
    { id: 'all', label: 'All Channels', badge: '100%' },
    { id: 'social', label: 'Social Networks' },
    { id: 'news', label: 'Tech News & PR' },
    { id: 'community', label: 'Developer Forums & Reddit' },
    { id: 'reviews', label: 'Review Sites (G2, Capterra)' }
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh?.();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 mb-1 gap-3">
      {/* Title & Live Observation Status */}
      <div>
        <div className="flex items-center space-x-2">
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-[#F3F6FA]">
            Competitor Analysis & Brand Detection over time
          </h1>
          <span className="hidden xl:inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#19D9A0]/10 text-[#19D9A0] border border-[#19D9A0]/30">
            <Sparkles className="w-3 h-3 text-[#19D9A0]" />
            <span>AI Synthesis Active</span>
          </span>
        </div>
        <p className="text-xs text-[#8995A7] mt-0.5">
          Real-time telemetry, sentiment analysis, and comparative market share benchmarks.
        </p>
      </div>

      {/* Action Controls */}
      <div className="flex items-center flex-wrap gap-2 shrink-0">
        {/* Date Range Selector */}
        <Dropdown
          options={dateOptions}
          selectedId={dateRange}
          onSelect={(opt) => onDateRangeChange(opt.id)}
          icon={<Calendar className="w-3.5 h-3.5 text-[#19D9A0]" />}
          menuWidth="w-56"
        />

        {/* Filter Dropdown */}
        <Dropdown
          options={filterOptions}
          selectedId={channelFilter}
          onSelect={(opt) => onChannelFilterChange(opt.id)}
          prefix="Filter"
          icon={<Filter className="w-3.5 h-3.5 text-[#2185F5]" />}
          menuWidth="w-52"
        />

        {/* Refresh button */}
        <button
          onClick={handleRefresh}
          className="p-1.5 rounded-md bg-[#0D1728] border border-[#26364B] hover:border-[#384C66] text-[#8995A7] hover:text-[#F3F6FA] transition-colors focus:outline-none"
          title="Refresh Data"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#19D9A0]' : ''}`}
          />
        </button>

        {/* Export / Report button */}
        <button
          onClick={() => alert('Exporting dashboard telemetry as PDF / CSV...')}
          className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md bg-[#0D1728] border border-[#26364B] hover:border-[#19D9A0]/50 hover:text-[#19D9A0] text-xs font-medium text-[#8995A7] transition-colors focus:outline-none"
          title="Export report"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Export</span>
        </button>
      </div>
    </div>
  );
};
