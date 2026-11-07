import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { liveMentionsData, LiveMention } from '../../data/mockData';
import {
  Smile,
  Frown,
  Meh,
  Radio,
  Search,
  MessageSquare,
  Globe,
  Camera,
  Share2
} from 'lucide-react';

export const LiveMentionsFeed: React.FC = () => {
  const [filterSentiment, setFilterSentiment] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getSourceIcon = (source: LiveMention['source']) => {
    switch (source) {
      case 'Twitter':
        return <span className="font-bold text-[10px] text-[#2185F5]">𝕏</span>;
      case 'Reddit':
        return <MessageSquare className="w-3 h-3 text-[#FF4500]" />;
      case 'News':
        return <Globe className="w-3 h-3 text-[#19D9A0]" />;
      case 'Instagram':
        return <Camera className="w-3 h-3 text-[#E1306C]" />;
      case 'Google':
      default:
        return <Search className="w-3 h-3 text-[#F59E35]" />;
    }
  };

  const getSentimentIcon = (sentiment: LiveMention['sentiment']) => {
    switch (sentiment) {
      case 'positive':
        return (
          <div className="flex items-center space-x-1 text-[#19D9A0]" title="Positive sentiment">
            <Smile className="w-3.5 h-3.5 shrink-0" />
          </div>
        );
      case 'negative':
        return (
          <div className="flex items-center space-x-1 text-[#F59E35]" title="Negative sentiment">
            <Frown className="w-3.5 h-3.5 shrink-0" />
          </div>
        );
      case 'neutral':
      default:
        return (
          <div className="flex items-center space-x-1 text-[#ECC94B]" title="Neutral sentiment">
            <Meh className="w-3.5 h-3.5 shrink-0" />
          </div>
        );
    }
  };

  const filteredMentions = liveMentionsData.filter((item) => {
    if (filterSentiment !== 'all' && item.sentiment !== filterSentiment) return false;
    if (
      searchQuery &&
      !item.text.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.source.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <Card
      title={
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold tracking-wider text-[#F3F6FA] uppercase">
            LIVE BRAND MENTIONS FEED
          </span>
        </div>
      }
      headerAction={
        <div className="flex items-center space-x-2">
          {/* Pulsing indicator */}
          <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-[#19D9A0]/10 text-[#19D9A0] text-[10px] font-semibold border border-[#19D9A0]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#19D9A0] animate-ping" />
            <span>LIVE</span>
          </div>
        </div>
      }
      className="h-[330px]"
      bodyClassName="p-0 flex flex-col justify-between"
    >
      {/* Table Header */}
      <div className="grid grid-cols-12 px-3 py-1.5 bg-[#0D1728]/90 text-[10px] font-semibold text-[#8995A7] border-b border-[#26364B] uppercase tracking-wider shrink-0">
        <span className="col-span-2">Time</span>
        <span className="col-span-2">Source</span>
        <span className="col-span-1 text-center">Sent</span>
        <span className="col-span-5">Mention Text</span>
        <span className="col-span-2 text-right">Target</span>
      </div>

      {/* Feed List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#26364B]/40">
        {filteredMentions.map((mention) => (
          <div
            key={mention.id}
            className="grid grid-cols-12 px-3 py-2 text-xs items-center hover:bg-[#15243B]/60 transition-colors cursor-pointer group"
          >
            {/* Timestamp */}
            <div className="col-span-2 flex flex-col">
              <span className="text-[11px] font-medium text-[#F3F6FA]">
                {mention.timestamp}
              </span>
              <span className="text-[9px] text-[#8995A7]">{mention.timeAgo}</span>
            </div>

            {/* Source */}
            <div className="col-span-2 flex items-center space-x-1.5">
              <span className="p-1 rounded bg-[#0D1728] border border-[#26364B] shrink-0">
                {getSourceIcon(mention.source)}
              </span>
              <span className="text-[11px] text-[#A0AEC0] truncate">
                {mention.source}
              </span>
            </div>

            {/* Sentiment */}
            <div className="col-span-1 flex justify-center">
              {getSentimentIcon(mention.sentiment)}
            </div>

            {/* Text snippet */}
            <div className="col-span-5 pr-2">
              <p
                className="text-[11px] text-[#E2E8F0] line-clamp-2 group-hover:text-white leading-snug"
                title={mention.text}
              >
                {mention.text}
              </p>
            </div>

            {/* Competitor / Entity Tag */}
            <div className="col-span-2 flex justify-end">
              {mention.competitor ? (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#F59E35]/15 text-[#F59E35] border border-[#F59E35]/25 truncate max-w-full">
                  {mention.competitor}
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#19D9A0]/15 text-[#19D9A0] border border-[#19D9A0]/25 truncate">
                  BrandVision
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer quick search & sentiment summary */}
      <div className="px-3 py-1.5 bg-[#0D1728] border-t border-[#26364B] flex items-center justify-between text-[11px] text-[#8995A7] shrink-0">
        <div className="flex items-center space-x-2">
          <span>6 entries captured</span>
          <span className="text-[#26364B]">•</span>
          <span className="text-[#19D9A0] font-medium">Latency: 124ms</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setFilterSentiment('all')}
            className={`px-1.5 py-0.5 rounded text-[10px] ${
              filterSentiment === 'all'
                ? 'bg-[#19D9A0]/20 text-[#19D9A0] font-semibold'
                : 'hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterSentiment('positive')}
            className={`px-1.5 py-0.5 rounded text-[10px] ${
              filterSentiment === 'positive'
                ? 'bg-[#19D9A0]/20 text-[#19D9A0] font-semibold'
                : 'hover:text-white'
            }`}
          >
            +
          </button>
          <button
            onClick={() => setFilterSentiment('negative')}
            className={`px-1.5 py-0.5 rounded text-[10px] ${
              filterSentiment === 'negative'
                ? 'bg-[#F59E35]/20 text-[#F59E35] font-semibold'
                : 'hover:text-white'
            }`}
          >
            -
          </button>
        </div>
      </div>
    </Card>
  );
};
