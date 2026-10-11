import { NextRequest, NextResponse } from "next/server";
import { classifyTicket } from "@/lib/jev";
import { getTicket, saveTicket } from "@/lib/store";

export async function POST(req: NextRequest) {
  const { ticketId, subject, body } = await req.json();

  if (!subject || !body) {
    return NextResponse.json(
      { error: "subject and body are required" },
      { status: 400 }
    );
  }

  const classification = await classifyTicket(subject, body);

  if (ticketId) {
    const ticket = getTicket(ticketId);
    if (ticket) {
      ticket.classification = classification;
      ticket.status = classification.shouldEscalate
        ? "escalated"
        : "classified";
      saveTicket(ticket);
    }
  }

  return NextResponse.json({ classification });
}
