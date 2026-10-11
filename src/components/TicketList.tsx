"use client";

import type { Ticket } from "@/lib/types";

const STATUS_STYLES: Record<string, string> = {
  new: "bg-gray-700 text-gray-300",
  classified: "bg-emerald-900 text-emerald-300",
  replied: "bg-blue-900 text-blue-300",
  escalated: "bg-orange-900 text-orange-300",
};

const CATEGORY_STYLES: Record<string, string> = {
  billing: "bg-yellow-900 text-yellow-300",
  technical: "bg-red-900 text-red-300",
  sales: "bg-blue-900 text-blue-300",
  general: "bg-gray-700 text-gray-300",
  spam: "bg-purple-900 text-purple-300",
};

interface TicketListProps {
  tickets: Ticket[];
  selectedId?: string;
  processingId: string | null;
  onSelect: (ticket: Ticket) => void;
  onProcess: (ticket: Ticket) => void;
}

export default function TicketList({
  tickets,
  selectedId,
  processingId,
  onSelect,
  onProcess,
}: TicketListProps) {
  if (tickets.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
        <div className="text-4xl mb-3">&#x1f4e8;</div>
        <p className="text-gray-400 text-sm">No tickets yet</p>
        <p className="text-gray-500 text-xs mt-1">
          Load sample tickets or create a new one to get started
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-800">
        <h2 className="text-sm font-semibold text-gray-300">
          Tickets ({tickets.length})
        </h2>
      </div>
      <div className="divide-y divide-gray-800 max-h-[600px] overflow-y-auto">
        {tickets.map((ticket) => {
          const isProcessing = processingId === ticket.id;
          const isSelected = selectedId === ticket.id;

          return (
            <div
              key={ticket.id}
              onClick={() => onSelect(ticket)}
              className={`px-4 py-3 cursor-pointer transition-colors ${
                isSelected
                  ? "bg-gray-800"
                  : "hover:bg-gray-800/50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${STATUS_STYLES[ticket.status]}`}
                    >
                      {ticket.status}
                    </span>
                    {ticket.classification && (
                      <span
                        className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${CATEGORY_STYLES[ticket.classification.category]}`}
                      >
                        {ticket.classification.category}
                      </span>
                    )}
                    {ticket.classification?.isSpam && (
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-purple-900 text-purple-300">
                        SPAM
                      </span>
                    )}
                    {ticket.classification?.shouldEscalate && (
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-red-900 text-red-300">
                        ESCALATE
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-200 truncate">
                    {ticket.subject}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {ticket.sender} &middot;{" "}
                    {new Date(ticket.receivedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {ticket.classification && (
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Urgency</div>
                      <div
                        className={`text-sm font-bold ${
                          ticket.classification.urgency > 0.7
                            ? "text-red-400"
                            : ticket.classification.urgency > 0.4
                              ? "text-yellow-400"
                              : "text-emerald-400"
                        }`}
                      >
                        {Math.round(ticket.classification.urgency * 100)}%
                      </div>
                    </div>
                  )}
                  {ticket.status === "new" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onProcess(ticket);
                      }}
                      disabled={isProcessing}
                      className="px-3 py-1.5 text-xs rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50 transition-colors"
                    >
                      {isProcessing ? "..." : "Process"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
