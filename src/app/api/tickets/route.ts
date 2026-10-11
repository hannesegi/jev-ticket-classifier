import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getTickets, getTicket, saveTicket, deleteTicket } from "@/lib/store";
import { classifyTicket } from "@/lib/jev";
import { generateReply } from "@/lib/openrouter";
import type { Ticket } from "@/lib/types";

export async function GET() {
  return NextResponse.json({ tickets: getTickets() });
}

export async function POST(req: NextRequest) {
  const { subject, body, sender, autoProcess } = await req.json();

  if (!subject || !body || !sender) {
    return NextResponse.json(
      { error: "subject, body, and sender are required" },
      { status: 400 }
    );
  }

  const ticket: Ticket = {
    id: uuidv4(),
    subject,
    body,
    sender,
    receivedAt: new Date().toISOString(),
    status: "new",
  };

  saveTicket(ticket);

  if (autoProcess) {
    const classification = await classifyTicket(subject, body);
    ticket.classification = classification;
    ticket.status = classification.shouldEscalate
      ? "escalated"
      : "classified";

    if (!classification.isSpam && !classification.shouldEscalate) {
      const reply = await generateReply(
        classification.category,
        subject,
        body
      );
      ticket.autoReply = reply;
      ticket.status = "replied";
    }

    saveTicket(ticket);
  }

  return NextResponse.json({ ticket }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const deleted = deleteTicket(id);
  return NextResponse.json({ deleted });
}
