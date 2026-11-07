import React, { useState } from 'react';
import { TopNavbar, NavTab } from './TopNavbar';
import { Sidebar, SidebarItem } from './Sidebar';
import { DashboardHeader } from '../dashboard/DashboardHeader';
import { ShareOfVoiceChart } from '../dashboard/ShareOfVoiceChart';
import { BrandDetectionChart } from '../dashboard/BrandDetectionChart';
import { LiveMentionsFeed } from '../dashboard/LiveMentionsFeed';
import { SentimentAnalysisChart } from '../dashboard/SentimentAnalysisChart';
import { CompetingTopics } from '../dashboard/CompetingTopics';
import { CompetitorMetrics } from '../dashboard/CompetitorMetrics';

export const DashboardLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('Overview');
  const [sidebarItem, setSidebarItem] = useState<SidebarItem>('analytics');
  const [dateRange, setDateRange] = useState<string>('Aug 01 – Oct 31, 2023');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#070D1A] text-[#F3F6FA] select-none">
      {/* 1. Top Navbar (~58px) */}
      <TopNavbar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 2. Main Workspace: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar (~52px) */}
        <Sidebar activeItem={sidebarItem} onSelect={setSidebarItem} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-5 flex flex-col bg-[#070D1A]">
          {/* Header with Title and Global Filters */}
          <DashboardHeader
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            channelFilter={channelFilter}
            onChannelFilterChange={setChannelFilter}
            onRefresh={handleRefresh}
          />

          {/* Conditional Views based on Tab */}
          {activeTab === 'Overview' && (
            <div
              key={refreshKey}
              className="flex-1 flex flex-col gap-3.5 max-w-[1920px] w-full mx-auto"
            >
              {/* Top Row: 3 Widgets (~330px high)
                  Proportions: Left ~28%, Center ~44%, Right ~28% */}
              <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,28fr)_minmax(0,44fr)_minmax(0,28fr)] gap-3.5">
                {/* Widget 1: Competitor Share of Voice */}
                <div className="w-full">
                  <ShareOfVoiceChart />
                </div>

                {/* Widget 2: Brand Detection Trends (Largest chart) */}
                <div className="w-full">
                  <BrandDetectionChart />
                </div>

                {/* Widget 3: Live Brand Mentions Feed */}
                <div className="w-full">
                  <LiveMentionsFeed />
                </div>
              </div>

              {/* Bottom Row: 3 Widgets (~250px high)
                  Proportions: Left ~28%, Center ~44%, Right ~28% */}
              <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,28fr)_minmax(0,44fr)_minmax(0,28fr)] gap-3.5">
                {/* Widget 4: Sentiment Analysis Over Time */}
                <div className="w-full">
                  <SentimentAnalysisChart />
                </div>

                {/* Widget 5: Top Competing Topics */}
                <div className="w-full">
                  <CompetingTopics />
                </div>

                {/* Widget 6: Competitor Key Metrics */}
                <div className="w-full">
                  <CompetitorMetrics />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Competitors' && (
            <div className="flex-1 flex flex-col gap-4 max-w-[1920px] w-full mx-auto animate-in fade-in duration-200">
              <div className="p-4 rounded-xl bg-[#111E30] border border-[#26364B]">
                <h2 className="text-base font-bold text-white mb-2">Detailed Competitor Intelligence</h2>
                <p className="text-xs text-[#8995A7] mb-4">
                  Comparative telemetry across Datadog, Dynatrace, New Relic, and Grafana Cloud.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-[#0D1728] border border-[#26364B]">
                    <span className="text-xs text-[#8995A7]">Competitor A (Direct)</span>
                    <h3 className="text-xl font-bold text-white mt-1">Datadog</h3>
                    <p className="text-xs text-[#2185F5] mt-1 font-semibold">28% Market Voice</p>
                    <div className="mt-3 text-xs text-[#A0AEC0] space-y-1">
                      <div>Top Topic: APM & Distributed Tracing</div>
                      <div>Sentiment: 52% Positive</div>
                      <div>Weakness: High Cost at Scale</div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-[#0D1728] border border-[#26364B]">
                    <span className="text-xs text-[#8995A7]">Competitor B (Enterprise)</span>
                    <h3 className="text-xl font-bold text-white mt-1">Dynatrace</h3>
                    <p className="text-xs text-[#F59E35] mt-1 font-semibold">18% Market Voice</p>
                    <div className="mt-3 text-xs text-[#A0AEC0] space-y-1">
                      <div>Top Topic: Davis AI Automation</div>
                      <div>Sentiment: 44% Positive</div>
                      <div>Weakness: Complex Deployment</div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-[#0D1728] border border-[#26364B]">
                    <span className="text-xs text-[#8995A7]">Your Product</span>
                    <h3 className="text-xl font-bold text-[#19D9A0] mt-1">BrandVision</h3>
                    <p className="text-xs text-[#19D9A0] mt-1 font-semibold">42% Market Leader</p>
                    <div className="mt-3 text-xs text-[#A0AEC0] space-y-1">
                      <div>Top Topic: AI Observability & Scaling</div>
                      <div>Sentiment: 84% Positive</div>
                      <div>Advantage: Zero-Overhead Telemetry</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Brand Mentions' && (
            <div className="flex-1 flex flex-col gap-4 max-w-[1920px] w-full mx-auto animate-in fade-in duration-200">
              <LiveMentionsFeed />
            </div>
          )}

          {activeTab === 'Alerts' && (
            <div className="flex-1 flex flex-col gap-4 max-w-[1920px] w-full mx-auto animate-in fade-in duration-200">
              <div className="p-6 rounded-xl bg-[#111E30] border border-[#26364B]">
                <h2 className="text-base font-bold text-white mb-2">Autonomous Observability Alerts</h2>
                <p className="text-xs text-[#8995A7] mb-4">
                  Real-time trigger rules evaluating brand sentiment spikes and competitor campaign launches.
                </p>
                <div className="space-y-3">
                  <div className="p-3.5 rounded-lg bg-[#0D1728] border border-[#26364B] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">Competitor Negative Sentiment Spike</div>
                      <div className="text-[11px] text-[#8995A7]">Triggered when competitor negative sentiment exceeds 30% in 1 hour</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#19D9A0]/20 text-[#19D9A0] font-semibold">ACTIVE</span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[#0D1728] border border-[#26364B] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">High Authority Publication Mention</div>
                      <div className="text-[11px] text-[#8995A7]">Instant Slack notification when Domain Authority &gt; 80 publishes mention</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#19D9A0]/20 text-[#19D9A0] font-semibold">ACTIVE</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Reports' && (
            <div className="flex-1 flex flex-col gap-4 max-w-[1920px] w-full mx-auto animate-in fade-in duration-200">
              <div className="p-6 rounded-xl bg-[#111E30] border border-[#26364B]">
                <h2 className="text-base font-bold text-white mb-2">Automated Executive Telemetry Reports</h2>
                <p className="text-xs text-[#8995A7] mb-4">
                  Weekly and monthly synthesized briefings on brand perception and competitor velocity.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-[#0D1728] border border-[#26364B]">
                    <div className="text-xs font-bold text-white">Q3 Executive Observability Briefing</div>
                    <div className="text-[11px] text-[#8995A7] mt-1">Generated Nov 01, 2023 • PDF • 14 pages</div>
                    <button className="mt-3 text-xs text-[#19D9A0] font-semibold hover:underline">Download PDF</button>
                  </div>
                  <div className="p-4 rounded-lg bg-[#0D1728] border border-[#26364B]">
                    <div className="text-xs font-bold text-white">Weekly Competitor Momentum Digest</div>
                    <div className="text-[11px] text-[#8995A7] mt-1">Generated Yesterday at 08:00 AM • CSV + Graphs</div>
                    <button className="mt-3 text-xs text-[#19D9A0] font-semibold hover:underline">Download Archive</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
