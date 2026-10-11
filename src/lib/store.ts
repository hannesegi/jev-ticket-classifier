import type { Ticket, Stats } from "./types";

const tickets: Map<string, Ticket> = new Map();

export function getTickets(): Ticket[] {
  return Array.from(tickets.values()).sort(
    (a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
  );
}

export function getTicket(id: string): Ticket | undefined {
  return tickets.get(id);
}

export function saveTicket(ticket: Ticket): Ticket {
  tickets.set(ticket.id, ticket);
  return ticket;
}

export function deleteTicket(id: string): boolean {
  return tickets.delete(id);
}

export function getStats(): Stats {
  const all = getTickets();
  const classified = all.filter((t) => t.classification);
  const autoReplied = all.filter((t) => t.autoReply);
  const escalated = all.filter((t) => t.classification?.shouldEscalate);
  const spamBlocked = all.filter((t) => t.classification?.isSpam);

  const categoryBreakdown: Record<string, number> = {};
  const sentimentBreakdown: Record<string, number> = {};

  for (const t of classified) {
    const cat = t.classification!.category;
    categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + 1;
    const sent = t.classification!.sentiment;
    sentimentBreakdown[sent] = (sentimentBreakdown[sent] || 0) + 1;
  }

  const totalTokensSaved = classified.reduce(
    (sum, t) => sum + (t.classification?.tokensSaved || 0),
    0
  );

  const llmCostPerToken = 0.000003;
  const totalCostSaved = totalTokensSaved * llmCostPerToken;

  const avgUrgency =
    classified.length > 0
      ? classified.reduce((sum, t) => sum + (t.classification?.urgency || 0), 0) /
        classified.length
      : 0;

  return {
    totalTickets: all.length,
    classified: classified.length,
    autoReplied: autoReplied.length,
    escalated: escalated.length,
    spamBlocked: spamBlocked.length,
    avgUrgency: Math.round(avgUrgency * 100) / 100,
    totalTokensSaved,
    totalCostSaved: Math.round(totalCostSaved * 1000000) / 1000000,
    categoryBreakdown,
    sentimentBreakdown,
  };
}
