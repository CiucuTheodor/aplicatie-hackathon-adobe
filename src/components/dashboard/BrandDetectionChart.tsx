import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Card } from '../ui/Card';
import { Dropdown, DropdownOption } from '../ui/Dropdown';
import {
  detectionTrends30d,
  detectionTrends60d,
  detectionTrends90d,
  TrendDataPoint
} from '../../data/mockData';
import { TrendingUp, Layers } from 'lucide-react';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomDetectionTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label
}) => {
  if (active && payload && payload.length) {
    const brandData = payload.find((p) => p.dataKey === 'brandMentions');
    const compData = payload.find((p) => p.dataKey === 'competitorMentions');

    return (
      <div className="bg-[#0D1728]/95 border border-[#26364B] rounded-xl p-3 shadow-2xl backdrop-blur-md min-w-[190px]">
        <div className="text-[11px] font-semibold text-[#8995A7] border-b border-[#26364B] pb-1.5 mb-2 flex items-center justify-between">
          <span>{label}</span>
          <span className="text-[#19D9A0] font-bold">Live Stream</span>
        </div>
        <div className="space-y-2">
          {brandData && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#19D9A0] shadow-[0_0_6px_#19D9A0]" />
                <span className="text-xs text-[#F3F6FA] font-medium">Brand Mentions:</span>
              </div>
              <span className="text-xs font-bold text-[#19D9A0]">
                {brandData.value.toLocaleString()}
              </span>
            </div>
          )}
          {compData && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E35] shadow-[0_0_6px_#F59E35]" />
                <span className="text-xs text-[#F3F6FA] font-medium">Competitor:</span>
              </div>
              <span className="text-xs font-bold text-[#F59E35]">
                {compData.value.toLocaleString()}
              </span>
            </div>
          )}
          {brandData && compData && (
            <div className="pt-1.5 mt-1 border-t border-[#26364B]/60 text-[10px] text-[#A0AEC0] flex justify-between">
              <span>Net Advantage:</span>
              <span className="text-[#19D9A0] font-bold">
                +{(brandData.value - compData.value).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export const BrandDetectionChart: React.FC = () => {
  const [period, setPeriod] = useState<string>('30d');
  const [filterType, setFilterType] = useState<string>('all');

  const periodOptions: DropdownOption[] = [
    { id: '30d', label: '30 Days' },
    { id: '60d', label: '60 Days' },
    { id: '90d', label: '90 Days' }
  ];

  const filterOptions: DropdownOption[] = [
    { id: 'all', label: 'All Filter' },
    { id: 'direct', label: 'Direct Mentions' },
    { id: 'indirect', label: 'Indirect & Contextual' },
    { id: 'hashtags', label: 'Hashtag Signals' }
  ];

  const getChartData = (): TrendDataPoint[] => {
    switch (period) {
      case '60d':
        return detectionTrends60d;
      case '90d':
        return detectionTrends90d;
      case '30d':
      default:
        return detectionTrends30d;
    }
  };

  const chartData = getChartData();

  return (
    <Card
      title={
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold tracking-wider text-[#F3F6FA] uppercase">
            BRAND DETECTION TRENDS
          </span>
          <span className="hidden md:inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-[#19D9A0]/10 text-[#19D9A0] text-[10px] font-semibold border border-[#19D9A0]/20">
            <TrendingUp className="w-3 h-3" />
            <span>+18.4% Peak</span>
          </span>
        </div>
      }
      headerAction={
        <div className="flex items-center space-x-2">
          {/* Legend in header */}
          <div className="hidden xl:flex items-center space-x-3 mr-2 text-[11px]">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#19D9A0]" />
              <span className="text-[#F3F6FA] font-medium">Brand</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#F59E35]" />
              <span className="text-[#A0AEC0] font-medium">Competitors</span>
            </div>
          </div>

          {/* Period selector */}
          <Dropdown
            options={periodOptions}
            selectedId={period}
            onSelect={(opt) => setPeriod(opt.id)}
            buttonClassName="py-1 px-2.5 text-xs"
            menuWidth="w-32"
          />

          {/* All Filter dropdown */}
          <Dropdown
            options={filterOptions}
            selectedId={filterType}
            onSelect={(opt) => setFilterType(opt.id)}
            icon={<Layers className="w-3 h-3" />}
            buttonClassName="py-1 px-2.5 text-xs"
            menuWidth="w-44"
          />
        </div>
      }
      className="h-[330px]"
      bodyClassName="p-3"
    >
      <div className="w-full h-full min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 12, right: 12, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="brandAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#19D9A0" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#19D9A0" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="compAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E35" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#F59E35" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#26364B"
              vertical={false}
              opacity={0.6}
            />

            <XAxis
              dataKey="date"
              stroke="#4B5A70"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#26364B' }}
              tick={{ fill: '#8995A7' }}
            />

            <YAxis
              domain={[0, 25000]}
              ticks={[0, 5000, 10000, 15000, 20000, 25000]}
              stroke="#4B5A70"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#26364B' }}
              tickFormatter={(val) => (val === 0 ? '0' : `${val / 1000}k`)}
              tick={{ fill: '#8995A7' }}
            />

            <Tooltip content={<CustomDetectionTooltip />} />

            <Area
              type="monotone"
              dataKey="competitorMentions"
              stroke="#F59E35"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#compAreaGrad)"
              name="Competitor Mentions"
              dot={false}
              activeDot={{
                r: 4,
                stroke: '#F59E35',
                strokeWidth: 2,
                fill: '#0D1728'
              }}
            />

            <Area
              type="monotone"
              dataKey="brandMentions"
              stroke="#19D9A0"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#brandAreaGrad)"
              name="Brand Mentions"
              dot={false}
              activeDot={{
                r: 5,
                stroke: '#19D9A0',
                strokeWidth: 2,
                fill: '#0D1728'
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
