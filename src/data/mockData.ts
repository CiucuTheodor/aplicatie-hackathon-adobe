export interface ShareOfVoiceItem {
  name: string;
  share: number;
  color: string;
  gradientStart: string;
  gradientEnd: string;
}

export const shareOfVoiceData: ShareOfVoiceItem[] = [
  {
    name: 'Your Brand',
    share: 42,
    color: '#19D9A0',
    gradientStart: '#19D9A0',
    gradientEnd: '#10936C'
  },
  {
    name: 'Competitor A',
    share: 28,
    color: '#2185F5',
    gradientStart: '#2185F5',
    gradientEnd: '#1358A8'
  },
  {
    name: 'Competitor B',
    share: 18,
    color: '#F59E35',
    gradientStart: '#F59E35',
    gradientEnd: '#B86B14'
  },
  {
    name: 'Others',
    share: 12,
    color: '#8995A7',
    gradientStart: '#8995A7',
    gradientEnd: '#556377'
  }
];

export interface TrendDataPoint {
  date: string;
  brandMentions: number;
  competitorMentions: number;
}

export const detectionTrends30d: TrendDataPoint[] = [
  { date: 'Oct 01', brandMentions: 11200, competitorMentions: 9800 },
  { date: 'Oct 04', brandMentions: 13400, competitorMentions: 10200 },
  { date: 'Oct 07', brandMentions: 12100, competitorMentions: 11400 },
  { date: 'Oct 10', brandMentions: 16800, competitorMentions: 12300 },
  { date: 'Oct 13', brandMentions: 15200, competitorMentions: 13900 },
  { date: 'Oct 16', brandMentions: 21500, competitorMentions: 14200 },
  { date: 'Oct 19', brandMentions: 18900, competitorMentions: 13100 },
  { date: 'Oct 22', brandMentions: 24200, competitorMentions: 15600 },
  { date: 'Oct 25', brandMentions: 22100, competitorMentions: 16800 },
  { date: 'Oct 28', brandMentions: 23800, competitorMentions: 17200 },
  { date: 'Oct 31', brandMentions: 24800, competitorMentions: 16400 },
];

export const detectionTrends60d: TrendDataPoint[] = [
  { date: 'Sep 01', brandMentions: 9500, competitorMentions: 8900 },
  { date: 'Sep 08', brandMentions: 11800, competitorMentions: 9400 },
  { date: 'Sep 15', brandMentions: 17200, competitorMentions: 10500 },
  { date: 'Sep 22', brandMentions: 14300, competitorMentions: 11200 },
  { date: 'Sep 30', brandMentions: 13900, competitorMentions: 10800 },
  { date: 'Oct 07', brandMentions: 15100, competitorMentions: 11400 },
  { date: 'Oct 14', brandMentions: 19800, competitorMentions: 13200 },
  { date: 'Oct 21', brandMentions: 23400, competitorMentions: 15100 },
  { date: 'Oct 31', brandMentions: 24800, competitorMentions: 16400 },
];

export const detectionTrends90d: TrendDataPoint[] = [
  { date: 'Aug 01', brandMentions: 7800, competitorMentions: 8200 },
  { date: 'Aug 15', brandMentions: 9400, competitorMentions: 8800 },
  { date: 'Aug 30', brandMentions: 10600, competitorMentions: 9100 },
  { date: 'Sep 15', brandMentions: 18500, competitorMentions: 11200 },
  { date: 'Sep 30', brandMentions: 14200, competitorMentions: 11800 },
  { date: 'Oct 15', brandMentions: 21900, competitorMentions: 14500 },
  { date: 'Oct 31', brandMentions: 24800, competitorMentions: 16400 },
];

export interface LiveMention {
  id: string;
  timestamp: string;
  timeAgo: string;
  source: 'Twitter' | 'Reddit' | 'Google' | 'Instagram' | 'News';
  sentiment: 'positive' | 'negative' | 'neutral';
  text: string;
  competitor?: string;
  author: string;
  reach: string;
}

