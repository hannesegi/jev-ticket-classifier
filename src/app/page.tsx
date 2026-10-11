"use client";

import { useState, useEffect, useCallback } from "react";
import type { Ticket, Stats } from "@/lib/types";
import StatsCards from "@/components/StatsCards";
import TicketList from "@/components/TicketList";
import TicketDetail from "@/components/TicketDetail";
import NewTicketForm from "@/components/NewTicketForm";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";

export default function Home() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [showArchitecture, setShowArchitecture] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    const res = await fetch("/api/tickets");
    const data = await res.json();
    setTickets(data.tickets);
  }, []);

  const fetchStats = useCallback(async () => {
    const res = await fetch("/api/stats");
    const data = await res.json();
    setStats(data);
  }, []);

  useEffect(() => {
    fetchTickets();
    fetchStats();
  }, [fetchTickets, fetchStats]);

  async function loadSampleData() {
    setLoading(true);
    const sampleData = await import("@/data/sample-tickets.json");
    for (const sample of sampleData.default) {
      await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...sample, autoProcess: false }),
      });
    }
    await fetchTickets();
    await fetchStats();
    setLoading(false);
  }

  async function processTicket(ticket: Ticket) {
    setProcessingId(ticket.id);

    const classifyRes = await fetch("/api/classify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ticketId: ticket.id,
        subject: ticket.subject,
        body: ticket.body,
      }),
    });
    const { classification } = await classifyRes.json();

    if (!classification.isSpam && !classification.shouldEscalate) {
      await fetch("/api/generate-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: ticket.id,
          category: classification.category,
          subject: ticket.subject,
          body: ticket.body,
        }),
      });
    }

    await fetchTickets();
    await fetchStats();
    setProcessingId(null);
  }

  async function processAll() {
    setLoading(true);
    const unprocessed = tickets.filter((t) => t.status === "new");
    for (const ticket of unprocessed) {
      await processTicket(ticket);
    }
    setLoading(false);
  }

  async function handleNewTicket(data: {
    subject: string;
    body: string;
    sender: string;
  }) {
    await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, autoProcess: true }),
    });
    await fetchTickets();
    await fetchStats();
    setShowNewForm(false);
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-gray-950 text-lg">
              J
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">JevRoute AI</h1>
              <p className="text-xs text-gray-400">
                Smart Ticket Classifier & Auto-Router
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowArchitecture(!showArchitecture)}
              className="px-3 py-2 text-sm rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
            >
              Architecture
            </button>
            <button
              onClick={() => setShowNewForm(true)}
              className="px-3 py-2 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
            >
              + New Ticket
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {showArchitecture && <ArchitectureDiagram />}

        {stats && <StatsCards stats={stats} />}

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={loadSampleData}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {loading ? "Loading..." : "Load Sample Tickets"}
          </button>
          {tickets.some((t) => t.status === "new") && (
            <button
              onClick={processAll}
              disabled={loading}
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 transition-colors"
            >
              {loading ? "Processing..." : "Classify & Route All"}
            </button>
          )}
          <span className="text-xs text-gray-500">
            {tickets.length} ticket{tickets.length !== 1 ? "s" : ""}
            {" | "}Demo Mode (no API keys required)
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TicketList
              tickets={tickets}
              selectedId={selectedTicket?.id}
              processingId={processingId}
              onSelect={setSelectedTicket}
              onProcess={processTicket}
            />
          </div>
          <div>
            <TicketDetail ticket={selectedTicket} />
          </div>
        </div>
      </main>

      {showNewForm && (
        <NewTicketForm
          onSubmit={handleNewTicket}
          onClose={() => setShowNewForm(false)}
        />
      )}
    </div>
  );
}
