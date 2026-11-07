import React from 'react';
import { Card } from '../ui/Card';
import { competitorMetricsData } from '../../data/mockData';
import { ArrowUpRight, ShieldCheck, Zap } from 'lucide-react';

export const CompetitorMetrics: React.FC = () => {
  return (
    <Card
      title="COMPETITOR KEY METRICS"
      subtitle="(30-Day Velocity)"
      headerAction={
        <div className="flex items-center space-x-1 text-[10px] text-[#19D9A0] bg-[#19D9A0]/10 px-2 py-0.5 rounded-full border border-[#19D9A0]/20">
          <ShieldCheck className="w-3 h-3" />
          <span>Verified Data</span>
        </div>
      }
      className="h-[250px]"
      bodyClassName="p-3.5 flex flex-col justify-between"
    >
      <div className="grid grid-rows-3 gap-2 flex-1">
        {competitorMetricsData.map((metric, idx) => (
          <div
            key={metric.title}
            className={`flex items-center justify-between p-2 rounded-lg bg-[#0D1728]/60 border border-[#26364B]/60 hover:border-[#19D9A0]/40 transition-colors ${
              idx < competitorMetricsData.length - 1 ? '' : ''
            }`}
          >
            {/* Metric Title & subtext */}
            <div className="flex flex-col">
              <span className="text-[11px] font-medium text-[#A0AEC0] uppercase tracking-wider">
                {metric.title}
              </span>
              <span className="text-[10px] text-[#8995A7]">
                {metric.benchmark}
              </span>
            </div>

            {/* Metric Value & Change Indicator */}
            <div className="flex items-baseline space-x-2.5">
              <span className="text-xl font-extrabold text-[#F3F6FA] tracking-tight">
                {metric.value}
              </span>
              <div className="flex items-center space-x-0.5 px-1.5 py-0.5 rounded bg-[#19D9A0]/15 text-[#19D9A0] text-[11px] font-bold">
                <ArrowUpRight className="w-3 h-3 shrink-0 stroke-[2.5]" />
                <span>{metric.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Aggregate status footer */}
      <div className="pt-2 border-t border-[#26364B]/60 flex items-center justify-between text-[10px] text-[#8995A7] mt-1">
        <div className="flex items-center space-x-1.5">
          <Zap className="w-3 h-3 text-[#19D9A0]" />
          <span>Outperforming industry benchmark by <b className="text-white">+11.4%</b></span>
        </div>
      </div>
    </Card>
  );
};
