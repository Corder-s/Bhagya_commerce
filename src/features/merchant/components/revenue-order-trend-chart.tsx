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

  // Theme-aware color parameters
  const gridColor = isDark ? '#403D36' : '#E6DDCE';
  const axisColor = isDark ? '#AAA397' : '#7B756B';
  const primaryLineColor = '#C49A45';
  const secondaryLineColor = isDark ? '#8F897D' : '#A89D8B';

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

  const netPath = createLinePath(netCoords);
  const grossPath = createLinePath(grossCoords);

  const netAreaPath =
    netCoords.length > 0
      ? `${netPath} L ${netCoords[netCoords.length - 1].x} ${padding.top + plotHeight} L ${netCoords[0].x} ${padding.top + plotHeight} Z`
      : '';

  // Y-axis grid lines (4 ticks)
  const yTicks = [0, 0.33, 0.66, 1].map((ratio) => ({
    val: Math.round(maxSales * 1.15 * ratio),
    y: padding.top + plotHeight - ratio * plotHeight,
  }));

  const activePoint = hoveredIdx !== null ? validPoints[hoveredIdx] : null;

  return (
    <div className="relative flex flex-col rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-md transition-colors">
      {/* Chart Header with Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-primary" />
            <h3 className="font-serif text-lg font-semibold text-ink">Revenue & Order Trend</h3>
          </div>
          <p className="text-xs text-ink-soft mt-0.5">
            Daily verified sales trajectory for {storeName}
          </p>
        </div>

        {/* Metric Toggles & Legend */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveMetric('both')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              activeMetric === 'both'
                ? 'bg-surface-sunken text-ink border border-line-strong'
                : 'text-ink-soft hover:text-ink hover:bg-surface-sunken'
            }`}
          >
            <span className="size-2 rounded-full bg-primary" />
            <span>Net & Gross</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMetric('net')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              activeMetric === 'net'
                ? 'bg-surface-sunken text-primary border border-primary/40'
                : 'text-ink-soft hover:text-primary hover:bg-surface-sunken'
            }`}
          >
            <span className="size-2 rounded-full bg-primary" />
            <span>Net Sales</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMetric('gross')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              activeMetric === 'gross'
                ? 'bg-surface-sunken text-ink border border-line-strong'
                : 'text-ink-soft hover:text-ink hover:bg-surface-sunken'
            }`}
          >
            <span className="size-2 rounded-full bg-ink-soft" />
            <span>Gross Sales</span>
          </button>
        </div>
      </div>

      {/* Interactive SVG Chart Plotting Surface */}
      <div className="relative w-full mt-4" style={{ minHeight: `${height}px`, height: `${height}px` }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={`net-gradient-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C49A45" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#C49A45" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Background Grid Lines */}
          {yTicks.map((tick, i) => (
            <g key={i} className="transition-opacity">
              <line
                x1={padding.left}
                y1={tick.y}
                x2={svgWidth - padding.right}
                y2={tick.y}
                stroke={gridColor}
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={padding.left - 10}
                y={tick.y + 4}
                textAnchor="end"
                fill={axisColor}
                fontSize="10"
                fontFamily="sans-serif"
              >
                ₹{tick.val >= 1000 ? `${Math.round(tick.val / 1000)}k` : tick.val}
              </text>
            </g>
          ))}

          {/* Area Fill for Net Sales */}
          {(activeMetric === 'both' || activeMetric === 'net') && (
            <path d={netAreaPath} fill={`url(#net-gradient-${gradientId})`} />
          )}

          {/* Gross Sales Line (Secondary) */}
          {(activeMetric === 'both' || activeMetric === 'gross') && (
            <path
              d={grossPath}
              fill="none"
              stroke={secondaryLineColor}
              strokeWidth="2.5"
              strokeDasharray="5 3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Net Sales Line (Rich Bhagya Gold) */}
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
                    stroke="#C49A45"
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
                    fill={isDark ? '#2B2A25' : '#FFFDF8'}
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
                    fill="#C49A45"
                    stroke={isDark ? '#F5F1E8' : '#181714'}
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
                  fill={isHovered ? (isDark ? '#F5F1E8' : '#181714') : axisColor}
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
                ? 'border-[#575042] bg-[#35332C] text-[#F5F1E8]'
                : 'border-[#D2C2A5] bg-[#FFFDF8] text-[#181714]'
            }`}
          >
            <div className={`flex items-center justify-between border-b pb-1.5 mb-2 ${isDark ? 'border-[#444139]' : 'border-[#E2D7C3]'}`}>
              <span className="font-serif text-xs font-bold">
                {activePoint.date}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-success">
                <ShoppingBag className="size-3" /> {activePoint.orderCount} orders
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-ink-soft flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-[#C49A45]" /> Net Sales
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
