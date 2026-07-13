"use client";

import { motion } from "framer-motion";
import { Sparkles, Leaf, TrendingUp, Award, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AIInsight } from "@/lib/data/marketplace-data";

interface AIInsightPanelProps {
  insight: AIInsight;
  className?: string;
}

const GRADE_CONFIG = {
  A: { label: "Grade A", color: "text-moss-500", bg: "bg-moss-50", border: "border-moss-200", description: "Kualitas Premium" },
  B: { label: "Grade B", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", description: "Kualitas Standar" },
  C: { label: "Grade C", color: "text-charcoal-500", bg: "bg-charcoal-50", border: "border-charcoal-200", description: "Kualitas Ekonomis" },
};

const DEMAND_CONFIG = {
  high: { label: "Tinggi", color: "text-moss-600", bar: "bg-moss", width: "w-4/5" },
  medium: { label: "Sedang", color: "text-amber-600", bar: "bg-amber", width: "w-1/2" },
  low: { label: "Rendah", color: "text-charcoal-500", bar: "bg-charcoal-400", width: "w-1/4" },
};

export function AIInsightPanel({ insight, className }: AIInsightPanelProps) {
  const grade = GRADE_CONFIG[insight.quality_grade];
  const demand = DEMAND_CONFIG[insight.market_demand];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-forest-200/60",
        "bg-gradient-to-br from-forest-50 via-white to-moss-50/30",
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
        <Sparkles className="w-full h-full text-forest-600" />
      </div>

      {/* Header */}
      <div className="px-4 py-3 border-b border-forest-100/80 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-gradient-forest flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </div>
        <div>
          <p className="text-xs font-bold text-forest-700">AI Insight</p>
          <p className="text-[9px] text-charcoal-400">Analisis oleh Nyai Nyiur AI</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Quality Grade */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-charcoal-400" />
            <span className="text-xs font-medium text-charcoal-600">Kualitas Produk</span>
          </div>
          <div className={cn("flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold", grade.bg, grade.border, grade.color)}>
            {grade.label}
            <span className="font-normal opacity-75">— {grade.description}</span>
          </div>
        </div>

        {/* Market Demand */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-charcoal-400" />
              <span className="text-xs font-medium text-charcoal-600">Permintaan Pasar</span>
            </div>
            <span className={cn("text-xs font-bold", demand.color)}>{demand.label}</span>
          </div>
          <div className="h-1.5 bg-charcoal-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: undefined }}
              className={cn("h-full rounded-full", demand.bar, demand.width)}
              style={{ transition: "width 1s ease-out 0.5s" }}
            />
          </div>
        </div>

        {/* Suitable For */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-charcoal-400" />
            <span className="text-xs font-medium text-charcoal-600">Cocok Untuk</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {insight.suitable_for.map((use) => (
              <span
                key={use}
                className="px-2.5 py-1 rounded-full bg-white border border-forest-200 text-[10px] font-medium text-forest-700"
              >
                {use}
              </span>
            ))}
          </div>
        </div>

        {/* Suggested Uses */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-charcoal-400" />
            <span className="text-xs font-medium text-charcoal-600">Saran Penggunaan</span>
          </div>
          <ul className="space-y-1">
            {insight.suggested_uses.slice(0, 3).map((use, i) => (
              <li key={i} className="flex items-center gap-2 text-xs text-charcoal-600">
                <div className="w-1.5 h-1.5 rounded-full bg-forest-400 flex-shrink-0" />
                {use}
              </li>
            ))}
          </ul>
        </div>

        {/* Eco Impact */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-moss-50 border border-moss-200/60">
          <Leaf className="w-4 h-4 text-moss-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-bold text-moss-700 uppercase tracking-wide mb-0.5">
              Dampak Lingkungan
            </p>
            <p className="text-xs text-moss-600">{insight.co2_impact}</p>
          </div>
        </div>

        {/* Extra specs if available */}
        {(insight.purity || insight.calorific_value) && (
          <div className="grid grid-cols-2 gap-2">
            {insight.purity && (
              <div className="bg-white rounded-xl border border-border/60 p-3">
                <p className="text-[9px] text-charcoal-400 uppercase font-bold tracking-wide mb-0.5">Kemurnian</p>
                <p className="text-sm font-bold text-charcoal-800">{insight.purity}</p>
              </div>
            )}
            {insight.calorific_value && (
              <div className="bg-white rounded-xl border border-border/60 p-3">
                <p className="text-[9px] text-charcoal-400 uppercase font-bold tracking-wide mb-0.5">Nilai Kalor</p>
                <p className="text-sm font-bold text-charcoal-800">{insight.calorific_value}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
