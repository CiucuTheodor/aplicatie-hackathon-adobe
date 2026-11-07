import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Card } from '../ui/Card';
import { shareOfVoiceData } from '../../data/mockData';
import { MoreHorizontal } from 'lucide-react';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#0D1728] border border-[#26364B] rounded-lg p-2.5 shadow-xl text-xs backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: data.color }}
          />
          <span className="font-semibold text-white">{data.name}</span>
        </div>
        <div className="mt-1 flex items-baseline justify-between space-x-4">
          <span className="text-[#8995A7]">Share of Voice:</span>
          <span className="font-bold text-[#F3F6FA] text-sm">{data.share}%</span>
        </div>
      </div>
    );
  }
  return null;
};

// Custom shape or label renderer for rounded top bars and percentage above bar
const renderCustomBarLabel = (props: any) => {
  const { x, y, width, value } = props;
  return (
    <text
      x={x + width / 2}
      y={y - 8}
      fill="#F3F6FA"
      textAnchor="middle"
      fontSize="11"
      fontWeight="700"
      fontFamily="Inter, sans-serif"
    >
      {`${value}%`}
    </text>
  );
};

export const ShareOfVoiceChart: React.FC = () => {
  return (
    <Card
      title="COMPETITOR SHARE OF VOICE"
      subtitle="(Last 30 Days)"
      headerAction={
        <button
          className="text-[#8995A7] hover:text-[#F3F6FA] p-1 rounded hover:bg-[#162235] transition-colors"
          title="More options"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      }
      className="h-[330px] flex flex-col justify-between"
      bodyClassName="flex flex-col justify-between p-3.5"
    >
      <div className="w-full flex-1 min-h-[190px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={shareOfVoiceData}
            margin={{ top: 22, right: 10, left: -16, bottom: 0 }}
            barSize={38}
          >
            <defs>
              <linearGradient id="brandEmeraldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#19D9A0" stopOpacity={1} />
                <stop offset="100%" stopColor="#0B7354" stopOpacity={0.85} />
              </linearGradient>
              <linearGradient id="compBlueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2185F5" stopOpacity={1} />
                <stop offset="100%" stopColor="#114C91" stopOpacity={0.85} />
              </linearGradient>
              <linearGradient id="compOrangeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E35" stopOpacity={1} />
                <stop offset="100%" stopColor="#9C5D14" stopOpacity={0.85} />
              </linearGradient>
              <linearGradient id="othersGrayGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8995A7" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#4A5668" stopOpacity={0.8} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="name"
              stroke="#4B5A70"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#26364B' }}
              tick={{ fill: '#8995A7' }}
              interval={0}
            />
            <YAxis
              domain={[0, 60]}
              ticks={[0, 15, 30, 45, 60]}
              stroke="#4B5A70"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#26364B' }}
              tickFormatter={(val) => `${val}%`}
              tick={{ fill: '#8995A7' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} />
            <Bar
              dataKey="share"
              radius={[6, 6, 0, 0]}
              label={renderCustomBarLabel}
              animationDuration={1200}
            >
              {shareOfVoiceData.map((entry, index) => {
                const gradIds = [
                  'url(#brandEmeraldGrad)',
                  'url(#compBlueGrad)',
                  'url(#compOrangeGrad)',
                  'url(#othersGrayGrad)'
                ];
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={gradIds[index % gradIds.length]}
                    className="hover:opacity-90 transition-opacity cursor-pointer"
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend underneath */}
      <div className="pt-2 border-t border-[#26364B]/60 grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
        {shareOfVoiceData.map((item) => (
          <div key={item.name} className="flex items-center space-x-1.5 truncate">
            <span
              className="w-2.5 h-2.5 rounded-sm shrink-0 shadow-sm"
              style={{ backgroundColor: item.color }}
            />
            <div className="flex flex-col truncate">
              <span className="text-[10px] text-[#A0AEC0] truncate leading-tight">
                {item.name}
              </span>
              <span className="text-[11px] font-bold text-white leading-none">
                {item.share}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
