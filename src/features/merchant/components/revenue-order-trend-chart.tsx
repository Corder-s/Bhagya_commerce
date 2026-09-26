'use client';

import React, { useState, useId } from 'react';
import { formatCurrency, formatNumber } from '@/lib/format';
import { TrendingUp, ShoppingBag, Eye, Info } from 'lucide-react';

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
        className="flex flex-col items-center justify-center rounded-2xl border border-[#444139] bg-[#2B2A25] p-6 text-center"
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-[#35332C] text-[#C49A45] mb-3">
          <Info className="size-6" />
        </div>
        <h4 className="font-serif text-base font-semibold text-[#F5F1E8]">
          No sales data available for this period
        </h4>
        <p className="mt-1 max-w-sm text-xs text-[#9E988C]">
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
    <div className="relative flex flex-col rounded-2xl border border-[#444139] bg-[#2B2A25] p-5 sm:p-6 shadow-md transition-colors">
      {/* Chart Header with Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#3A3831] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-[#C49A45]" />
            <h3 className="font-serif text-lg font-semibold text-[#F5F1E8]">Revenue & Order Trend</h3>
          </div>
          <p className="text-xs text-[#9E988C] mt-0.5">
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
                ? 'bg-[#35332C] text-[#F5F1E8] border border-[#5B533F]'
                : 'text-[#9E988C] hover:text-[#F5F1E8] hover:bg-[#302F29]'
            }`}
          >
            <span className="size-2 rounded-full bg-[#C49A45]" />
            <span>Net & Gross</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMetric('net')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              activeMetric === 'net'
                ? 'bg-[#35332C] text-[#C49A45] border border-[#C49A45]/40'
                : 'text-[#9E988C] hover:text-[#C49A45] hover:bg-[#302F29]'
            }`}
          >
            <span className="size-2 rounded-full bg-[#C49A45]" />
            <span>Net Sales</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMetric('gross')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              activeMetric === 'gross'
                ? 'bg-[#35332C] text-[#DDBB72] border border-[#DDBB72]/40'
                : 'text-[#9E988C] hover:text-[#DDBB72] hover:bg-[#302F29]'
            }`}
          >
            <span className="size-2 rounded-full bg-[#C8C1B4]" />
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
              <stop offset="0%" stopColor="#C49A45" stopOpacity="0.35" />
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
                stroke="#3A3831"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={padding.left - 10}
                y={tick.y + 4}
                textAnchor="end"
                fill="#9E988C"
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

          {/* Gross Sales Line (Muted Beige / Soft Gold-Gray) */}
          {(activeMetric === 'both' || activeMetric === 'gross') && (
            <path
              d={grossPath}
              fill="none"
              stroke="#C8C1B4"
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
              stroke="#C49A45"
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
                    fill="#2B2A25"
                    stroke="#C8C1B4"
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
                    stroke="#F5F1E8"
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
                  fill={isHovered ? '#F5F1E8' : '#9E988C'}
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

        {/* High-Contrast Floating Tooltip (Warm-White Surface, Dark Text, Gold Accents, Beige Border) */}
        {activePoint && hoveredIdx !== null && (
          <div
            style={{
              left: `${((getX(hoveredIdx) - padding.left) / plotWidth) * 80 + 10}%`,
              top: '15px',
            }}
            className="pointer-events-none absolute z-20 min-w-[170px] rounded-xl border border-[#D7C6A8] bg-[#FFFDF8] p-3 shadow-xl animate-in fade-in zoom-in-95 text-[#181818]"
          >
            <div className="flex items-center justify-between border-b border-[#E5D9C5] pb-1.5 mb-2">
              <span className="font-serif text-xs font-bold text-[#181818]">
                {activePoint.date}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-[#43A66A]">
                <ShoppingBag className="size-3" /> {activePoint.orderCount} orders
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#5E5A52] flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-[#C49A45]" /> Net Sales
                </span>
                <strong className="font-semibold text-[#9A6A20]">
                  {formatCurrency(activePoint.netSales)}
                </strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#5E5A52] flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-[#C8C1B4]" /> Gross Sales
                </span>
                <span className="text-[#181818] font-medium">
                  {formatCurrency(activePoint.grossSales)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chart Footer Summary Bar */}
      <div className="mt-2 pt-3 border-t border-[#3A3831] flex flex-wrap items-center justify-between text-xs text-[#9E988C] gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#C49A45]" />
            <strong className="text-[#F5F1E8]">
              {formatCurrency(validPoints.reduce((sum, p) => sum + p.netSales, 0))}
            </strong>{' '}
            Net Volume
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#C8C1B4]" />
            <strong className="text-[#C8C1B4]">
              {formatCurrency(validPoints.reduce((sum, p) => sum + p.grossSales, 0))}
            </strong>{' '}
            Gross Volume
          </span>
        </div>

        <div className="text-[11px] text-[#C49A45] font-medium">
          {validPoints.reduce((sum, p) => sum + p.orderCount, 0)} Total Attributed Orders
        </div>
      </div>
    </div>
  );
}
