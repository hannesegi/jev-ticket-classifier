"use client";

import type { Ticket } from "@/lib/types";

const SENTIMENT_LABEL: Record<string, { text: string; color: string }> = {
  positive: { text: "Positive", color: "text-emerald-400" },
  neutral: { text: "Neutral", color: "text-gray-400" },
  negative: { text: "Negative", color: "text-yellow-400" },
  angry: { text: "Angry", color: "text-red-400" },
};

export default function TicketDetail({ ticket }: { ticket: Ticket | null }) {
  if (!ticket) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center sticky top-24">
        <p className="text-gray-500 text-sm">
          Select a ticket to view details
        </p>
      </div>
    );
  }

  const c = ticket.classification;
  const sentiment = c ? SENTIMENT_LABEL[c.sentiment] : null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden sticky top-24 space-y-0">
      <div className="px-4 py-3 border-b border-gray-800">
        <h2 className="text-sm font-semibold text-gray-300">Ticket Detail</h2>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Subject</p>
          <p className="text-sm text-white font-medium">{ticket.subject}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">From</p>
          <p className="text-sm text-gray-300">{ticket.sender}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Message</p>
          <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
            {ticket.body}
          </p>
        </div>

        {c && (
          <>
            <div className="border-t border-gray-800 pt-4">
              <p className="text-xs text-emerald-400 font-semibold mb-3 uppercase tracking-wide">
                Jev AI Classification
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">
                    Category
                  </p>
                  <p className="text-sm text-white capitalize font-medium">
                    {c.category}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">
                    Sentiment
                  </p>
                  <p className={`text-sm font-medium ${sentiment?.color}`}>
                    {sentiment?.text}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">
                    Urgency
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          c.urgency > 0.7
                            ? "bg-red-500"
                            : c.urgency > 0.4
                              ? "bg-yellow-500"
                              : "bg-emerald-500"
                        }`}
                        style={{ width: `${c.urgency * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">
                      {Math.round(c.urgency * 100)}%
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">
                    Confidence
                  </p>
                  <p className="text-sm text-gray-300">
                    {Math.round(c.confidence * 100)}%
                  </p>
                </div>
              </div>

              {c.tokensSaved > 0 && (
                <div className="mt-3 p-2 bg-emerald-950 border border-emerald-900 rounded-lg">
                  <p className="text-xs text-emerald-400">
                    Saved {c.tokensSaved.toLocaleString()} tokens (~$
                    {(c.tokensSaved * 0.000003).toFixed(6)}) by skipping LLM
                  </p>
                </div>
              )}
            </div>

            <div>
              <p className="text-[10px] text-gray-500 uppercase mb-1">
                Routing Decision
              </p>
              {c.isSpam ? (
                <div className="p-2 bg-purple-950 border border-purple-900 rounded-lg">
                  <p className="text-xs text-purple-300 font-medium">
                    Blocked as spam — no LLM tokens used
                  </p>
                </div>
              ) : c.shouldEscalate ? (
                <div className="p-2 bg-red-950 border border-red-900 rounded-lg">
                  <p className="text-xs text-red-300 font-medium">
                    Escalated to human agent — high urgency / negative sentiment
                  </p>
                </div>
              ) : (
                <div className="p-2 bg-blue-950 border border-blue-900 rounded-lg">
                  <p className="text-xs text-blue-300 font-medium">
                    Routed to OpenRouter (free) for auto-reply
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {ticket.autoReply && (
          <div className="border-t border-gray-800 pt-4">
            <p className="text-xs text-blue-400 font-semibold mb-2 uppercase tracking-wide">
              Auto-Generated Reply (OpenRouter)
            </p>
            <div className="p-3 bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                {ticket.autoReply}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
