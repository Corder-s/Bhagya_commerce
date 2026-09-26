'use client';

import React, { useState, useId } from 'react';
import { formatCurrency, formatNumber } from '@/lib/format';
import { TrendingUp, ShoppingBag, Eye, Info } from 'lucide-react';
import { useTheme } from '@/context/theme-context';

export interface TrendPoint {
  date: string;
  grossSales: number;
  netSales: number;
  orderCount: number;
}

interface RevenueOrderTrendChartProps {
  trendPoints: TrendPoint[];
  storeName?: string;
  currency?: string;
  height?: number;
}

export function RevenueOrderTrendChart({
  trendPoints = [],
  storeName = 'Your Store',
  currency = 'INR',
  height = 320,
}: RevenueOrderTrendChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [activeMetric, setActiveMetric] = useState<'both' | 'net' | 'gross'>('both');
  const gradientId = useId();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // Section 24 & 25 Chart Theme mapping
  const gridColor = isDark ? '#4B514B' : '#DDD4C4';
  const axisColor = isDark ? '#B3ADA2' : '#737D76';
  const primaryLineColor = isDark ? '#A8B9AF' : '#708477';
  const secondaryLineColor = isDark ? '#82968A' : '#A8B9AF';
  const highlightColor = isDark ? '#E2B84B' : '#D7A63A';

  // Validate data
  const validPoints = (trendPoints || []).filter(
    (p) =>
      p &&
      typeof p.date === 'string' &&
      !isNaN(Number(p.grossSales)) &&
      !isNaN(Number(p.netSales))
  );

  if (validPoints.length === 0) {
    return (
      <div
        style={{ height: `${height}px` }}
        className="flex flex-col items-center justify-center rounded-2xl border border-line bg-surface p-6 text-center"
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-surface-sunken text-primary mb-3">
          <Info className="size-6" />
        </div>
        <h4 className="font-serif text-base font-semibold text-ink">
          No sales data available for this period
        </h4>
        <p className="mt-1 max-w-sm text-xs text-ink-soft">
          Daily revenue trajectory and order count will populate automatically once your store receives checkout orders.
        </p>
      </div>
    );
  }

  const maxSales = Math.max(
    ...validPoints.map((p) => Math.max(Number(p.grossSales) || 0, Number(p.netSales) || 0)),
    1000
  );
  const maxOrders = Math.max(...validPoints.map((p) => Number(p.orderCount) || 0), 5);

  const padding = { top: 30, right: 20, bottom: 40, left: 55 };
  const svgWidth = 700;
  const svgHeight = height;
  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  const pointsCount = validPoints.length;
  const getX = (index: number) => {
    if (pointsCount <= 1) return padding.left + plotWidth / 2;
    return padding.left + (index / (pointsCount - 1)) * plotWidth;
  };

  const getY = (val: number) => {
    const ratio = Math.min(1, Math.max(0, val / (maxSales * 1.15)));
    return padding.top + plotHeight - ratio * plotHeight;
  };

  // Generate smooth SVG paths
  const grossCoords = validPoints.map((pt, i) => ({ x: getX(i), y: getY(pt.grossSales) }));
  const netCoords = validPoints.map((pt, i) => ({ x: getX(i), y: getY(pt.netSales) }));

  const createLinePath = (coords: Array<{ x: number; y: number }>) => {
    if (coords.length === 0) return '';
    return coords.reduce((acc, curr, idx, arr) => {
      if (idx === 0) return `M ${curr.x} ${curr.y}`;
      const prev = arr[idx - 1];
      const cpX1 = prev.x + (curr.x - prev.x) / 2;
      const cpY1 = prev.y;
      const cpX2 = prev.x + (curr.x - prev.x) / 2;
      const cpY2 = curr.y;
      return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
    }, '');
  };

  const createAreaPath = (coords: Array<{ x: number; y: number }>) => {
    if (coords.length === 0) return '';
    const line = createLinePath(coords);
    const lastX = coords[coords.length - 1].x;
    const firstX = coords[0].x;
    const bottomY = padding.top + plotHeight;
    return `${line} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  const netPath = createLinePath(netCoords);
  const netAreaPath = createAreaPath(netCoords);
  const grossPath = createLinePath(grossCoords);

  // Grid steps (4 horizontal guides)
  const ySteps = [0, 0.33, 0.66, 1];
  const activePoint = hoveredIdx !== null ? validPoints[hoveredIdx] : null;

  return (
    <div className="flex flex-col w-full rounded-2xl border border-line bg-surface p-4 sm:p-6 shadow-sm">
      {/* Header controls & toggles */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-lg font-bold text-ink">
              Revenue & Order Volume
            </h3>
            <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-[#DFEAE2] dark:bg-[#294437] text-[#5D8067] dark:text-[#78A383] border border-[#B0C9B6] dark:border-[#385947]">
              <TrendingUp className="size-3" /> Live Realtime
            </span>
          </div>
          <p className="text-xs text-ink-soft mt-0.5">
            Trajectories across daily checkouts for <strong className="text-ink">{storeName}</strong>
          </p>
        </div>

        {/* View toggles */}
        <div className="flex items-center rounded-xl bg-[#EDF2EE] dark:bg-[#30332F] p-1 border border-line text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveMetric('both')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeMetric === 'both'
                ? 'bg-surface text-primary shadow-xs font-semibold'
                : 'text-ink-soft hover:text-ink'
            }`}
          >
            All Trajectories
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('net')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeMetric === 'net'
                ? 'bg-surface text-primary shadow-xs font-semibold'
                : 'text-ink-soft hover:text-ink'
            }`}
          >
            Net Sales
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('gross')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeMetric === 'gross'
                ? 'bg-surface text-primary shadow-xs font-semibold'
                : 'text-ink-soft hover:text-ink'
            }`}
          >
            Gross Sales
          </button>
        </div>
      </div>

      {/* Main SVG Render Area */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: `${height}px` }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full overflow-visible select-none"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Net Sales Soft Glow Gradient */}
            <linearGradient id={`${gradientId}-net`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={primaryLineColor} stopOpacity={isDark ? "0.32" : "0.20"} />
              <stop offset="70%" stopColor={primaryLineColor} stopOpacity={isDark ? "0.08" : "0.04"} />
              <stop offset="100%" stopColor={primaryLineColor} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines & Y-Axis Labels */}
          {ySteps.map((ratio, i) => {
            const yPos = padding.top + plotHeight * (1 - ratio);
            const val = maxSales * 1.15 * ratio;
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={yPos}
                  x2={svgWidth - padding.right}
                  y2={yPos}
                  stroke={gridColor}
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={yPos + 4}
                  textAnchor="end"
                  fill={axisColor}
                  fontSize="10.5"
                  fontFamily="sans-serif"
                >
                  {val >= 1000 ? `₹${(val / 1000).toFixed(0)}k` : `₹${val.toFixed(0)}`}
                </text>
              </g>
            );
          })}

          {/* Area Fill for Net Sales */}
          {(activeMetric === 'both' || activeMetric === 'net') && (
            <path d={netAreaPath} fill={`url(#${gradientId}-net)`} />
          )}

          {/* Gross Sales Line */}
          {(activeMetric === 'both' || activeMetric === 'gross') && (
            <path
              d={grossPath}
              fill="none"
              stroke={secondaryLineColor}
              strokeWidth="2"
              strokeDasharray="4 4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Net Sales Primary Path */}
          {(activeMetric === 'both' || activeMetric === 'net') && (
            <path
              d={netPath}
              fill="none"
              stroke={primaryLineColor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Interactive Plot Points */}
          {validPoints.map((pt, i) => {
            const isHovered = hoveredIdx === i;
            const x = getX(i);
            const yNet = getY(pt.netSales);
            const yGross = getY(pt.grossSales);

            return (
              <g key={pt.date} className="cursor-pointer">
                {/* Vertical hover guide bar */}
                {isHovered && (
                  <line
                    x1={x}
                    y1={padding.top}
                    x2={x}
                    y2={padding.top + plotHeight}
                    stroke={highlightColor}
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Gross Point */}
                {(activeMetric === 'both' || activeMetric === 'gross') && (
                  <circle
                    cx={x}
                    cy={yGross}
                    r={isHovered ? 5 : 3.5}
                    fill={isDark ? '#30332F' : '#FCFAF5'}
                    stroke={secondaryLineColor}
                    strokeWidth={isHovered ? 2.5 : 2}
                    className="transition-all duration-150"
                  />
                )}

                {/* Net Point */}
                {(activeMetric === 'both' || activeMetric === 'net') && (
                  <circle
                    cx={x}
                    cy={yNet}
                    r={isHovered ? 6 : 4}
                    fill={highlightColor}
                    stroke={isDark ? '#F5F1E7' : '#20231F'}
                    strokeWidth={isHovered ? 2.5 : 1.5}
                    className="transition-all duration-150"
                  />
                )}

                {/* Transparent Overlay Trigger per point */}
                <rect
                  x={x - plotWidth / (pointsCount * 2)}
                  y={padding.top}
                  width={plotWidth / pointsCount}
                  height={plotHeight}
                  fill="transparent"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />

                {/* X-Axis Date Labels */}
                <text
                  x={x}
                  y={padding.top + plotHeight + 22}
                  textAnchor="middle"
                  fill={isHovered ? (isDark ? '#F5F1E7' : '#20231F') : axisColor}
                  fontWeight={isHovered ? '600' : '400'}
                  fontSize="11"
                  fontFamily="sans-serif"
                >
                  {pt.date.length > 5 ? pt.date.substring(5) : pt.date}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Dynamic Theme-Aware Floating Tooltip */}
        {activePoint && hoveredIdx !== null && (
          <div
            style={{
              left: `${((getX(hoveredIdx) - padding.left) / plotWidth) * 80 + 10}%`,
              top: '15px',
            }}
            className={`pointer-events-none absolute z-20 min-w-[170px] rounded-xl border p-3 shadow-xl animate-in fade-in zoom-in-95 ${
              isDark
                ? 'border-[#5C625B] bg-[#3E433D] text-[#F5F1E7]'
                : 'border-[#DDD4C4] bg-[#FCFAF5] text-[#20231F]'
            }`}
          >
            <div className={`flex items-center justify-between border-b pb-1.5 mb-2 ${isDark ? 'border-[#4B514B]' : 'border-[#E7DFD0]'}`}>
              <span className="font-serif text-xs font-bold">
                {activePoint.date}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-[#5D8067] dark:text-[#78A383]">
                <ShoppingBag className="size-3" /> {activePoint.orderCount} orders
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-ink-soft flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-[#D7A63A] dark:bg-[#E2B84B]" /> Net Sales
                </span>
                <strong className="font-semibold text-primary">
                  {formatCurrency(activePoint.netSales)}
                </strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-ink-soft flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-ink-soft" /> Gross Sales
                </span>
                <span className="font-medium text-ink">
                  {formatCurrency(activePoint.grossSales)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chart Footer Summary Bar */}
      <div className="mt-2 pt-3 border-t border-line flex flex-wrap items-center justify-between text-xs text-ink-soft gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-primary" />
            <strong className="text-ink">
              {formatCurrency(validPoints.reduce((sum, p) => sum + p.netSales, 0))}
            </strong>{' '}
            Net Volume
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-ink-soft" />
            <strong className="text-ink-soft">
              {formatCurrency(validPoints.reduce((sum, p) => sum + p.grossSales, 0))}
            </strong>{' '}
            Gross Volume
          </span>
        </div>

        <div className="text-[11px] text-primary font-medium">
          {validPoints.reduce((sum, p) => sum + p.orderCount, 0)} Total Attributed Orders
        </div>
      </div>
    </div>
  );
}
