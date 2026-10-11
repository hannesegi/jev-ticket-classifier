"use client";

import type { Stats } from "@/lib/types";

const CATEGORY_COLORS: Record<string, string> = {
  billing: "bg-yellow-500",
  technical: "bg-red-500",
  sales: "bg-blue-500",
  general: "bg-gray-500",
  spam: "bg-purple-500",
};

export default function StatsCards({ stats }: { stats: Stats }) {
  const cards = [
    {
      label: "Total Tickets",
      value: stats.totalTickets,
      color: "text-white",
    },
    {
      label: "Classified",
      value: stats.classified,
      color: "text-emerald-400",
    },
    {
      label: "Auto-Replied",
      value: stats.autoReplied,
      color: "text-blue-400",
    },
    {
      label: "Escalated",
      value: stats.escalated,
      color: "text-orange-400",
    },
    {
      label: "Spam Blocked",
      value: stats.spamBlocked,
      color: "text-purple-400",
    },
    {
      label: "Tokens Saved",
      value: stats.totalTokensSaved.toLocaleString(),
      color: "text-emerald-400",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4"
          >
            <p className="text-xs text-gray-400 mb-1">{card.label}</p>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {Object.keys(stats.categoryBreakdown).length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-3">Category Distribution</p>
          <div className="flex gap-1 h-4 rounded-full overflow-hidden bg-gray-800">
            {Object.entries(stats.categoryBreakdown).map(([cat, count]) => (
              <div
                key={cat}
                className={`${CATEGORY_COLORS[cat] || "bg-gray-600"} transition-all`}
                style={{
                  width: `${(count / stats.classified) * 100}%`,
                }}
                title={`${cat}: ${count}`}
              />
            ))}
          </div>
          <div className="flex gap-4 mt-2 flex-wrap">
            {Object.entries(stats.categoryBreakdown).map(([cat, count]) => (
              <div key={cat} className="flex items-center gap-1.5">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${CATEGORY_COLORS[cat] || "bg-gray-600"}`}
                />
                <span className="text-xs text-gray-400 capitalize">
                  {cat} ({count})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
