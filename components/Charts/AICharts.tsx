'use client';

import React, { useState, useCallback } from 'react';
import { 
  Brain, 
  Lightbulb, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  ScatterChart,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Target,
  Zap
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend,
  CartesianGrid, BarChart, Bar, PieChart as RechartsPie, Pie, Cell, 
  ScatterChart as RechartsScatter, Scatter, Area, AreaChart
} from 'recharts';

interface AIChart {
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'histogram' | 'area';
  data: any[];
  config: {
    x_axis?: string;
    y_axis?: string;
    color_by?: string;
    category?: string;
    is_histogram?: boolean;
  };
  ai_metadata: {
    title: string;
    description: string;
    insights: string[];
    recommended_by: 'AI' | 'fallback';
    confidence?: number;
  };
}

interface AIChartsProps {
  charts: Record<string, AIChart>;
  metadata?: {
    primary_insights: string[];
    data_story: string;
    overall_confidence?: number;
  };
}

const COLORS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
];

const SOLID_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

// Enhanced Tooltip with proper typing
interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-xl border border-white/20 bg-gray-900/95 backdrop-blur-xl px-4 py-3 shadow-2xl">
      <div className="font-semibold text-white mb-2 border-b border-white/10 pb-1">
        {label || 'Data Point'}
      </div>
      <div className="space-y-1">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full shadow-sm"
                style={{ background: entry.color }}
              />
              <span className="text-gray-300">{entry.name || entry.dataKey}:</span>
            </div>
            <span className="font-mono font-semibold text-white">
              {typeof entry.value === 'number' 
                ? entry.value.toLocaleString(undefined, { maximumFractionDigits: 2 })
                : entry.value
              }
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Loading Skeleton
const ChartSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-700 rounded w-5/6 mb-6"></div>
    <div className="h-64 bg-gray-700 rounded-xl mb-4"></div>
    <div className="space-y-2">
      <div className="h-3 bg-gray-700 rounded w-full"></div>
      <div className="h-3 bg-gray-700 rounded w-4/5"></div>
    </div>
  </div>
);