export const liveMentionsData: LiveMention[] = [
  {
    id: 'm1',
    timestamp: '10:24 AM',
    timeAgo: '2m ago',
    source: 'Twitter',
    sentiment: 'positive',
    text: 'Switched our cluster observability stack to BrandVision. The telemetry alerts caught a memory spike 20m before Datadog!',
    competitor: 'Datadog',
    author: '@devops_ninja',
    reach: '14.2k'
  },
  {
    id: 'm2',
    timestamp: '10:18 AM',
    timeAgo: '8m ago',
    source: 'Reddit',
    sentiment: 'positive',
    text: 'r/devops: Honest review of BrandVision after 90 days in production. Thread inside on query latency and APM overhead.',
    competitor: 'Dynatrace',
    author: 'u/cloud_architect',
    reach: '38.5k'
  },
  {
    id: 'm3',
    timestamp: '10:05 AM',
    timeAgo: '21m ago',
    source: 'News',
    sentiment: 'neutral',
    text: 'TechCrunch: SaaS Observability landscape shifts as AI-native telemetry platforms gain enterprise market share.',
    competitor: 'Competitor A',
    author: 'TechCrunch Enterprise',
    reach: '180k'
  },
  {
    id: 'm4',
    timestamp: '09:47 AM',
    timeAgo: '39m ago',
    source: 'Twitter',
    sentiment: 'negative',
    text: 'Still waiting on the new webhook rate limiting docs. Competitor B had this feature out last quarter.',
    competitor: 'Competitor B',
    author: '@api_builder',
    reach: '3.1k'
  },
  {
    id: 'm5',
    timestamp: '09:22 AM',
    timeAgo: '1h ago',
    source: 'Google',
    sentiment: 'positive',
    text: 'G2 Crowd Review: "BrandVision automated our entire competitor tracking workflow. 5/5 stars for AI trend detection."',
    author: 'VP Engineering, FinTech',
    reach: '12.4k'
  },
  {
    id: 'm6',
    timestamp: '08:50 AM',
    timeAgo: '2h ago',
    source: 'Instagram',
    sentiment: 'neutral',
    text: 'Behind the scenes at KubeCon! Testing BrandVision real-time anomaly detection booth demo.',
    competitor: 'Competitor A',
    author: '@cloud_daily',
    reach: '9.8k'
  }
];

export interface SentimentDataPoint {
  month: string;
  positive: number;
  negative: number;
  neutral: number;
  competitorA: number;
  competitorB: number;
}

export const sentimentTrendData: SentimentDataPoint[] = [
  {
    month: 'August',
    positive: 35,
    negative: -15,
    neutral: 42,
    competitorA: 20,
    competitorB: -5
  },
  {
    month: 'September',
    positive: 62,
    negative: -28,
    neutral: 48,
    competitorA: 38,
    competitorB: 12
  },
  {
    month: 'October',
    positive: 84,
    negative: -12,
    neutral: 54,
    competitorA: 52,
    competitorB: -18
  },
  {
    month: 'November',
    positive: 92,
    negative: -8,
    neutral: 60,
    competitorA: 64,
    competitorB: 5
  }
];

export interface CompetingTopic {
  title: string;
  percentage: number;
  color: string;
  gradient: string;
}

export const competingTopicsData: CompetingTopic[] = [
  {
    title: 'Cloud Scaling',
    percentage: 42,
    color: '#19D9A0',
    gradient: 'from-[#19D9A0] to-[#10936C]'
  },
  {
    title: 'Security',
    percentage: 21,
    color: '#19D9A0',
    gradient: 'from-[#19D9A0] to-[#14B8A6]'
  },
  {
    title: 'Analytics',
    percentage: 18,
    color: '#14B8A6',
    gradient: 'from-[#14B8A6] to-[#0D9488]'
  },
  {
    title: 'Automation',
    percentage: 10,
    color: '#F59E35',
    gradient: 'from-[#F59E35] to-[#B86B14]'
  }
];

export interface CompetitorMetric {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  benchmark: string;
}

export const competitorMetricsData: CompetitorMetric[] = [
  {
    title: 'Share of Voice',
    value: '42%',
    change: '+3.8%',
    isPositive: true,
    benchmark: 'vs previous period'
  },
  {
    title: 'Reach',
    value: '2.1M',
    change: '+14.2%',
    isPositive: true,
    benchmark: 'vs previous period'
  },
  {
    title: 'Engagement',
    value: '89k',
    change: '+8.5%',
    isPositive: true,
    benchmark: 'vs previous period'
  }
];