// Confidence Indicator
const ConfidenceBadge: React.FC<{ confidence: number }> = ({ confidence }) => {
  const getColor = (conf: number) => {
    if (conf >= 0.8) return 'text-green-400 bg-green-400/20';
    if (conf >= 0.6) return 'text-yellow-400 bg-yellow-400/20';
    return 'text-red-400 bg-red-400/20';
  };

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getColor(confidence)}`}>
      <Target className="h-3 w-3" />
      {Math.round(confidence * 100)}% confidence
    </div>
  );
};

export default function AICharts({ charts, metadata }: AIChartsProps) {
  const [expandedCharts, setExpandedCharts] = useState<Set<string>>(new Set());
  const [hoveredChart, setHoveredChart] = useState<string | null>(null);

  const chartEntries = Object.entries(charts);

  const toggleChartExpansion = useCallback((chartId: string) => {
    setExpandedCharts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(chartId)) {
        newSet.delete(chartId);
      } else {
        newSet.add(chartId);
      }
      return newSet;
    });
  }, []);

  // Fixed pie chart label renderer using Recharts compatible approach
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name
  }: any) => {
    if (!percent || percent < 0.05) return null;

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="500"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Alternative approach using a simple string label for pie chart
  const renderSimplePieLabel = (entry: any) => {
    return `${entry.name}: ${((entry.value / entry.payload.total) * 100).toFixed(0)}%`;
  };

  const renderChart = (chartId: string, chart: AIChart) => {
    const { type, data, config, ai_metadata } = chart;
    const isExpanded = expandedCharts.has(chartId);
    const isHovered = hoveredChart === chartId;

    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 20 }
    };

    const chartProps = {
      ...commonProps,
      onMouseEnter: () => setHoveredChart(chartId),
      onMouseLeave: () => setHoveredChart(null),
      className: `transition-all duration-300 ${isHovered ? 'scale-[1.02]' : 'scale-100'}`
    };

    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={isExpanded ? 400 : 300}>
            <LineChart {...chartProps}>
              <defs>
                <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0088FE" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0088FE" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey={config.x_axis || 'x'} 
                stroke="rgba(255,255,255,0.6)"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.6)"
                fontSize={12}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
            
              <Line 
                type="monotone" 
                dataKey={config.y_axis || 'y'} 
                stroke="#0088FE" 
                strokeWidth={3}
                dot={{ fill: '#0088FE', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 8, fill: '#0088FE', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={isExpanded ? 400 : 300}>
            <AreaChart {...chartProps}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey={config.x_axis || 'x'} 
                stroke="rgba(255,255,255,0.6)"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.6)"
                fontSize={12}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey={config.y_axis || 'y'} 
                stroke="#8884d8" 
                fill="url(#areaGradient)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={isExpanded ? 400 : 300}>
            <BarChart {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey={config.x_axis || 'name'} 
                stroke="rgba(255,255,255,0.6)"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.6)"
                fontSize={12}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey={config.y_axis || 'value'} 
                fill="url(#barGradient)"
                radius={[6, 6, 0, 0]}
              />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00C49F" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#00C49F" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        // Calculate total for percentage calculation
        const total = data.reduce((sum, entry) => sum + (entry.value || 0), 0);
        
        return (
          <ResponsiveContainer width="100%" height={isExpanded ? 400 : 300}>
            <RechartsPie>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) => {
            return `${name}: ${(percent * 100).toFixed(0)}%`;
          }}
                outerRadius={isExpanded ? 120 : 100}
                innerRadius={isExpanded ? 60 : 40}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={SOLID_COLORS[index % SOLID_COLORS.length]}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip 
                content={<CustomTooltip />}
                formatter={(value: number, name: string) => [
                  value,
                  `${name} (${total > 0 ? ((value / total) * 100).toFixed(1) : '0'}%)`
                ]}
              />
              <Legend 
                wrapperStyle={{
                  color: 'white',
                  fontSize: '12px',
                  paddingTop: '20px'
                }}
                formatter={(value, entry, index) => {
                  const dataEntry = data[index];
                  const percentage = total > 0 ? ((dataEntry.value / total) * 100).toFixed(0) : '0';
                  return `${value} (${percentage}%)`;
                }}
              />
            </RechartsPie>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={isExpanded ? 400 : 300}>
            <RechartsScatter {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey={config.x_axis || 'x'} 
                stroke="rgba(255,255,255,0.6)"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                dataKey={config.y_axis || 'y'} 
                stroke="rgba(255,255,255,0.6)"
                fontSize={12}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Scatter 
                dataKey={config.y_axis || 'y'} 
                fill="#FF8042"
                shape={(props: any) => (
                  <circle 
                    cx={props.cx} 
                    cy={props.cy} 
                    r={isHovered ? 6 : 4}
                    fill="#FF8042"
                    stroke="#fff"
                    strokeWidth={1}
                    className="transition-all duration-200"
                  />
                )}
              />
            </RechartsScatter>
          </ResponsiveContainer>
        );

      default:
        return (
          <div className="h-64 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-600 rounded-xl">
            Chart type not supported: {type}
          </div>
        );
    }
  };

  if (chartEntries.length === 0) {
    return <ChartSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Enhanced AI Insights Header */}
      {metadata && (
        <div className="relative rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-8 backdrop-blur-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30">
                <Brain className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">AI Narrative Summary</h3>
                {metadata.overall_confidence && (
                  <ConfidenceBadge confidence={metadata.overall_confidence} />
                )}
              </div>
            </div>
            
            <p className="text-gray-200 mb-6 text-sm text-justify  leading-relaxed relative z-10">
              {metadata.data_story}
            </p>
            
            <div className="grid gap-3 md:grid-cols-2">
              {metadata.primary_insights.map((insight, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all duration-300"
                >
                  <div className="p-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                    <Zap className="h-4 w-4 text-cyan-400" />
                  </div>
                  <span className="text-gray-200 text-sm flex-1">{insight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Interactive Charts Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {chartEntries.map(([chartId, chart]) => {
          const isExpanded = expandedCharts.has(chartId);
          const isHovered = hoveredChart === chartId;
          
          return (
            <div 
              key={chartId}
              className={`group relative rounded-2xl border transition-all duration-500 backdrop-blur-sm ${
                isHovered 
                  ? 'border-cyan-500/40 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 shadow-2xl shadow-cyan-500/10' 
                  : 'border-white/10 bg-white/[0.02] shadow-xl'
              }`}
              onMouseEnter={() => setHoveredChart(chartId)}
              onMouseLeave={() => setHoveredChart(null)}
            >
              {/* Chart Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-all duration-300 ${
                      isHovered ? 'bg-cyan-500/20 border border-cyan-500/30' : 'bg-white/5'
                    }`}>
                      {chart.type === 'line' && <TrendingUp className="h-5 w-5 text-blue-400" />}
                      {chart.type === 'bar' && <BarChart3 className="h-5 w-5 text-green-400" />}
                      {chart.type === 'pie' && <PieChart className="h-5 w-5 text-purple-400" />}
                      {chart.type === 'scatter' && <ScatterChart className="h-5 w-5 text-orange-400" />}
                      {chart.type === 'area' && <BarChart3 className="h-5 w-5 text-cyan-400" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg">{chart.ai_metadata.title}</h4>
                      <p className="text-sm text-gray-400 mt-1">{chart.ai_metadata.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {chart.ai_metadata.confidence && (
                      <ConfidenceBadge confidence={chart.ai_metadata.confidence} />
                    )}
                    <button
                      onClick={() => toggleChartExpansion(chartId)}
                      className={`p-2 rounded-lg border transition-all duration-300 ${
                        isHovered 
                          ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400' 
                          : 'border-white/10 bg-white/5 text-gray-400'
                      }`}
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Chart Visualization */}
              <div className="px-6">
                {renderChart(chartId, chart)}
              </div>

              {/* Enhanced AI Insights */}
              <div className="p-6 pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  <span className="text-sm font-semibold text-gray-300">AI Insights</span>
                </div>
                <div className="space-y-3">
                  {chart.ai_metadata.insights.map((insight, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-300"
                    >
                      <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0 animate-pulse" />
                      <span className="text-sm text-gray-300 leading-relaxed">{insight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}